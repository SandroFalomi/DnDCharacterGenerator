# Grimorio — Schede Personaggio D&D 5e

Applicativo web **interamente client-side** per creare, consultare e gestire schede personaggio di Dungeons & Dragons 5ª Edizione, con tema **dark fantasy**.

## Stack

| Layer | Tecnologia |
|---|---|
| Framework | Angular 20 (Standalone Components, Signals) |
| Drag & Drop | Angular CDK |
| Animazioni | @angular/animations |
| Persistenza | Dexie.js su IndexedDB |
| Stili | SCSS (tema globale + variabili CSS) |
| Linguaggio | TypeScript strict |

## Avvio

```bash
npm install
npx ng serve
# → http://localhost:4200
```

## Funzionalità

- **Home** con due sezioni: gestione personaggi (CRUD con card e modali) e **Compendio delle Classi** (classi, abilità per livello, sottoclassi, sotto-abilità selezionabili, risorse speciali).
- **Creazione guidata** in 6-8 step: nome, razza, background, classe (con **multiclasse**), caratteristiche (array standard drag&drop / point buy / manuale, con modificatori razziali opzionali), competenze (con **Maestria** guidata e sotto-opzioni), incantesimi (solo per incantatori), riepilogo.
- **Creazione libera**: scheda vuota compilabile a mano.
- **Scheda personaggio** completa: editing inline con salvataggio automatico, tiri salvezza, 18 abilità calcolate (competenza, **Maestria ×2**, **Factotum ½**), combattimento, attacchi, tratti, sezione abilità compatta con **modale dell'elenco completo** (razza / background / classe / sottoclasse / sotto-abilità selezionate), sezione incantesimi con slot (regole multiclasse + magia del patto) e modale di gestione.
- **Gestione Contenuti (Developer)**: CRUD completo di classi, sottoclassi, abilità (con livello di sblocco, effetti speciali e sotto-opzioni), pool di sotto-abilità, background e incantesimi (con classi/sottoclassi abilitate). Import di contenuti da **file JSON validato**.

## Architettura dei contenuti

I dati statici in `src/app/data/` vengono **seminati in IndexedDB al primo avvio**; da lì in poi il catalogo è gestito dalla sezione Developer tramite `ContentService` (repository pattern: l'API del servizio è sostituibile con chiamate REST verso un back-end senza toccare i componenti).

### Sistema generico degli effetti delle abilità

Ogni `ClassFeature` può dichiarare:

```ts
effect?: {
  type: 'expertise' | 'half-proficiency';
  tiers?: { level: number; count: number }[];   // scelte ripetibili a più livelli
  eligibleSkillIds?: string[];                  // vuoto = tutte le abilità con competenza
}
selection?: {
  poolId: string;                               // pool di sotto-abilità (manovre, discipline…)
  unlocks: { level: number; maxTotal: number }[];
}
```

Nessuna logica è legata a una classe specifica: Maestria (Ladro/Bardo), Factotum/Tuttofare (Bardo), Manovre (Maestro di Battaglia), Discipline Elementali (Monaco), Invocazioni Occulte (Warlock) e Metamagia (Stregone) sono tutte configurate come dati.

### Formato di import JSON

```json
{
  "classes": [ ... ],
  "subclasses": [ ... ],
  "backgrounds": [ ... ],
  "spells": [ ... ],
  "optionPools": [ ... ]
}
```

Ogni sezione è opzionale. Il file viene validato (campi obbligatori, riferimenti a classi/pool/abilità esistenti, valori ammessi) e gli errori sono elencati prima dell'importazione. Gli elementi con `id` già esistente vengono aggiornati.

### API esterne

I dati SRD (in inglese) sono disponibili su [dnd5eapi.co](https://www.dnd5eapi.co) e [Open5e](https://open5e.com): possono essere convertiti nel formato JSON qui sopra e importati dalla sezione Developer.

## Struttura

```
src/app/
├── core/
│   ├── db/app-db.ts             ← Dexie: characters + tabelle contenuti
│   ├── models/                  ← Character (multiclasse), contenuti, effetti
│   └── services/                ← ContentService, CharacterService, RulesService, ImportService
├── data/                        ← Seed: razze, classi, sottoclassi, background, spell, pool
├── features/
│   ├── home/                    ← Lista personaggi + Compendio classi
│   ├── wizard/                  ← Wizard a step con WizardService (signals)
│   ├── character-sheet/         ← Scheda completa con modali
│   └── developer/               ← Gestione contenuti + import JSON
└── shared/                      ← Modale riusabile, utility
```
