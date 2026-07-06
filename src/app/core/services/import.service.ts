import { Injectable, inject } from '@angular/core';
import {
  Background, DndClass, Feat, OptionPool, Spell, Subclass
} from '../models/content.model';
import { ContentService } from './content.service';

export interface ImportPayload {
  classes?: DndClass[];
  subclasses?: Subclass[];
  backgrounds?: Background[];
  spells?: Spell[];
  optionPools?: OptionPool[];
  feats?: Feat[];
}

export interface ImportResult {
  valid: boolean;
  errors: string[];
  summary: { kind: string; count: number }[];
  payload?: ImportPayload;
}

// ============================================================
// Validazione e importazione contenuti da file JSON.
// Formato accettato: un oggetto con una o più chiavi tra
// classes, subclasses, backgrounds, spells, optionPools.
// ============================================================
@Injectable({ providedIn: 'root' })
export class ImportService {
  private content = inject(ContentService);

  validate(json: string): ImportResult {
    const errors: string[] = [];
    let raw: unknown;
    try {
      raw = JSON.parse(json);
    } catch (e) {
      return { valid: false, errors: [`JSON non valido: ${(e as Error).message}`], summary: [] };
    }
    if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) {
      return { valid: false, errors: ['Il file deve contenere un oggetto JSON con chiavi: classes, subclasses, backgrounds, spells, optionPools.'], summary: [] };
    }

    const data = raw as Record<string, unknown>;
    const known = ['classes', 'subclasses', 'backgrounds', 'spells', 'optionPools', 'feats'];
    const present = known.filter(k => k in data);
    if (present.length === 0) {
      return { valid: false, errors: [`Nessuna sezione riconosciuta. Chiavi ammesse: ${known.join(', ')}.`], summary: [] };
    }
    for (const key of Object.keys(data)) {
      if (!known.includes(key)) errors.push(`Chiave sconosciuta "${key}" ignorabile — chiavi ammesse: ${known.join(', ')}.`);
    }
    for (const key of present) {
      if (!Array.isArray(data[key])) errors.push(`"${key}" deve essere un array.`);
    }
    if (errors.length) return { valid: false, errors, summary: [] };

    const payload: ImportPayload = {
      classes: (data['classes'] as DndClass[]) ?? [],
      subclasses: (data['subclasses'] as Subclass[]) ?? [],
      backgrounds: (data['backgrounds'] as Background[]) ?? [],
      spells: (data['spells'] as Spell[]) ?? [],
      optionPools: (data['optionPools'] as OptionPool[]) ?? [],
      feats: (data['feats'] as Feat[]) ?? []
    };

    // Insiemi di id noti (esistenti + in importazione) per i controlli referenziali
    const classIds = new Set([...this.content.classes().map(c => c.id), ...payload.classes!.map(c => c?.id)]);
    const subclassIds = new Set([...this.content.subclasses().map(s => s.id), ...payload.subclasses!.map(s => s?.id)]);
    const poolIds = new Set([...this.content.optionPools().map(p => p.id), ...payload.optionPools!.map(p => p?.id)]);
    const skillIds = new Set(this.content.skills.map(s => s.id));

    payload.optionPools!.forEach((p, i) => {
      const at = `optionPools[${i}]`;
      this.req(errors, at, p, ['id', 'name']);
      if (p && !Array.isArray(p.options)) errors.push(`${at}: "options" deve essere un array.`);
      p?.options?.forEach((o, j) => this.req(errors, `${at}.options[${j}]`, o, ['id', 'name', 'description']));
    });

    payload.classes!.forEach((c, i) => {
      const at = `classes[${i}]`;
      this.req(errors, at, c, ['id', 'name', 'description', 'hitDie']);
      if (!c) return;
      if (typeof c.hitDie === 'number' && ![4, 6, 8, 10, 12].includes(c.hitDie)) errors.push(`${at}: hitDie deve essere 4, 6, 8, 10 o 12.`);
      if (!Array.isArray(c.features)) errors.push(`${at}: "features" deve essere un array.`);
      this.checkFeatures(errors, at, c.features, poolIds, skillIds);
      c.skillChoices?.from?.forEach(id => {
        if (!skillIds.has(id)) errors.push(`${at}: abilità sconosciuta "${id}" in skillChoices.`);
      });
    });

