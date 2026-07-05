import { DndClass } from '../core/models/content.model';

export const CLASSES: DndClass[] = [
  {
    id: 'barbaro', name: 'Barbaro', icon: '🪓', hitDie: 12,
    description: 'Un guerriero primordiale animato da una furia incontenibile. In battaglia il barbaro si abbandona all\'ira, diventando una forza della natura.',
    savingThrows: ['STR', 'CON'],
    armorProficiencies: ['Armature leggere', 'Armature medie', 'Scudi'],
    weaponProficiencies: ['Armi semplici', 'Armi da guerra'],
    toolProficiencies: [],
    skillChoices: { count: 2, from: ['addestrare-animali', 'atletica', 'intimidire', 'natura', 'percezione', 'sopravvivenza'] },
    equipment: ['Ascia bipenne (o arma da guerra)', '2 asce', 'Zaino da esploratore', '4 giavellotti'],
    subclassLevel: 3, subclassTitle: 'Cammino Primordiale',
    resources: [{ name: 'Ira', description: 'Numero limitato di ire per riposo lungo: vantaggio a prove e TS su Forza, bonus ai danni, resistenza a danni contundenti, perforanti e taglienti.', level: 1 }],
    features: [
      { id: 'barbaro-ira', name: 'Ira', level: 1, actionType: 'bonus', description: 'Come azione bonus entri in ira: vantaggio alle prove e ai TS su Forza, bonus ai danni in mischia, resistenza ai danni contundenti, perforanti e taglienti.' },
      { id: 'barbaro-difesa-senza-armatura', name: 'Difesa Senza Armatura', level: 1, actionType: 'none', description: 'Senza armatura la tua CA è 10 + modificatore di Destrezza + modificatore di Costituzione.' },
      { id: 'barbaro-attacco-irruento', name: 'Attacco Irruento', level: 2, actionType: 'none', description: 'Puoi attaccare con vantaggio in mischia, ma fino al tuo prossimo turno gli attacchi contro di te hanno vantaggio.' },
      { id: 'barbaro-percezione-pericolo', name: 'Percezione del Pericolo', level: 2, actionType: 'none', description: 'Hai vantaggio ai TS su Destrezza contro effetti che puoi vedere, se non sei accecato, assordato o incapacitato.' },
      { id: 'barbaro-attacco-extra', name: 'Attacco Extra', level: 5, actionType: 'none', description: 'Quando usi l\'azione di Attacco puoi attaccare due volte anziché una.' },
      { id: 'barbaro-movimento-veloce', name: 'Movimento Veloce', level: 5, actionType: 'none', description: 'La tua velocità aumenta di 3 metri se non indossi armature pesanti.' },
      { id: 'barbaro-istinto-ferino', name: 'Istinto Ferino', level: 7, actionType: 'none', description: 'Hai vantaggio ai tiri di iniziativa e puoi agire normalmente se sorpreso, purché tu entri in ira.' },
      { id: 'barbaro-critico-brutale', name: 'Critico Brutale', level: 9, actionType: 'none', description: 'Con un colpo critico in mischia tiri un dado arma aggiuntivo per i danni.' },
      { id: 'barbaro-ira-implacabile', name: 'Ira Implacabile', level: 11, actionType: 'none', description: 'Se scendi a 0 pf mentre sei in ira, puoi effettuare un TS su Costituzione CD 10 per restare a 1 pf.' }
    ]
  },
  {
    id: 'bardo', name: 'Bardo', icon: '🎻', hitDie: 8,
    description: 'Un maestro della parola e della melodia che intreccia la magia nella musica, ispirando gli alleati e manipolando le menti dei nemici.',
    savingThrows: ['DEX', 'CHA'],
    armorProficiencies: ['Armature leggere'],
    weaponProficiencies: ['Armi semplici', 'Balestre a mano', 'Spade lunghe', 'Stocchi', 'Spade corte'],
    toolProficiencies: ['Tre strumenti musicali a scelta'],
    skillChoices: { count: 3, from: ['acrobazia', 'addestrare-animali', 'arcano', 'atletica', 'furtivita', 'indagare', 'inganno', 'intimidire', 'intrattenere', 'intuizione', 'medicina', 'natura', 'percezione', 'persuasione', 'rapidita-di-mano', 'religione', 'sopravvivenza', 'storia'] },
    equipment: ['Stocco (o spada lunga)', 'Zaino da intrattenitore', 'Liuto', 'Armatura di cuoio', 'Pugnale'],
    subclassLevel: 3, subclassTitle: 'Collegio Bardico',
    resources: [{ name: 'Ispirazione Bardica', description: 'Dadi di ispirazione (d6, poi d8/d10/d12) da donare agli alleati, utilizzi pari al modificatore di Carisma.', level: 1 }],
    spellcasting: { ability: 'CHA', progression: 'full', prepares: false, hasCantrips: true },
    features: [
      { id: 'bardo-ispirazione', name: 'Ispirazione Bardica', level: 1, actionType: 'bonus', description: 'Con un\'azione bonus doni a una creatura un dado di ispirazione (d6) da aggiungere a una prova, attacco o TS entro 10 minuti.' },
      {
        id: 'bardo-factotum', name: 'Factotum (Tuttofare)', level: 2, actionType: 'none',
        description: 'Puoi aggiungere metà del tuo bonus di competenza, arrotondato per difetto, a qualsiasi prova di caratteristica in cui non applichi già il bonus di competenza.',
        effect: { type: 'half-proficiency' }
      },
      { id: 'bardo-canto-riposo', name: 'Canto di Riposo', level: 2, actionType: 'none', description: 'Durante un riposo breve, chi recupera punti ferita ne recupera 1d6 aggiuntivi ascoltando la tua musica.' },
      {
        id: 'bardo-maestria', name: 'Maestria', level: 3, actionType: 'none',
        description: 'Scegli due abilità in cui hai competenza: il tuo bonus di competenza è raddoppiato per quelle abilità. Al 10° livello ne scegli altre due.',
        effect: { type: 'expertise', tiers: [{ level: 3, count: 2 }, { level: 10, count: 2 }] }
      },
      { id: 'bardo-fonte-ispirazione', name: 'Fonte di Ispirazione', level: 5, actionType: 'none', description: 'Recuperi tutti gli utilizzi dell\'Ispirazione Bardica con un riposo breve o lungo.' },
      { id: 'bardo-controcanto', name: 'Controcanto', level: 6, actionType: 'action', description: 'Come azione puoi disturbare gli effetti mentali: gli alleati hanno vantaggio ai TS contro paura e charme.' },
      { id: 'bardo-segreti-magici', name: 'Segreti Magici', level: 10, actionType: 'none', description: 'Apprendi due incantesimi a scelta da qualsiasi lista di classe.' }
    ]
  },
  {
    id: 'chierico', name: 'Chierico', icon: '✨', hitDie: 8,
    description: 'Un intermediario del divino che incanala il potere degli dèi per guarire i fedeli e punire gli empi.',
    savingThrows: ['WIS', 'CHA'],
    armorProficiencies: ['Armature leggere', 'Armature medie', 'Scudi'],
    weaponProficiencies: ['Armi semplici'],
    toolProficiencies: [],
    skillChoices: { count: 2, from: ['intuizione', 'medicina', 'persuasione', 'religione', 'storia'] },
    equipment: ['Mazza', 'Cotta di maglia', 'Simbolo sacro', 'Zaino da sacerdote', 'Scudo'],
    subclassLevel: 1, subclassTitle: 'Dominio Divino',
    resources: [{ name: 'Incanalare Divinità', description: 'Dal 2° livello incanali energia divina per alimentare effetti magici del tuo dominio.', level: 2 }],
    spellcasting: { ability: 'WIS', progression: 'full', prepares: true, hasCantrips: true },
    features: [
      { id: 'chierico-incanalare', name: 'Incanalare Divinità', level: 2, actionType: 'action', description: 'Incanali energia divina: puoi Scacciare i Non Morti o usare l\'effetto del tuo dominio. Un utilizzo per riposo (aumenta ai livelli 6 e 18).' },
      { id: 'chierico-scacciare', name: 'Scacciare Non Morti', level: 2, actionType: 'action', description: 'Ogni non morto entro 9 metri che ti vede o sente deve superare un TS su Saggezza o fuggire da te per 1 minuto.' },
      { id: 'chierico-distruggere', name: 'Distruggere Non Morti', level: 5, actionType: 'none', description: 'Un non morto di GS 1/2 o inferiore che fallisce il TS contro Scacciare viene istantaneamente distrutto.' },
      { id: 'chierico-intervento', name: 'Intervento Divino', level: 10, actionType: 'action', description: 'Puoi implorare l\'intervento diretto della tua divinità: percentuale di successo pari al tuo livello da chierico.' }
    ]
  },
  {
    id: 'druido', name: 'Druido', icon: '🌿', hitDie: 8,
    description: 'Un custode dell\'equilibrio naturale che attinge alla magia primordiale e assume la forma delle bestie selvagge.',
    savingThrows: ['INT', 'WIS'],
    armorProficiencies: ['Armature leggere (non metalliche)', 'Armature medie (non metalliche)', 'Scudi (non metallici)'],
    weaponProficiencies: ['Bastoni', 'Falcetti', 'Falcion', 'Fionde', 'Giavellotti', 'Lance', 'Mazze', 'Pugnali', 'Scimitarre'],
    toolProficiencies: ['Borsa da erborista'],
    skillChoices: { count: 2, from: ['addestrare-animali', 'arcano', 'intuizione', 'medicina', 'natura', 'percezione', 'religione', 'sopravvivenza'] },
    equipment: ['Scudo di legno', 'Scimitarra', 'Armatura di cuoio', 'Zaino da esploratore', 'Focus druidico'],
    subclassLevel: 2, subclassTitle: 'Circolo Druidico',
    resources: [{ name: 'Forma Selvatica', description: 'Due utilizzi per riposo: assumi la forma di una bestia che hai già visto.', level: 2 }],
    spellcasting: { ability: 'WIS', progression: 'full', prepares: true, hasCantrips: true },
    features: [
      { id: 'druido-druidico', name: 'Druidico', level: 1, actionType: 'none', description: 'Conosci il linguaggio segreto dei druidi e ne riconosci i messaggi nascosti.' },
      { id: 'druido-forma-selvatica', name: 'Forma Selvatica', level: 2, actionType: 'action', description: 'Come azione assumi la forma di una bestia già vista (GS e restrizioni in base al livello). Due utilizzi per riposo.' },
      { id: 'druido-forma-migliorata', name: 'Forma Selvatica Migliorata', level: 4, actionType: 'none', description: 'Puoi trasformarti in bestie con velocità di nuoto (dal 4°) e di volo (dall\'8°).' },
      { id: 'druido-incantesimi-terra', name: 'Recupero Naturale', level: 2, actionType: 'none', description: 'Durante un riposo breve puoi recuperare slot incantesimo di livello complessivo pari a metà del tuo livello da druido.' }
    ]
  },
  {
    id: 'guerriero', name: 'Guerriero', icon: '⚔️', hitDie: 10,
    description: 'Un maestro delle armi e delle armature, temprato da mille battaglie. Nessuno eguaglia la sua versatilità sul campo.',
    savingThrows: ['STR', 'CON'],
    armorProficiencies: ['Tutte le armature', 'Scudi'],
    weaponProficiencies: ['Armi semplici', 'Armi da guerra'],
    toolProficiencies: [],
    skillChoices: { count: 2, from: ['acrobazia', 'addestrare-animali', 'atletica', 'intimidire', 'intuizione', 'percezione', 'sopravvivenza', 'storia'] },
    equipment: ['Cotta di maglia (o armatura di cuoio + arco lungo)', 'Arma da guerra e scudo', '2 asce', 'Zaino da esploratore'],
    subclassLevel: 3, subclassTitle: 'Archetipo Marziale',
    resources: [],
    features: [
      { id: 'guerriero-stile', name: 'Stile di Combattimento', level: 1, actionType: 'none', description: 'Adotti uno stile di combattimento specializzato: Difesa (+1 CA), Duellare (+2 danni), Combattere con Armi Possenti, Tiro (+2 attacchi a distanza) o altri.' },
      { id: 'guerriero-recupero', name: 'Recupero Energie', level: 1, actionType: 'bonus', description: 'Con un\'azione bonus recuperi 1d10 + livello da guerriero punti ferita. Un utilizzo per riposo.' },
      { id: 'guerriero-azione-impetuosa', name: 'Azione Impetuosa', level: 2, actionType: 'none', description: 'Puoi effettuare un\'azione aggiuntiva nel tuo turno. Un utilizzo per riposo (due dal 17° livello).' },
      { id: 'guerriero-attacco-extra', name: 'Attacco Extra', level: 5, actionType: 'none', description: 'Quando usi l\'azione di Attacco puoi attaccare due volte (tre volte all\'11°, quattro al 20°).' },
      { id: 'guerriero-indomito', name: 'Indomito', level: 9, actionType: 'none', description: 'Puoi ripetere un tiro salvezza fallito. Un utilizzo per riposo lungo (aumenta ai livelli 13 e 17).' }
    ]
  },
  {
    id: 'monaco', name: 'Monaco', icon: '🀄', hitDie: 8,
    description: 'Un asceta marziale che perfeziona corpo e spirito, incanalando il ki in colpi rapidi come il fulmine.',
    savingThrows: ['STR', 'DEX'],
    armorProficiencies: [],
    weaponProficiencies: ['Armi semplici', 'Spade corte'],
    toolProficiencies: ['Un tipo di strumenti da artigiano o uno strumento musicale'],
    skillChoices: { count: 2, from: ['acrobazia', 'atletica', 'furtivita', 'intuizione', 'religione', 'storia'] },
    equipment: ['Spada corta', 'Zaino da esploratore', '10 dardi'],
    subclassLevel: 3, subclassTitle: 'Tradizione Monastica',
    resources: [{ name: 'Ki', description: 'Punti ki pari al livello da monaco, recuperati con un riposo: alimentano Raffica di Colpi, Passo del Vento, Difesa Paziente e le discipline.', level: 2 }],
    features: [
      { id: 'monaco-difesa-senza-armatura', name: 'Difesa Senza Armatura', level: 1, actionType: 'none', description: 'Senza armatura né scudo la tua CA è 10 + modificatore di Destrezza + modificatore di Saggezza.' },
      { id: 'monaco-arti-marziali', name: 'Arti Marziali', level: 1, actionType: 'bonus', description: 'Colpi senz\'armi e armi da monaco usano la Destrezza e un dado che cresce con il livello (d4→d10). Azione bonus: un colpo senz\'armi extra.' },
      { id: 'monaco-ki', name: 'Ki', level: 2, actionType: 'none', description: 'Ottieni punti ki pari al tuo livello da monaco per alimentare tecniche speciali: Raffica di Colpi, Difesa Paziente, Passo del Vento.' },
      { id: 'monaco-movimento', name: 'Movimento Senza Armatura', level: 2, actionType: 'none', description: 'La tua velocità aumenta di 3 m senza armatura (cresce con il livello; dal 9° cammini su superfici verticali e liquidi).' },
      { id: 'monaco-deflettere', name: 'Deflettere Proiettili', level: 3, actionType: 'reaction', description: 'Con la reazione riduci i danni di un attacco a distanza di 1d10 + Destrezza + livello; se annulli il danno puoi rilanciare il proiettile.' },
      { id: 'monaco-caduta-lenta', name: 'Caduta Lenta', level: 4, actionType: 'reaction', description: 'Con la reazione riduci i danni da caduta di 5 × il tuo livello da monaco.' },
      { id: 'monaco-attacco-extra', name: 'Attacco Extra', level: 5, actionType: 'none', description: 'Quando usi l\'azione di Attacco puoi attaccare due volte anziché una.' },
      { id: 'monaco-colpo-stordente', name: 'Colpo Stordente', level: 5, actionType: 'none', description: 'Spendi 1 punto ki quando colpisci: il bersaglio deve superare un TS su Costituzione o essere stordito fino alla fine del tuo prossimo turno.' },
      { id: 'monaco-colpi-ki', name: 'Colpi Potenziati dal Ki', level: 6, actionType: 'none', description: 'I tuoi colpi senz\'armi contano come magici per superare le resistenze.' },
      { id: 'monaco-elusione', name: 'Elusione', level: 7, actionType: 'none', description: 'Nei TS su Destrezza per dimezzare i danni, non subisci danni se superi il TS e li dimezzi se fallisci.' }
    ]
  },
  {
    id: 'paladino', name: 'Paladino', icon: '🛡️', hitDie: 10,
    description: 'Un guerriero sacro vincolato da un giuramento solenne, che unisce la maestria marziale al potere divino.',
    savingThrows: ['WIS', 'CHA'],
    armorProficiencies: ['Tutte le armature', 'Scudi'],
    weaponProficiencies: ['Armi semplici', 'Armi da guerra'],
    toolProficiencies: [],
    skillChoices: { count: 2, from: ['atletica', 'intimidire', 'intuizione', 'medicina', 'persuasione', 'religione'] },
    equipment: ['Arma da guerra e scudo', '5 giavellotti', 'Zaino da sacerdote', 'Cotta di maglia', 'Simbolo sacro'],
    subclassLevel: 3, subclassTitle: 'Giuramento Sacro',
    resources: [{ name: 'Riserva di Guarigione', description: 'Imposizione delle Mani: riserva di punti ferita pari a 5 × livello da paladino.', level: 1 }],
    spellcasting: { ability: 'CHA', progression: 'half', prepares: true, hasCantrips: false },
    features: [
      { id: 'paladino-percezione-divina', name: 'Percezione Divina', level: 1, actionType: 'action', description: 'Come azione percepisci celestiali, immondi e non morti entro 18 metri fino alla fine del tuo prossimo turno.' },
      { id: 'paladino-imposizione', name: 'Imposizione delle Mani', level: 1, actionType: 'action', description: 'Hai una riserva di guarigione pari a 5 × il tuo livello da paladino, per curare ferite o malattie con un tocco.' },
      { id: 'paladino-punizione', name: 'Punizione Divina', level: 2, actionType: 'none', description: 'Quando colpisci in mischia puoi spendere uno slot incantesimo per infliggere 2d8 danni radiosi extra (+1d8 per livello di slot).' },
      { id: 'paladino-salute-divina', name: 'Salute Divina', level: 3, actionType: 'none', description: 'La magia divina che scorre in te ti rende immune alle malattie.' },
      { id: 'paladino-attacco-extra', name: 'Attacco Extra', level: 5, actionType: 'none', description: 'Quando usi l\'azione di Attacco puoi attaccare due volte anziché una.' },
      { id: 'paladino-aura-protezione', name: 'Aura di Protezione', level: 6, actionType: 'none', description: 'Tu e gli alleati entro 3 metri aggiungete il tuo modificatore di Carisma ai tiri salvezza.' },
      { id: 'paladino-aura-coraggio', name: 'Aura di Coraggio', level: 10, actionType: 'none', description: 'Tu e gli alleati entro 3 metri non potete essere spaventati.' }
    ]
  },
  {
    id: 'ranger', name: 'Ranger', icon: '🏹', hitDie: 10,
    description: 'Una sentinella delle terre selvagge, cacciatore implacabile che unisce abilità marziali, istinto e magia primordiale.',
    savingThrows: ['STR', 'DEX'],
    armorProficiencies: ['Armature leggere', 'Armature medie', 'Scudi'],
    weaponProficiencies: ['Armi semplici', 'Armi da guerra'],
    toolProficiencies: [],
    skillChoices: { count: 3, from: ['addestrare-animali', 'atletica', 'furtivita', 'indagare', 'intuizione', 'natura', 'percezione', 'sopravvivenza'] },
    equipment: ['Armatura di scaglie (o cuoio)', '2 spade corte', 'Zaino da esploratore', 'Arco lungo e 20 frecce'],
    subclassLevel: 3, subclassTitle: 'Archetipo del Ranger',
    resources: [],
    spellcasting: { ability: 'WIS', progression: 'half', prepares: false, hasCantrips: false },
    features: [
      { id: 'ranger-nemico-prescelto', name: 'Nemico Prescelto', level: 1, actionType: 'none', description: 'Scegli un tipo di nemico prescelto: vantaggio alle prove di Sopravvivenza per rintracciarlo e alle prove di Intelligenza per ricordarne le informazioni.' },
      { id: 'ranger-esploratore', name: 'Esploratore Naturale', level: 1, actionType: 'none', description: 'Scegli un terreno prediletto: benefici di viaggio ed esplorazione quando ti muovi in quel territorio.' },
      { id: 'ranger-stile', name: 'Stile di Combattimento', level: 2, actionType: 'none', description: 'Adotti uno stile di combattimento: Tiro con Armi a Distanza, Difesa, Duellare o Combattere con Due Armi.' },
      { id: 'ranger-attacco-extra', name: 'Attacco Extra', level: 5, actionType: 'none', description: 'Quando usi l\'azione di Attacco puoi attaccare due volte anziché una.' },
      { id: 'ranger-passo-terra', name: 'Passo sul Territorio', level: 8, actionType: 'none', description: 'Muoverti attraverso terreno difficile non magico non ti costa movimento extra.' }
    ]
  },
  {
    id: 'ladro', name: 'Ladro', icon: '🗝️', hitDie: 8,
    description: 'Un maestro dell\'ombra e dell\'astuzia che colpisce dove fa più male, con precisione chirurgica e mille risorse.',
    savingThrows: ['DEX', 'INT'],
    armorProficiencies: ['Armature leggere'],
    weaponProficiencies: ['Armi semplici', 'Balestre a mano', 'Spade lunghe', 'Stocchi', 'Spade corte'],
    toolProficiencies: ['Arnesi da scasso'],
    skillChoices: { count: 4, from: ['acrobazia', 'atletica', 'furtivita', 'indagare', 'inganno', 'intimidire', 'intrattenere', 'intuizione', 'percezione', 'persuasione', 'rapidita-di-mano'] },
    equipment: ['Stocco (o spada corta)', 'Arco corto e 20 frecce', 'Zaino da scassinatore', 'Armatura di cuoio', '2 pugnali', 'Arnesi da scasso'],
    subclassLevel: 3, subclassTitle: 'Archetipo Ladresco',
    resources: [],
    features: [
      {
        id: 'ladro-maestria', name: 'Maestria', level: 1, actionType: 'none',
        description: 'Scegli due abilità in cui hai competenza (o gli arnesi da scasso): il bonus di competenza è raddoppiato per quelle prove. Al 6° livello scegli altre due abilità.',
        effect: { type: 'expertise', tiers: [{ level: 1, count: 2 }, { level: 6, count: 2 }] }
      },
      { id: 'ladro-attacco-furtivo', name: 'Attacco Furtivo', level: 1, actionType: 'none', description: 'Una volta per turno infliggi 1d6 danni extra (cresce con il livello) a una creatura colpita con vantaggio o con un alleato adiacente.' },
      { id: 'ladro-gergo', name: 'Gergo Ladresco', level: 1, actionType: 'none', description: 'Conosci il linguaggio segreto dei ladri e i suoi segni nascosti.' },
      { id: 'ladro-azione-scaltra', name: 'Azione Scaltra', level: 2, actionType: 'bonus', description: 'Puoi usare l\'azione bonus per Scattare, Disimpegnarti o Nasconderti.' },
      { id: 'ladro-schivata-prodigiosa', name: 'Schivata Prodigiosa', level: 5, actionType: 'reaction', description: 'Con la reazione dimezzi i danni di un attacco che puoi vedere.' },
      { id: 'ladro-elusione', name: 'Elusione', level: 7, actionType: 'none', description: 'Nei TS su Destrezza per dimezzare i danni, non subisci danni se superi il TS e li dimezzi se fallisci.' },
      { id: 'ladro-talento-affidabile', name: 'Talento Affidabile', level: 11, actionType: 'none', description: 'Ogni volta che tiri una prova con bonus di competenza, un risultato di 9 o meno sul d20 conta come 10.' }
    ]
  },
  {
    id: 'stregone', name: 'Stregone', icon: '🔥', hitDie: 6,
    description: 'Un incantatore nato: la magia gli scorre nelle vene, eredità di antenati draconici o di poteri primordiali.',
    savingThrows: ['CON', 'CHA'],
    armorProficiencies: [],
    weaponProficiencies: ['Pugnali', 'Dardi', 'Fionde', 'Bastoni', 'Balestre leggere'],
    toolProficiencies: [],
    skillChoices: { count: 2, from: ['arcano', 'inganno', 'intimidire', 'intuizione', 'persuasione', 'religione'] },
    equipment: ['Balestra leggera e 20 quadrelli', 'Focus arcano', 'Zaino da esploratore', '2 pugnali'],
    subclassLevel: 1, subclassTitle: 'Origine Stregonesca',
    resources: [{ name: 'Punti Stregoneria', description: 'Punti pari al livello da stregone (dal 2°): convertibili in slot incantesimo o spendibili per la Metamagia.', level: 2 }],
    spellcasting: { ability: 'CHA', progression: 'full', prepares: false, hasCantrips: true },
    features: [
      { id: 'stregone-fonte-magia', name: 'Fonte di Magia', level: 2, actionType: 'none', description: 'Ottieni punti stregoneria pari al tuo livello da stregone. Puoi convertirli in slot incantesimo e viceversa.' },
      {
        id: 'stregone-metamagia', name: 'Metamagia', level: 3, actionType: 'none',
        description: 'Apprendi opzioni di Metamagia per piegare gli incantesimi ai tuoi desideri, spendendo punti stregoneria. Ne scegli 2 al 3° livello, una in più al 10° e al 17°.',
        selection: { poolId: 'metamagia', unlocks: [{ level: 3, maxTotal: 2 }, { level: 10, maxTotal: 3 }, { level: 17, maxTotal: 4 }] }
      },
      { id: 'stregone-ripristino', name: 'Ripristino Stregonesco', level: 20, actionType: 'none', description: 'Recuperi 4 punti stregoneria ogni volta che completi un riposo breve.' }
    ]
  },
  {
    id: 'warlock', name: 'Warlock', icon: '👁️', hitDie: 8,
    description: 'Un cercatore di conoscenza proibita che ha stretto un patto con un\'entità ultraterrena in cambio di potere occulto.',
    savingThrows: ['WIS', 'CHA'],
    armorProficiencies: ['Armature leggere'],
    weaponProficiencies: ['Armi semplici'],
    toolProficiencies: [],
    skillChoices: { count: 2, from: ['arcano', 'indagare', 'inganno', 'intimidire', 'natura', 'religione', 'storia'] },
    equipment: ['Balestra leggera e 20 quadrelli', 'Focus arcano', 'Zaino da studioso', 'Armatura di cuoio', 'Arma semplice', '2 pugnali'],
    subclassLevel: 1, subclassTitle: 'Patrono Ultraterreno',
    resources: [{ name: 'Slot del Patto', description: 'Pochi slot incantesimo, tutti del massimo livello disponibile, recuperati con un riposo breve.', level: 1 }],
    spellcasting: { ability: 'CHA', progression: 'pact', prepares: false, hasCantrips: true },
    features: [
      {
        id: 'warlock-invocazioni', name: 'Invocazioni Occulte', level: 2, actionType: 'none',
        description: 'Lo studio di sapere proibito ti ha fatto scoprire le invocazioni occulte: frammenti di potere permanente. Ne apprendi 2 al 2° livello e altre salendo di livello.',
        selection: { poolId: 'invocazioni-occulte', unlocks: [{ level: 2, maxTotal: 2 }, { level: 5, maxTotal: 3 }, { level: 7, maxTotal: 4 }, { level: 9, maxTotal: 5 }, { level: 12, maxTotal: 6 }, { level: 15, maxTotal: 7 }, { level: 18, maxTotal: 8 }] }
      },
      { id: 'warlock-patto', name: 'Dono del Patto', level: 3, actionType: 'none', description: 'Il tuo patrono ti concede un dono: Patto della Catena (famiglio), Patto della Lama (arma evocata) o Patto del Tomo (grimorio).' },
      { id: 'warlock-arcanum', name: 'Arcanum Mistico', level: 11, actionType: 'none', description: 'Il patrono ti concede un segreto magico: un incantesimo di 6° livello lanciabile una volta per riposo lungo (altri ai livelli 13, 15, 17).' }
    ]
  },
  {
    id: 'mago', name: 'Mago', icon: '📖', hitDie: 6,
    description: 'Uno studioso supremo dell\'arcano che piega la realtà attraverso anni di studio meticoloso, formule e antichi grimori.',
    savingThrows: ['INT', 'WIS'],
    armorProficiencies: [],
    weaponProficiencies: ['Pugnali', 'Dardi', 'Fionde', 'Bastoni', 'Balestre leggere'],
    toolProficiencies: [],
    skillChoices: { count: 2, from: ['arcano', 'indagare', 'intuizione', 'medicina', 'religione', 'storia'] },
    equipment: ['Bastone (o pugnale)', 'Focus arcano', 'Zaino da studioso', 'Libro degli incantesimi'],
    subclassLevel: 2, subclassTitle: 'Tradizione Arcana',
    resources: [],
    spellcasting: { ability: 'INT', progression: 'full', prepares: true, hasCantrips: true },
    features: [
      { id: 'mago-libro', name: 'Libro degli Incantesimi', level: 1, actionType: 'none', description: 'Il tuo grimorio contiene gli incantesimi che conosci: 6 incantesimi di 1° livello all\'inizio, altri due per ogni livello.' },
      { id: 'mago-recupero-arcano', name: 'Recupero Arcano', level: 1, actionType: 'none', description: 'Una volta al giorno, durante un riposo breve, recuperi slot incantesimo di livello complessivo pari a metà del tuo livello da mago (per eccesso).' },
      { id: 'mago-padronanza', name: 'Padronanza degli Incantesimi', level: 18, actionType: 'none', description: 'Scegli un incantesimo di 1° e uno di 2° livello dal tuo libro: puoi lanciarli al loro livello minimo senza spendere slot.' }
    ]
  }
];
