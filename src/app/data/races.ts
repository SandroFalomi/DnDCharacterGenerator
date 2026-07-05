import { Race } from '../core/models/content.model';

export const RACES: Race[] = [
  {
    id: 'umano', name: 'Umano', icon: '👤',
    description: 'Ambiziosi e versatili, gli umani sono i pionieri del mondo conosciuto. La loro breve vita li spinge a lasciare un segno indelebile nella storia.',
    abilityBonuses: { STR: 1, DEX: 1, CON: 1, INT: 1, WIS: 1, CHA: 1 },
    traits: [
      { name: 'Versatilità', description: 'Gli umani ottengono +1 a tutti i punteggi di caratteristica.' }
    ],
    size: 'Media', speed: 9, languages: ['Comune', 'Una lingua a scelta']
  },
  {
    id: 'elfo-alto', name: 'Elfo Alto', icon: '🧝',
    description: 'Creature magiche di grazia ultraterrena, gli elfi alti custodiscono i segreti dell\'arcano da millenni, in città nascoste tra boschi antichi.',
    abilityBonuses: { DEX: 2, INT: 1 },
    traits: [
      { name: 'Scurovisione', description: 'Puoi vedere in condizioni di luce fioca entro 18 metri come se fosse luce intensa.' },
      { name: 'Sensi Acuti', description: 'Hai competenza nell\'abilità Percezione.' },
      { name: 'Retaggio Fatato', description: 'Hai vantaggio nei tiri salvezza contro l\'ammaliamento e non puoi essere addormentato con la magia.' },
      { name: 'Trance', description: 'Non hai bisogno di dormire: mediti 4 ore al giorno in uno stato di semi-coscienza.' },
      { name: 'Trucchetto', description: 'Conosci un trucchetto a scelta dalla lista del mago. Intelligenza è la caratteristica da incantatore.' }
    ],
    size: 'Media', speed: 9, languages: ['Comune', 'Elfico', 'Una lingua a scelta']
  },
  {
    id: 'nano-colline', name: 'Nano delle Colline', icon: '⛏️',
    description: 'Robusti e tenaci, i nani delle colline possiedono sensi acuti, profonda intuizione e una resistenza fuori dal comune.',
    abilityBonuses: { CON: 2, WIS: 1 },
    traits: [
      { name: 'Scurovisione', description: 'Puoi vedere in condizioni di luce fioca entro 18 metri come se fosse luce intensa.' },
      { name: 'Resilienza Nanica', description: 'Hai vantaggio nei tiri salvezza contro il veleno e resistenza ai danni da veleno.' },
      { name: 'Addestramento da Combattimento dei Nani', description: 'Hai competenza con asce da battaglia, asce, martelli leggeri e martelli da guerra.' },
      { name: 'Tenacia Nanica', description: 'Il tuo massimo dei punti ferita aumenta di 1 per ogni tuo livello.' }
    ],
    size: 'Media', speed: 7.5, languages: ['Comune', 'Nanico']
  },
  {
    id: 'halfling-piedelesto', name: 'Halfling Piedelesto', icon: '🍀',
    description: 'Piccoli, agili e incredibilmente fortunati, gli halfling piedelesto sanno passare inosservati e cavarsela nelle situazioni più disperate.',
    abilityBonuses: { DEX: 2, CHA: 1 },
    traits: [
      { name: 'Fortunato', description: 'Quando ottieni 1 a un tiro d\'attacco, prova o tiro salvezza, puoi ritirare il dado e devi usare il nuovo risultato.' },
      { name: 'Coraggioso', description: 'Hai vantaggio nei tiri salvezza contro la condizione spaventato.' },
      { name: 'Agilità Halfling', description: 'Puoi muoverti attraverso lo spazio di qualsiasi creatura di taglia superiore alla tua.' },
      { name: 'Furtività Innata', description: 'Puoi tentare di nasconderti anche quando sei oscurato solo da una creatura più grande di te.' }
    ],
    size: 'Piccola', speed: 7.5, languages: ['Comune', 'Halfling']
  },
  {
    id: 'dragonide', name: 'Dragonide', icon: '🐉',
    description: 'Nati dal sangue dei draghi, i dragonidi portano nel petto il potere elementale dei loro progenitori e un fiero codice d\'onore.',
    abilityBonuses: { STR: 2, CHA: 1 },
    traits: [
      { name: 'Discendenza Draconica', description: 'Scegli un tipo di drago: determina il tipo di danno del tuo soffio e la tua resistenza.' },
      { name: 'Soffio', actionType: 'action', description: 'Con un\'azione puoi esalare energia distruttiva (2d6, TS per dimezzare; aumenta con il livello).' },
      { name: 'Resistenza ai Danni', description: 'Hai resistenza al tipo di danno associato alla tua discendenza draconica.' }
    ],
    size: 'Media', speed: 9, languages: ['Comune', 'Draconico']
  },
  {
    id: 'gnomo-rocce', name: 'Gnomo delle Rocce', icon: '⚙️',
    description: 'Curiosi e geniali, gli gnomi delle rocce vivono di invenzioni, ingranaggi e scoperte, animati da un entusiasmo inesauribile.',
    abilityBonuses: { INT: 2, CON: 1 },
    traits: [
      { name: 'Scurovisione', description: 'Puoi vedere in condizioni di luce fioca entro 18 metri come se fosse luce intensa.' },
      { name: 'Astuzia Gnomesca', description: 'Hai vantaggio nei TS su Intelligenza, Saggezza e Carisma contro la magia.' },
      { name: 'Conoscenza degli Artefici', description: 'Aggiungi il doppio del bonus competenza alle prove di Storia su oggetti magici e congegni.' },
      { name: 'Inventore', description: 'Hai competenza con gli strumenti da inventore e puoi costruire piccoli congegni meccanici.' }
    ],
    size: 'Piccola', speed: 7.5, languages: ['Comune', 'Gnomesco']
  },
  {
    id: 'mezzelfo', name: 'Mezzelfo', icon: '🌗',
    description: 'Sospesi tra due mondi, i mezzelfi uniscono la grazia elfica all\'ambizione umana, eccellendo come diplomatici e avventurieri.',
    abilityBonuses: { CHA: 2, DEX: 1, CON: 1 },
    traits: [
      { name: 'Scurovisione', description: 'Puoi vedere in condizioni di luce fioca entro 18 metri come se fosse luce intensa.' },
      { name: 'Retaggio Fatato', description: 'Hai vantaggio nei tiri salvezza contro l\'ammaliamento e non puoi essere addormentato con la magia.' },
      { name: 'Versatilità nelle Abilità', description: 'Hai competenza in due abilità a tua scelta.' }
    ],
    size: 'Media', speed: 9, languages: ['Comune', 'Elfico', 'Una lingua a scelta']
  },
  {
    id: 'mezzorco', name: 'Mezzorco', icon: '🪓',
    description: 'Forgiati dalla furia e dalla sopravvivenza, i mezzorchi combinano la ferocia orchesca con la determinazione umana.',
    abilityBonuses: { STR: 2, CON: 1 },
    traits: [
      { name: 'Scurovisione', description: 'Puoi vedere in condizioni di luce fioca entro 18 metri come se fosse luce intensa.' },
      { name: 'Minaccioso', description: 'Hai competenza nell\'abilità Intimidire.' },
      { name: 'Tenacia Implacabile', description: 'Quando scendi a 0 punti ferita senza essere ucciso, puoi scendere invece a 1 pf (una volta per riposo lungo).' },
      { name: 'Attacchi Selvaggi', description: 'Con un colpo critico in mischia puoi tirare un dado di danno aggiuntivo.' }
    ],
    size: 'Media', speed: 9, languages: ['Comune', 'Orchesco']
  },
  {
    id: 'tiefling', name: 'Tiefling', icon: '😈',
    description: 'Segnati da un patto infernale stretto generazioni fa, i tiefling portano corna e code come marchio, e il fuoco degli Inferi nel sangue.',
    abilityBonuses: { CHA: 2, INT: 1 },
    traits: [
      { name: 'Scurovisione', description: 'Puoi vedere in condizioni di luce fioca entro 18 metri come se fosse luce intensa.' },
      { name: 'Resistenza Infernale', description: 'Hai resistenza ai danni da fuoco.' },
      { name: 'Eredità Infernale', description: 'Conosci il trucchetto Taumaturgia; ai livelli 3 e 5 ottieni incantesimi infernali innati.' }
    ],
    size: 'Media', speed: 9, languages: ['Comune', 'Infernale']
  }
];