    payload.subclasses!.forEach((s, i) => {
      const at = `subclasses[${i}]`;
      this.req(errors, at, s, ['id', 'name', 'classId', 'description']);
      if (!s) return;
      if (s.classId && !classIds.has(s.classId)) errors.push(`${at}: la classe "${s.classId}" non esiste (né nel catalogo né nell'importazione).`);
      this.checkFeatures(errors, at, s.features, poolIds, skillIds);
    });

    payload.backgrounds!.forEach((b, i) => {
      const at = `backgrounds[${i}]`;
      this.req(errors, at, b, ['id', 'name', 'description']);
      b?.skillProficiencies?.forEach(id => {
        if (!skillIds.has(id)) errors.push(`${at}: abilità sconosciuta "${id}" in skillProficiencies.`);
      });
      if (b && b.feature && (!b.feature.name || !b.feature.description)) {
        errors.push(`${at}: "feature" richiede name e description.`);
      }
    });

    payload.spells!.forEach((s, i) => {
      const at = `spells[${i}]`;
      this.req(errors, at, s, ['id', 'name', 'school', 'description']);
      if (!s) return;
      if (typeof s.level !== 'number' || s.level < 0 || s.level > 9) errors.push(`${at}: "level" deve essere un numero tra 0 (trucchetto) e 9.`);
      if (!Array.isArray(s.classIds)) errors.push(`${at}: "classIds" deve essere un array (anche vuoto).`);
      if (s.subclassIds !== undefined && !Array.isArray(s.subclassIds)) errors.push(`${at}: "subclassIds" deve essere un array (anche vuoto).`);
      s.classIds?.forEach(id => { if (!classIds.has(id)) errors.push(`${at}: classe sconosciuta "${id}" in classIds.`); });
      if (Array.isArray(s.subclassIds)) s.subclassIds.forEach(id => { if (!subclassIds.has(id)) errors.push(`${at}: sottoclasse sconosciuta "${id}" in subclassIds.`); });
    });

    payload.feats!.forEach((f, i) => {
      const at = `feats[${i}]`;
      this.req(errors, at, f, ['id', 'name', 'description']);
      if (f && f.benefits !== undefined && !Array.isArray(f.benefits)) {
        errors.push(`${at}: "benefits" deve essere un array di stringhe.`);
      }
    });

    // Anti-doppioni: blocca elementi con lo stesso nome di un contenuto esistente ma id diverso
    this.checkNameCollisions(errors, 'classes', payload.classes!, this.content.classes());
    this.checkNameCollisions(errors, 'subclasses', payload.subclasses!, this.content.subclasses());
    this.checkNameCollisions(errors, 'backgrounds', payload.backgrounds!, this.content.backgrounds());
    this.checkNameCollisions(errors, 'spells', payload.spells!, this.content.spells());
    this.checkNameCollisions(errors, 'optionPools', payload.optionPools!, this.content.optionPools());
    this.checkNameCollisions(errors, 'feats', payload.feats!, this.content.feats());

    const summary = [
      { kind: 'Classi', count: payload.classes!.length },
      { kind: 'Sottoclassi', count: payload.subclasses!.length },
      { kind: 'Background', count: payload.backgrounds!.length },
      { kind: 'Incantesimi', count: payload.spells!.length },
      { kind: 'Pool di opzioni', count: payload.optionPools!.length },
      { kind: 'Talenti', count: payload.feats!.length }
    ].filter(s => s.count > 0);

