import { Spell } from '../core/models/content.model';

// Nota: subclassIds abilita l'incantesimo per sottoclassi magiche
// (es. Cavaliere Mistico e Mistificatore Arcano attingono alla lista del mago).
const ARCANE_SUB = ['cavaliere-mistico', 'mistificatore-arcano'];

export const SPELLS: Spell[] = [
  // ---------- TRUCCHETTI ----------
  {
    id: 'luce', name: 'Luce', level: 0, school: 'Invocazione',
    castingTime: '1 azione', range: 'Contatto', components: 'V, M', duration: '1 ora', concentration: false,
    description: 'Un oggetto emana luce intensa in un raggio di 6 metri e luce fioca per altri 6 metri.',
    classIds: ['bardo', 'chierico', 'stregone', 'mago'], subclassIds: [...ARCANE_SUB, 'dominio-luce']
  },
  {
    id: 'prestidigitazione', name: 'Prestidigitazione', level: 0, school: 'Trasmutazione',
    castingTime: '1 azione', range: '3 metri', components: 'V, S', duration: 'Fino a 1 ora', concentration: false,
    description: 'Piccoli trucchi magici: scintille, pulizia istantanea, accendere candele, piccoli oggetti illusori.',
    classIds: ['bardo', 'stregone', 'warlock', 'mago'], subclassIds: ARCANE_SUB
  },
  {
    id: 'fiotto-fuoco', name: 'Fiotto di Fuoco', level: 0, school: 'Invocazione',
    castingTime: '1 azione', range: '36 metri', components: 'V, S', duration: 'Istantanea', concentration: false,
    description: 'Scagli un dardo di fuoco che infligge 1d10 danni da fuoco (aumenta ai livelli 5, 11 e 17).',
    classIds: ['stregone', 'mago'], subclassIds: ARCANE_SUB
  },
  {
    id: 'raggio-gelo', name: 'Raggio di Gelo', level: 0, school: 'Invocazione',
    castingTime: '1 azione', range: '18 metri', components: 'V, S', duration: 'Istantanea', concentration: false,
    description: 'Un raggio gelido infligge 1d8 danni da freddo e riduce la velocità del bersaglio di 3 metri.',
    classIds: ['stregone', 'mago'], subclassIds: ARCANE_SUB
  },
  {
    id: 'mano-magica', name: 'Mano Magica', level: 0, school: 'Evocazione',
    castingTime: '1 azione', range: '9 metri', components: 'V, S', duration: '1 minuto', concentration: false,
    description: 'Una mano spettrale fluttuante manipola oggetti, apre porte e trasporta fino a 5 kg.',
    classIds: ['bardo', 'stregone', 'warlock', 'mago'], subclassIds: ARCANE_SUB
  },
  {
    id: 'taumaturgia', name: 'Taumaturgia', level: 0, school: 'Trasmutazione',
    castingTime: '1 azione', range: '9 metri', components: 'V', duration: 'Fino a 1 minuto', concentration: false,
    description: 'Manifestazioni di potere divino: voce tonante, fiamme tremolanti, tremori innocui.',
    classIds: ['chierico'], subclassIds: []
  },
  {
    id: 'guida', name: 'Guida', level: 0, school: 'Divinazione',
    castingTime: '1 azione', range: 'Contatto', components: 'V, S', duration: 'Concentrazione, 1 minuto', concentration: true,
    description: 'Il bersaglio aggiunge 1d4 a una prova di caratteristica a sua scelta.',
    classIds: ['chierico', 'druido'], subclassIds: []
  },
  {
    id: 'stretta-folgorante', name: 'Stretta Folgorante', level: 0, school: 'Invocazione',
    castingTime: '1 azione', range: 'Contatto', components: 'V, S', duration: 'Istantanea', concentration: false,
    description: 'Un tocco elettrico infligge 1d8 danni da fulmine, con vantaggio contro bersagli in armatura metallica.',
    classIds: ['stregone', 'mago'], subclassIds: ARCANE_SUB
  },
  {
    id: 'deflagrazione-occulta', name: 'Deflagrazione Occulta', level: 0, school: 'Invocazione',
    castingTime: '1 azione', range: '36 metri', components: 'V, S', duration: 'Istantanea', concentration: false,
    description: 'Un raggio di energia crepitante infligge 1d10 danni da forza. Ai livelli superiori crea più raggi.',
    classIds: ['warlock'], subclassIds: []
  },
  {
    id: 'fiamma-sacra', name: 'Fiamma Sacra', level: 0, school: 'Invocazione',
    castingTime: '1 azione', range: '18 metri', components: 'V, S', duration: 'Istantanea', concentration: false,
    description: 'Una fiamma radiosa scende su una creatura: 1d8 danni radiosi (TS su Destrezza annulla), ignora coperture.',
    classIds: ['chierico'], subclassIds: []
  },
  {
    id: 'artificio-druidico', name: 'Artificio Druidico', level: 0, school: 'Trasmutazione',
    castingTime: '1 azione', range: '9 metri', components: 'V, S', duration: 'Istantanea', concentration: false,
    description: 'Piccoli effetti naturali: prevedi il tempo, fai sbocciare un fiore, accendi o spegni un piccolo fuoco.',
    classIds: ['druido'], subclassIds: []
  },
  {
    id: 'beffa-crudele', name: 'Beffa Crudele', level: 0, school: 'Ammaliamento',
    castingTime: '1 azione', range: '18 metri', components: 'V', duration: 'Istantanea', concentration: false,
    description: 'Insulti intrisi di magia: 1d4 danni psichici e svantaggio al prossimo tiro d\'attacco (TS su Saggezza annulla).',
    classIds: ['bardo'], subclassIds: []
  },
  // ---------- 1° LIVELLO ----------
  {
    id: 'dardo-incantato', name: 'Dardo Incantato', level: 1, school: 'Invocazione',
    castingTime: '1 azione', range: '36 metri', components: 'V, S', duration: 'Istantanea', concentration: false,
    description: 'Tre dardi di forza colpiscono infallibilmente, 1d4+1 danni ciascuno. +1 dardo per slot superiore.',
    classIds: ['stregone', 'mago'], subclassIds: ARCANE_SUB
  },
  {
    id: 'scudo', name: 'Scudo', level: 1, school: 'Abiurazione',
    castingTime: '1 reazione', range: 'Incantatore', components: 'V, S', duration: '1 round', concentration: false,
    description: 'Una barriera invisibile ti dona +5 alla CA fino al tuo prossimo turno e annulla Dardo Incantato.',
    classIds: ['stregone', 'mago'], subclassIds: ARCANE_SUB
  },
  {
    id: 'cura-ferite', name: 'Cura Ferite', level: 1, school: 'Invocazione',
    castingTime: '1 azione', range: 'Contatto', components: 'V, S', duration: 'Istantanea', concentration: false,
    description: 'Una creatura toccata recupera 1d8 + modificatore da incantatore punti ferita. +1d8 per slot superiore.',
    classIds: ['bardo', 'chierico', 'druido', 'paladino', 'ranger'], subclassIds: []
  },
  {
    id: 'parola-guaritrice', name: 'Parola Guaritrice', level: 1, school: 'Invocazione',
    castingTime: '1 azione bonus', range: '18 metri', components: 'V', duration: 'Istantanea', concentration: false,
    description: 'Una parola di potere cura 1d4 + modificatore da incantatore pf a distanza.',
    classIds: ['bardo', 'chierico', 'druido'], subclassIds: []
  },
  {
    id: 'mani-brucianti', name: 'Mani Brucianti', level: 1, school: 'Invocazione',
    castingTime: '1 azione', range: 'Incantatore (cono 4,5 m)', components: 'V, S', duration: 'Istantanea', concentration: false,
    description: 'Un ventaglio di fiamme: 3d6 danni da fuoco nel cono (TS su Destrezza dimezza).',
    classIds: ['stregone', 'mago'], subclassIds: ARCANE_SUB
  },
  {
    id: 'charme-persone', name: 'Charme su Persone', level: 1, school: 'Ammaliamento',
    castingTime: '1 azione', range: '9 metri', components: 'V, S', duration: '1 ora', concentration: false,
    description: 'Un umanoide che fallisce un TS su Saggezza ti considera un conoscente amichevole.',
    classIds: ['bardo', 'druido', 'stregone', 'warlock', 'mago'], subclassIds: ARCANE_SUB
  },
  {
    id: 'sonno', name: 'Sonno', level: 1, school: 'Ammaliamento',
    castingTime: '1 azione', range: '27 metri', components: 'V, S, M', duration: '1 minuto', concentration: false,
    description: 'Addormenta creature per un totale di 5d8 punti ferita, partendo da quella con meno pf.',
    classIds: ['bardo', 'stregone', 'mago'], subclassIds: ARCANE_SUB
  },
  {
    id: 'benedizione', name: 'Benedizione', level: 1, school: 'Ammaliamento',
    castingTime: '1 azione', range: '9 metri', components: 'V, S, M', duration: 'Concentrazione, 1 minuto', concentration: true,
    description: 'Fino a tre creature aggiungono 1d4 ai tiri d\'attacco e ai tiri salvezza.',
    classIds: ['chierico', 'paladino'], subclassIds: []
  },
  {
    id: 'comando', name: 'Comando', level: 1, school: 'Ammaliamento',
    castingTime: '1 azione', range: '18 metri', components: 'V', duration: '1 round', concentration: false,
    description: 'Pronunci un comando di una parola: la creatura che fallisce il TS su Saggezza deve obbedire.',
    classIds: ['chierico', 'paladino'], subclassIds: []
  },
  {
    id: 'marchio-cacciatore', name: 'Marchio del Cacciatore', level: 1, school: 'Divinazione',
    castingTime: '1 azione bonus', range: '27 metri', components: 'V', duration: 'Concentrazione, 1 ora', concentration: true,
    description: 'Marchi una preda: +1d6 danni ai tuoi attacchi con arma contro di essa e vantaggio a rintracciarla.',
    classIds: ['ranger'], subclassIds: []
  },
  {
    id: 'anatema', name: 'Anatema', level: 1, school: 'Ammaliamento',
    castingTime: '1 azione bonus', range: '27 metri', components: 'V, S, M', duration: 'Concentrazione, 1 ora', concentration: true,
    description: 'Maledici una creatura: +1d6 danni necrotici ai tuoi attacchi contro di essa e svantaggio a una caratteristica.',
    classIds: ['warlock'], subclassIds: []
  },
  {
    id: 'intralciare', name: 'Intralciare', level: 1, school: 'Evocazione',
    castingTime: '1 azione', range: '27 metri', components: 'V, S', duration: 'Concentrazione, 1 minuto', concentration: true,
    description: 'Piante rampicanti afferrano le creature in un quadrato di 6 metri (TS su Forza o trattenute).',
    classIds: ['druido', 'ranger'], subclassIds: []
  },
  {
    id: 'armatura-magica', name: 'Armatura Magica', level: 1, school: 'Abiurazione',
    castingTime: '1 azione', range: 'Contatto', components: 'V, S, M', duration: '8 ore', concentration: false,
    description: 'Una creatura senza armatura ottiene CA 13 + modificatore di Destrezza.',
    classIds: ['stregone', 'mago'], subclassIds: ARCANE_SUB
  },
  {
    id: 'punizione-tonante', name: 'Punizione Tonante', level: 1, school: 'Invocazione',
    castingTime: '1 azione bonus', range: 'Incantatore', components: 'V', duration: 'Concentrazione, 1 minuto', concentration: true,
    description: 'Il prossimo colpo in mischia infligge 2d6 danni da tuono extra e può spingere il bersaglio di 3 metri.',
    classIds: ['paladino'], subclassIds: []
  },
  {
    id: 'eroismo', name: 'Eroismo', level: 1, school: 'Ammaliamento',
    castingTime: '1 azione', range: 'Contatto', components: 'V, S', duration: 'Concentrazione, 1 minuto', concentration: true,
    description: 'Una creatura è immune alla paura e guadagna pf temporanei pari al tuo modificatore a ogni turno.',
    classIds: ['bardo', 'paladino'], subclassIds: []
  },
  // ---------- 2° LIVELLO ----------
  {
    id: 'invisibilita', name: 'Invisibilità', level: 2, school: 'Illusione',
    castingTime: '1 azione', range: 'Contatto', components: 'V, S, M', duration: 'Concentrazione, 1 ora', concentration: true,
    description: 'Una creatura toccata diventa invisibile finché non attacca o lancia un incantesimo.',
    classIds: ['bardo', 'stregone', 'warlock', 'mago'], subclassIds: ARCANE_SUB
  },
  {
    id: 'ragnatela', name: 'Ragnatela', level: 2, school: 'Evocazione',
    castingTime: '1 azione', range: '18 metri', components: 'V, S, M', duration: 'Concentrazione, 1 ora', concentration: true,
    description: 'Ragnatele appiccicose riempiono un cubo di 6 metri: le creature rischiano di rimanere trattenute.',
    classIds: ['stregone', 'mago'], subclassIds: ARCANE_SUB
  },
  {
    id: 'immagine-speculare', name: 'Immagine Speculare', level: 2, school: 'Illusione',
    castingTime: '1 azione', range: 'Incantatore', components: 'V, S', duration: '1 minuto', concentration: false,
    description: 'Tre duplicati illusori di te confondono gli attaccanti: gli attacchi possono colpire le copie.',
    classIds: ['stregone', 'warlock', 'mago'], subclassIds: ARCANE_SUB
  },
  {
    id: 'passo-velato', name: 'Passo Velato', level: 2, school: 'Evocazione',
    castingTime: '1 azione bonus', range: 'Incantatore', components: 'V', duration: 'Istantanea', concentration: false,
    description: 'Ti teletrasporti in un punto visibile entro 9 metri, avvolto in una nebbia argentea.',
    classIds: ['stregone', 'warlock', 'mago'], subclassIds: ARCANE_SUB
  },
  {
    id: 'silenzio', name: 'Silenzio', level: 2, school: 'Illusione',
    castingTime: '1 azione', range: '36 metri', components: 'V, S', duration: 'Concentrazione, 10 minuti', concentration: true, ritual: true,
    description: 'Nessun suono può essere creato o attraversare una sfera di 6 metri di raggio.',
    classIds: ['bardo', 'chierico', 'ranger'], subclassIds: []
  },
  {
    id: 'aiuto', name: 'Aiuto', level: 2, school: 'Abiurazione',
    castingTime: '1 azione', range: '9 metri', components: 'V, S, M', duration: '8 ore', concentration: false,
    description: 'Fino a tre creature guadagnano 5 punti ferita massimi e attuali per 8 ore.',
    classIds: ['chierico', 'paladino'], subclassIds: []
  },
  {
    id: 'sfera-infuocata', name: 'Sfera Infuocata', level: 2, school: 'Evocazione',
    castingTime: '1 azione', range: '18 metri', components: 'V, S, M', duration: 'Concentrazione, 1 minuto', concentration: true,
    description: 'Una sfera di fuoco rotolante (2d6 danni) che puoi muovere di 9 metri come azione bonus.',
    classIds: ['druido', 'stregone', 'mago'], subclassIds: ARCANE_SUB
  },
  {
    id: 'ristorare-inferiore', name: 'Ristorare Inferiore', level: 2, school: 'Abiurazione',
    castingTime: '1 azione', range: 'Contatto', components: 'V, S', duration: 'Istantanea', concentration: false,
    description: 'Poni fine a una malattia o a una condizione: accecato, assordato, paralizzato o avvelenato.',
    classIds: ['bardo', 'chierico', 'druido', 'paladino', 'ranger'], subclassIds: []
  },
  {
    id: 'raggio-rovente', name: 'Raggio Rovente', level: 2, school: 'Invocazione',
    castingTime: '1 azione', range: '36 metri', components: 'V, S', duration: 'Istantanea', concentration: false,
    description: 'Tre raggi di fuoco, ciascuno 2d6 danni con attacco a distanza. +1 raggio per slot superiore.',
    classIds: ['stregone', 'mago'], subclassIds: ARCANE_SUB
  },
  // ---------- 3° LIVELLO ----------
  {
    id: 'palla-fuoco', name: 'Palla di Fuoco', level: 3, school: 'Invocazione',
    castingTime: '1 azione', range: '45 metri', components: 'V, S, M', duration: 'Istantanea', concentration: false,
    description: 'Un\'esplosione di fiamme in una sfera di 6 metri: 8d6 danni da fuoco (TS su Destrezza dimezza).',
    classIds: ['stregone', 'mago'], subclassIds: [...ARCANE_SUB, 'immondo']
  },
  {
    id: 'fulmine', name: 'Fulmine', level: 3, school: 'Invocazione',
    castingTime: '1 azione', range: 'Incantatore (linea 30 m)', components: 'V, S, M', duration: 'Istantanea', concentration: false,
    description: 'Una linea di fulmine lunga 30 metri: 8d6 danni da fulmine (TS su Destrezza dimezza).',
    classIds: ['stregone', 'mago'], subclassIds: ARCANE_SUB
  },
  {
    id: 'contromagia', name: 'Contromagia', level: 3, school: 'Abiurazione',
    castingTime: '1 reazione', range: '18 metri', components: 'S', duration: 'Istantanea', concentration: false,
    description: 'Interrompi un incantesimo di 3° livello o inferiore; per livelli superiori serve una prova di caratteristica.',
    classIds: ['stregone', 'warlock', 'mago'], subclassIds: ARCANE_SUB
  },
  {
    id: 'volare', name: 'Volare', level: 3, school: 'Trasmutazione',
    castingTime: '1 azione', range: 'Contatto', components: 'V, S, M', duration: 'Concentrazione, 10 minuti', concentration: true,
    description: 'Una creatura ottiene velocità di volo di 18 metri per la durata.',
    classIds: ['stregone', 'warlock', 'mago'], subclassIds: ARCANE_SUB
  },
  {
    id: 'velocita', name: 'Velocità', level: 3, school: 'Trasmutazione',
    castingTime: '1 azione', range: '9 metri', components: 'V, S, M', duration: 'Concentrazione, 1 minuto', concentration: true,
    description: 'Il bersaglio raddoppia la velocità, +2 CA, vantaggio ai TS su Destrezza e un\'azione aggiuntiva limitata.',
    classIds: ['stregone', 'mago'], subclassIds: ARCANE_SUB
  },
  {
    id: 'dissolvi-magie', name: 'Dissolvi Magie', level: 3, school: 'Abiurazione',
    castingTime: '1 azione', range: '36 metri', components: 'V, S', duration: 'Istantanea', concentration: false,
    description: 'Poni fine agli incantesimi di 3° livello o inferiore su un bersaglio; prova per quelli superiori.',
    classIds: ['bardo', 'chierico', 'druido', 'paladino', 'stregone', 'warlock', 'mago'], subclassIds: ARCANE_SUB
  },
  {
    id: 'rinascita', name: 'Rinascita', level: 3, school: 'Necromanzia',
    castingTime: '1 azione', range: 'Contatto', components: 'V, S, M', duration: 'Istantanea', concentration: false,
    description: 'Riporti in vita una creatura morta da non più di 1 minuto (componente: diamanti da 300 mo).',
    classIds: ['bardo', 'chierico'], subclassIds: []
  },
  {
    id: 'parola-guaritrice-massa', name: 'Parola Guaritrice di Massa', level: 3, school: 'Invocazione',
    castingTime: '1 azione bonus', range: '18 metri', components: 'V', duration: 'Istantanea', concentration: false,
    description: 'Fino a sei creature recuperano 1d4 + modificatore da incantatore punti ferita.',
    classIds: ['chierico'], subclassIds: []
  },
  // ---------- 4° LIVELLO ----------
  {
    id: 'invisibilita-superiore', name: 'Invisibilità Superiore', level: 4, school: 'Illusione',
    castingTime: '1 azione', range: 'Contatto', components: 'V, S', duration: 'Concentrazione, 1 minuto', concentration: true,
    description: 'Il bersaglio è invisibile per la durata, anche quando attacca o lancia incantesimi.',
    classIds: ['bardo', 'stregone', 'mago'], subclassIds: ARCANE_SUB
  },
  {
    id: 'porta-dimensionale', name: 'Porta Dimensionale', level: 4, school: 'Evocazione',
    castingTime: '1 azione', range: '150 metri', components: 'V', duration: 'Istantanea', concentration: false,
    description: 'Ti teletrasporti (con una creatura consenziente) in un punto entro gittata che puoi visualizzare.',
    classIds: ['bardo', 'stregone', 'warlock', 'mago'], subclassIds: ARCANE_SUB
  },
  {
    id: 'scudo-fuoco', name: 'Scudo di Fuoco', level: 4, school: 'Invocazione',
    castingTime: '1 azione', range: 'Incantatore', components: 'V, S, M', duration: '10 minuti', concentration: false,
    description: 'Fiamme ti avvolgono: resistenza al freddo o al fuoco e 2d8 danni a chi ti colpisce in mischia.',
    classIds: ['druido', 'stregone', 'mago'], subclassIds: ARCANE_SUB
  },
  {
    id: 'guardiano-fede', name: 'Guardiano della Fede', level: 4, school: 'Evocazione',
    castingTime: '1 azione', range: '9 metri', components: 'V', duration: '8 ore', concentration: false,
    description: 'Un guardiano spettrale punisce i nemici che si avvicinano: 20 danni radiosi (TS dimezza).',
    classIds: ['chierico'], subclassIds: []
  },
  // ---------- 5° LIVELLO ----------
  {
    id: 'cono-freddo', name: 'Cono di Freddo', level: 5, school: 'Invocazione',
    castingTime: '1 azione', range: 'Incantatore (cono 18 m)', components: 'V, S, M', duration: 'Istantanea', concentration: false,
    description: 'Un\'esplosione di aria gelida: 8d8 danni da freddo nel cono (TS su Costituzione dimezza).',
    classIds: ['stregone', 'mago'], subclassIds: ARCANE_SUB
  },
  {
    id: 'rianimare-morti', name: 'Rianimare i Morti', level: 5, school: 'Necromanzia',
    castingTime: '1 ora', range: 'Contatto', components: 'V, S, M', duration: 'Istantanea', concentration: false,
    description: 'Riporti in vita una creatura morta da non più di 10 giorni (componente: diamante da 500 mo).',
    classIds: ['bardo', 'chierico', 'paladino'], subclassIds: []
  },
  {
    id: 'cura-ferite-massa', name: 'Cura Ferite di Massa', level: 5, school: 'Invocazione',
    castingTime: '1 azione', range: '18 metri', components: 'V, S', duration: 'Istantanea', concentration: false,
    description: 'Fino a sei creature in una sfera di 9 m recuperano 3d8 + modificatore da incantatore pf.',
    classIds: ['bardo', 'chierico', 'druido'], subclassIds: []
  },
  {
    id: 'colpo-fiammeggiante', name: 'Colpo Fiammeggiante', level: 5, school: 'Invocazione',
    castingTime: '1 azione', range: '18 metri', components: 'V, S', duration: 'Istantanea', concentration: false,
    description: 'Una colonna di fuoco divino scende dal cielo: 4d6 danni da fuoco + 4d6 radiosi (TS dimezza).',
    classIds: ['chierico'], subclassIds: ['dominio-luce']
  }
];
