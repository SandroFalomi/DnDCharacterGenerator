import { Race } from '../core/models/content.model';

export const RACES: Race[] = [
  {
    id: 'umano', name: 'Umano', icon: '👤',
    description: 'Ambiziosi e versatili, gli umani sono i pionieri del mondo conosciuto. La loro breve vita li spinge a lasciare un segno indelebile nella storia.',
    abilityBonuses: {},
    traits: [],
    size: 'Media', speed: 9, languages: ['Comune', 'Una lingua a scelta'],
    subraces: [
      {
        id: 'standard', name: 'Standard',
        description: 'L\'umano nella sua versatilità più pura: cresce in ogni campo.',
        abilityBonuses: { STR: 1, DEX: 1, CON: 1, INT: 1, WIS: 1, CHA: 1 },
        traits: [
          { name: 'Versatilità', description: 'Gli umani ottengono +1 a tutti i punteggi di caratteristica.' }
        ]
      },
      {
        id: 'alternativo', name: 'Alternativo (Variante)',
        description: 'Un umano che rinuncia alla crescita uniforme per specializzarsi: un talento e capacità mirate.',
        abilityBonuses: {},
        traits: [
          { name: 'Talento', description: 'Ottieni un talento a tua scelta. Aggiungilo al personaggio dalla sezione "Talenti" della scheda.' },
          { name: 'Caratteristiche Versatili', description: 'Due punteggi di caratteristica diversi a tua scelta aumentano di 1 (al posto del +1 a tutte le caratteristiche dell\'umano standard). Applica i due +1 direttamente ai punteggi base della scheda.' },
          { name: 'Competenza Bonus', description: 'Ottieni competenza in un\'abilità a tua scelta.' }
        ]
      }
    ]
  },

  {
    id: 'elfo', name: 'Elfo', icon: '🧝',
    description: 'Creature magiche di grazia ultraterrena, gli elfi vivono in luoghi di bellezza eterea e custodiscono i segreti dell\'arcano da millenni.',
    abilityBonuses: { DEX: 2 },
    traits: [
      { name: 'Scurovisione', description: 'Puoi vedere in condizioni di luce fioca entro 18 metri come se fosse luce intensa.' },
      { name: 'Sensi Acuti', description: 'Hai competenza nell\'abilità Percezione.' },
      { name: 'Retaggio Fatato', description: 'Hai vantaggio nei tiri salvezza contro l\'ammaliamento e non puoi essere addormentato con la magia.' },
      { name: 'Trance', description: 'Non hai bisogno di dormire: mediti 4 ore al giorno in uno stato di semi-coscienza.' }
    ],
    size: 'Media', speed: 9, languages: ['Comune', 'Elfico'],
    subraces: [
      {
        id: 'elfo-alto', name: 'Elfo Alto',
        description: 'Elfi dal sangue arcano, eruditi e vicini alla magia.',
        abilityBonuses: { INT: 1 },
        traits: [
          { name: 'Trucchetto', description: 'Conosci un trucchetto a scelta dalla lista del mago. Intelligenza è la caratteristica da incantatore.' },
          { name: 'Lingua Extra', description: 'Parli, leggi e scrivi una lingua a tua scelta.' }
        ]
      },
      {
        id: 'elfo-boschi', name: 'Elfo dei Boschi',
        description: 'Elfi dai sensi affinati e dall\'istinto selvaggio, rapidi e furtivi tra gli alberi.',
        abilityBonuses: { WIS: 1 },
        speed: 10.5,
        traits: [
          { name: 'Piede Lesto', description: 'La tua velocità base sale a 10,5 metri.' },
          { name: 'Maschera della Natura', description: 'Puoi tentare di nasconderti anche quando sei oscurato solo lievemente da fogliame, pioggia o neve.' }
        ]
      },
      {
        id: 'elfo-oscuro', name: 'Elfo Oscuro (Drow)',
        description: 'Discendenti degli elfi esiliati nel Sottosuolo, segnati dall\'oscurità e da una magia innata.',
        abilityBonuses: { CHA: 1 },
        traits: [
          { name: 'Scurovisione Superiore', description: 'La tua scurovisione arriva fino a 36 metri.' },
          { name: 'Sensibilità alla Luce Solare', description: 'Svantaggio ai tiri d\'attacco e alle prove di Percezione visive alla luce diretta del sole.' },
          { name: 'Magia Drow', description: 'Conosci Luci Danzanti; al 3° livello Luminescenza, al 5° Oscurità (una volta al giorno ciascuno).', actionType: 'action' },
          { name: 'Addestramento Drow', description: 'Hai competenza con stocchi, spade corte e balestre a mano.' }
        ]
      }
    ]
  },
  {
    id: 'nano', name: 'Nano', icon: '⛏️',
    description: 'Robusti e tenaci, i nani sono maestri della pietra e del metallo, fieri delle proprie sale scavate nella roccia e delle tradizioni dei clan.',
    abilityBonuses: { CON: 2 },
    traits: [
      { name: 'Scurovisione', description: 'Puoi vedere in condizioni di luce fioca entro 18 metri come se fosse luce intensa.' },
      { name: 'Resilienza Nanica', description: 'Hai vantaggio nei tiri salvezza contro il veleno e resistenza ai danni da veleno.' },
      { name: 'Addestramento da Combattimento dei Nani', description: 'Hai competenza con asce da battaglia, asce, martelli leggeri e martelli da guerra.' },
      { name: 'Conoscenza della Pietra', description: 'Aggiungi il doppio del bonus competenza alle prove di Storia legate alla lavorazione della pietra.' }
    ],
    size: 'Media', speed: 7.5, languages: ['Comune', 'Nanico'],
    subraces: [
      {
        id: 'nano-colline', name: 'Nano delle Colline',
        description: 'Nani dai sensi acuti, profonda intuizione e notevole resistenza.',
        abilityBonuses: { WIS: 1 },
        traits: [
          { name: 'Tenacia Nanica', description: 'Il tuo massimo dei punti ferita aumenta di 1 per ogni tuo livello.' }
        ]
      },
      {
        id: 'nano-montagne', name: 'Nano delle Montagne',
        description: 'Nani forti e temprati dalla vita in territori aspri, avvezzi alle armature.',
        abilityBonuses: { STR: 2 },
        traits: [
          { name: 'Addestramento nelle Armature dei Nani', description: 'Hai competenza con le armature leggere e medie.' }
        ]
      }
    ]
  },
  {
    id: 'halfling', name: 'Halfling', icon: '🍀',
    description: 'Piccoli, agili e incredibilmente fortunati, gli halfling amano le comodità di casa ma sanno cavarsela nelle situazioni più disperate.',
    abilityBonuses: { DEX: 2 },
    traits: [
      { name: 'Fortunato', description: 'Quando ottieni 1 a un tiro d\'attacco, prova o tiro salvezza, puoi ritirare il dado e devi usare il nuovo risultato.' },
      { name: 'Coraggioso', description: 'Hai vantaggio nei tiri salvezza contro la condizione spaventato.' },
      { name: 'Agilità Halfling', description: 'Puoi muoverti attraverso lo spazio di qualsiasi creatura di taglia superiore alla tua.' }
    ],
    size: 'Piccola', speed: 7.5, languages: ['Comune', 'Halfling'],
    subraces: [
      {
        id: 'piedelesto', name: 'Piedelesto',
        description: 'Halfling abili a nascondersi, anche dietro creature più grandi.',
        abilityBonuses: { CHA: 1 },
        traits: [
          { name: 'Furtività Innata', description: 'Puoi tentare di nasconderti anche quando sei oscurato solo da una creatura più grande di te.' }
        ]
      },
      {
        id: 'tozzo', name: 'Tozzo',
        description: 'Halfling più robusti della media, con una resistenza che ricorda quella dei nani.',
        abilityBonuses: { CON: 1 },
        traits: [
          { name: 'Resilienza dei Tozzi', description: 'Hai vantaggio nei tiri salvezza contro il veleno e resistenza ai danni da veleno.' }
        ]
      }
    ]
  },
  {
    id: 'dragonide', name: 'Dragonide', icon: '🐉',
    description: 'Nati dal sangue dei draghi, i dragonidi portano nel petto il potere elementale dei loro progenitori e un fiero codice d\'onore.',
    abilityBonuses: { STR: 2, CHA: 1 },
    traits: [
      { name: 'Discendenza Draconica', description: 'Il tuo antenato draconico determina il tipo di danno, la forma dell\'arma a soffio e la tua resistenza. Il soffio infligge 2d6 danni (TS per dimezzare, CD 8 + mod. Costituzione + bonus competenza); il danno sale a 3d6 al 6° livello, 4d6 all\'11° e 5d6 al 16°. Un utilizzo per riposo breve o lungo.' }
    ],
    size: 'Media', speed: 9, languages: ['Comune', 'Draconico'],
    subraces: [
      {
        id: 'argento', name: 'Argento',
        description: 'Draghi metallici dall\'animo nobile, portatori di saggezza e giustizia.',
        abilityBonuses: {},
        traits: [
          { name: 'Soffio di Freddo', actionType: 'action', description: 'Con un\'azione esali un cono di freddo di 4,5 metri. Ogni creatura nell\'area deve effettuare un TS su Costituzione, subendo 2d6 danni da freddo se fallisce (dimezzati se supera).' },
          { name: 'Resistenza al Freddo', description: 'Possiedi resistenza ai danni da freddo.' }
        ]
      },
      {
        id: 'bianco', name: 'Bianco',
        description: 'Draghi ferali dei ghiacci eterni, istintivi e spietati come le tormente.',
        abilityBonuses: {},
        traits: [
          { name: 'Soffio di Freddo', actionType: 'action', description: 'Con un\'azione esali un cono di freddo di 4,5 metri. Ogni creatura nell\'area deve effettuare un TS su Costituzione, subendo 2d6 danni da freddo se fallisce (dimezzati se supera).' },
          { name: 'Resistenza al Freddo', description: 'Possiedi resistenza ai danni da freddo.' }
        ]
      },
      {
        id: 'blu', name: 'Blu',
        description: 'Draghi dei deserti, vanitosi e metodici, signori del fulmine e della sabbia.',
        abilityBonuses: {},
        traits: [
          { name: 'Soffio di Fulmine', actionType: 'action', description: 'Con un\'azione esali una linea di fulmine di 1,5 per 9 metri. Ogni creatura nell\'area deve effettuare un TS su Destrezza, subendo 2d6 danni da fulmine se fallisce (dimezzati se supera).' },
          { name: 'Resistenza al Fulmine', description: 'Possiedi resistenza ai danni da fulmine.' }
        ]
      },
      {
        id: 'bronzo', name: 'Bronzo',
        description: 'Draghi delle coste, guerrieri onorevoli affascinati dai conflitti mortali.',
        abilityBonuses: {},
        traits: [
          { name: 'Soffio di Fulmine', actionType: 'action', description: 'Con un\'azione esali una linea di fulmine di 1,5 per 9 metri. Ogni creatura nell\'area deve effettuare un TS su Destrezza, subendo 2d6 danni da fulmine se fallisce (dimezzati se supera).' },
          { name: 'Resistenza al Fulmine', description: 'Possiedi resistenza ai danni da fulmine.' }
        ]
      },
      {
        id: 'nero', name: 'Nero',
        description: 'Draghi delle paludi, crudeli e corrosivi come l\'acido che sputano.',
        abilityBonuses: {},
        traits: [
          { name: 'Soffio di Acido', actionType: 'action', description: 'Con un\'azione esali una linea di acido di 1,5 per 9 metri. Ogni creatura nell\'area deve effettuare un TS su Destrezza, subendo 2d6 danni da acido se fallisce (dimezzati se supera).' },
          { name: 'Resistenza all\'Acido', description: 'Possiedi resistenza ai danni da acido.' }
        ]
      },
      {
        id: 'oro', name: 'Oro',
        description: 'I più nobili tra i draghi metallici, nemici giurati del male e dell\'ingiustizia.',
        abilityBonuses: {},
        traits: [
          { name: 'Soffio di Fuoco', actionType: 'action', description: 'Con un\'azione esali un cono di fuoco di 4,5 metri. Ogni creatura nell\'area deve effettuare un TS su Destrezza, subendo 2d6 danni da fuoco se fallisce (dimezzati se supera).' },
          { name: 'Resistenza al Fuoco', description: 'Possiedi resistenza ai danni da fuoco.' }
        ]
      },
      {
        id: 'ottone', name: 'Ottone',
        description: 'Draghi loquaci dei deserti assolati, chiacchieroni e amanti del sole.',
        abilityBonuses: {},
        traits: [
          { name: 'Soffio di Fuoco', actionType: 'action', description: 'Con un\'azione esali una linea di fuoco di 1,5 per 9 metri. Ogni creatura nell\'area deve effettuare un TS su Destrezza, subendo 2d6 danni da fuoco se fallisce (dimezzati se supera).' },
          { name: 'Resistenza al Fuoco', description: 'Possiedi resistenza ai danni da fuoco.' }
        ]
      },
      {
        id: 'rame', name: 'Rame',
        description: 'Draghi burloni delle colline rocciose, amanti di enigmi e scherzi.',
        abilityBonuses: {},
        traits: [
          { name: 'Soffio di Acido', actionType: 'action', description: 'Con un\'azione esali una linea di acido di 1,5 per 9 metri. Ogni creatura nell\'area deve effettuare un TS su Destrezza, subendo 2d6 danni da acido se fallisce (dimezzati se supera).' },
          { name: 'Resistenza all\'Acido', description: 'Possiedi resistenza ai danni da acido.' }
        ]
      },
      {
        id: 'rosso', name: 'Rosso',
        description: 'I più avidi e tirannici tra i draghi cromatici, incarnazione del fuoco distruttore.',
        abilityBonuses: {},
        traits: [
          { name: 'Soffio di Fuoco', actionType: 'action', description: 'Con un\'azione esali un cono di fuoco di 4,5 metri. Ogni creatura nell\'area deve effettuare un TS su Destrezza, subendo 2d6 danni da fuoco se fallisce (dimezzati se supera).' },
          { name: 'Resistenza al Fuoco', description: 'Possiedi resistenza ai danni da fuoco.' }
        ]
      },
      {
        id: 'verde', name: 'Verde',
        description: 'Draghi manipolatori delle foreste antiche, maestri di veleni e inganni.',
        abilityBonuses: {},
        traits: [
          { name: 'Soffio di Veleno', actionType: 'action', description: 'Con un\'azione esali un cono di veleno di 4,5 metri. Ogni creatura nell\'area deve effettuare un TS su Costituzione, subendo 2d6 danni da veleno se fallisce (dimezzati se supera).' },
          { name: 'Resistenza al Veleno', description: 'Possiedi resistenza ai danni da veleno.' }
        ]
      }
    ]
  },
  {
    id: 'gnomo', name: 'Gnomo', icon: '⚙️',
    description: 'Curiosi e geniali, gli gnomi vivono di invenzioni, illusioni e scoperte, animati da un entusiasmo inesauribile.',
    abilityBonuses: { INT: 2 },
    traits: [
      { name: 'Scurovisione', description: 'Puoi vedere in condizioni di luce fioca entro 18 metri come se fosse luce intensa.' },
      { name: 'Astuzia Gnomesca', description: 'Hai vantaggio nei TS su Intelligenza, Saggezza e Carisma contro la magia.' }
    ],
    size: 'Piccola', speed: 7.5, languages: ['Comune', 'Gnomesco'],
    subraces: [
      {
        id: 'gnomo-rocce', name: 'Gnomo delle Rocce',
        description: 'Gnomi inventori e artigiani, maestri di congegni e meccanismi.',
        abilityBonuses: { CON: 1 },
        traits: [
          { name: 'Conoscenza degli Artefici', description: 'Aggiungi il doppio del bonus competenza alle prove di Storia su oggetti magici e congegni.' },
          { name: 'Inventore', description: 'Hai competenza con gli strumenti da inventore e puoi costruire piccoli congegni meccanici.' }
        ]
      },
      {
        id: 'gnomo-foreste', name: 'Gnomo delle Foreste',
        description: 'Gnomi schivi e illusionisti nati, amici delle piccole creature del bosco.',
        abilityBonuses: { DEX: 1 },
        traits: [
          { name: 'Illusionista Nato', description: 'Conosci il trucchetto Illusione Minore. Intelligenza è la caratteristica da incantatore.' },
          { name: 'Parlare con le Piccole Bestie', description: 'Puoi comunicare idee semplici alle bestie Piccole o più minute tramite suoni e gesti.' }
        ]
      }
    ]
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