    return { valid: errors.length === 0, errors, summary, payload };
  }

  async import(payload: ImportPayload): Promise<void> {
    await this.content.bulkImport(this.normalize(payload));
  }

  /** Completa i campi opzionali mancanti così i dati importati non rompono mai i filtri dell'app. */
  private normalize(payload: ImportPayload): ImportPayload {
    return {
      classes: payload.classes?.map(c => ({
        ...c,
        savingThrows: c.savingThrows ?? [],
        armorProficiencies: c.armorProficiencies ?? [],
        weaponProficiencies: c.weaponProficiencies ?? [],
        toolProficiencies: c.toolProficiencies ?? [],
        skillChoices: c.skillChoices ?? { count: 0, from: [] },
        equipment: c.equipment ?? [],
        features: c.features ?? [],
        resources: c.resources ?? [],
        subclassLevel: c.subclassLevel ?? 3,
        subclassTitle: c.subclassTitle ?? 'Sottoclasse',
        icon: c.icon ?? '⚔️'
      })),
      subclasses: payload.subclasses?.map(s => ({ ...s, features: s.features ?? [] })),
      backgrounds: payload.backgrounds?.map(b => ({
        ...b,
        skillProficiencies: b.skillProficiencies ?? [],
        toolProficiencies: b.toolProficiencies ?? [],
        languages: b.languages ?? [],
        equipment: b.equipment ?? [],
        feature: b.feature ?? { name: '', description: '' },
        icon: b.icon ?? '📜'
      })),
      spells: payload.spells?.map(s => ({
        ...s,
        classIds: s.classIds ?? [],
        subclassIds: s.subclassIds ?? [],
        concentration: !!s.concentration,
        castingTime: s.castingTime ?? '1 azione',
        range: s.range ?? '—',
        components: s.components ?? '—',
        duration: s.duration ?? 'Istantanea'
      })),
      optionPools: payload.optionPools?.map(p => ({ ...p, options: p.options ?? [] })),
      feats: payload.feats?.map(f => ({ ...f, benefits: f.benefits ?? [] }))
    };
  }

  private checkNameCollisions<T extends { id: string; name: string }>(
    errors: string[], section: string, incoming: T[], existing: T[]
  ): void {
    const byName = new Map(existing.map(e => [e.name.trim().toLowerCase(), e]));
    incoming.forEach((item, i) => {
      if (!item?.name || !item?.id) return;
      const match = byName.get(item.name.trim().toLowerCase());
      if (match && match.id !== item.id) {
        errors.push(`${section}[${i}]: esiste già "${match.name}" con id "${match.id}". Usa lo stesso id per aggiornarlo, oppure cambia nome per evitare doppioni.`);
      }
    });
  }

  private req(errors: string[], at: string, obj: unknown, fields: string[]): void {
    if (typeof obj !== 'object' || obj === null) {
      errors.push(`${at}: elemento non valido (atteso un oggetto).`);
      return;
    }
    const rec = obj as Record<string, unknown>;
    for (const f of fields) {
      if (rec[f] === undefined || rec[f] === null || rec[f] === '') errors.push(`${at}: campo obbligatorio "${f}" mancante.`);
    }
  }

  private checkFeatures(errors: string[], at: string, features: unknown, poolIds: Set<string>, skillIds: Set<string>): void {
    if (!Array.isArray(features)) return;
    features.forEach((f, j) => {
      const fat = `${at}.features[${j}]`;
      this.req(errors, fat, f, ['id', 'name', 'description', 'level']);
      if (!f) return;
      if (f.actionType && !['action', 'bonus', 'reaction', 'none'].includes(f.actionType)) {
        errors.push(`${fat}: actionType deve essere "action", "bonus", "reaction" o "none".`);
      }
      if (f.selection) {
        if (!f.selection.poolId || !poolIds.has(f.selection.poolId)) {
          errors.push(`${fat}: selection.poolId "${f.selection?.poolId}" non corrisponde a nessun pool di opzioni.`);
        }
        if (!Array.isArray(f.selection.unlocks) || f.selection.unlocks.length === 0) {
          errors.push(`${fat}: selection.unlocks deve essere un array non vuoto di { level, maxTotal }.`);
        }
      }
      if (f.effect) {
        if (!['expertise', 'half-proficiency'].includes(f.effect.type)) {
          errors.push(`${fat}: effect.type deve essere "expertise" o "half-proficiency".`);
        }
        if (f.effect.type === 'expertise' && (!Array.isArray(f.effect.tiers) || f.effect.tiers.length === 0)) {
          errors.push(`${fat}: effect.tiers deve essere un array non vuoto di { level, count }.`);
        }
        f.effect.eligibleSkillIds?.forEach((id: string) => {
          if (!skillIds.has(id)) errors.push(`${fat}: abilità sconosciuta "${id}" in effect.eligibleSkillIds.`);
        });
      }
    });
  }
}
