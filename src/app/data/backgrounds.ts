import { Background } from '../core/models/content.model';

export const BACKGROUNDS: Background[] = [
  {
    id: 'accolito', name: 'Accolito', icon: '⛪',
    description: 'Hai trascorso la vita al servizio di un tempio, come intermediario tra il regno sacro e il mondo mortale.',
    skillProficiencies: ['intuizione', 'religione'],
    toolProficiencies: [],
    languages: ['Due lingue a scelta'],
    equipment: ['Simbolo sacro', 'Libro di preghiere', '5 bastoncini di incenso', 'Vesti', 'Abito comune', '15 mo'],
    feature: { name: 'Rifugio del Fedele', description: 'Tu e i tuoi compagni potete ricevere cure e assistenza gratuite presso i templi della tua fede.' }
  },
  {
    id: 'criminale', name: 'Criminale', icon: '🗡️',
    description: 'Hai una lunga esperienza nell\'infrangere la legge e sopravvivi grazie ai tuoi contatti nel mondo criminale.',
    skillProficiencies: ['inganno', 'furtivita'],
    toolProficiencies: ['Arnesi da scasso', 'Un tipo di gioco'],
    languages: [],
    equipment: ['Piede di porco', 'Abiti scuri con cappuccio', '15 mo'],
    feature: { name: 'Contatto Criminale', description: 'Hai un contatto affidabile che funge da tramite con la rete criminale, anche a grande distanza.' }
  },
  {
    id: 'eroe-popolo', name: 'Eroe del Popolo', icon: '🌾',
    description: 'Provieni da umili origini, ma sei destinato a molto di più: la gente comune ti considera già un campione.',
    skillProficiencies: ['addestrare-animali', 'sopravvivenza'],
    toolProficiencies: ['Un tipo di strumenti da artigiano', 'Veicoli (terrestri)'],
    languages: [],
    equipment: ['Strumenti da artigiano', 'Pala', 'Pentola di ferro', 'Abito comune', '10 mo'],
    feature: { name: 'Ospitalità Rustica', description: 'La gente comune ti offre rifugio e protezione, e ti nasconde dalle autorità se necessario.' }
  },
  {
    id: 'nobile', name: 'Nobile', icon: '👑',
    description: 'Sei nato tra ricchezza, potere e privilegio: la tua famiglia possiede terre, titoli e grandi responsabilità.',
    skillProficiencies: ['storia', 'persuasione'],
    toolProficiencies: ['Un tipo di gioco'],
    languages: ['Una lingua a scelta'],
    equipment: ['Abito raffinato', 'Anello con sigillo', 'Pergamena di lignaggio', '25 mo'],
    feature: { name: 'Posizione Privilegiata', description: 'Sei benvenuto nell\'alta società e la gente comune fa di tutto per compiacerti.' }
  },
  {
    id: 'saggio', name: 'Saggio', icon: '📜',
    description: 'Hai passato anni a studiare il multiverso tra tomi, pergamene e conversazioni con i più grandi eruditi.',
    skillProficiencies: ['arcano', 'storia'],
    toolProficiencies: [],
    languages: ['Due lingue a scelta'],
    equipment: ['Boccetta di inchiostro', 'Penna d\'oca', 'Coltellino', 'Lettera di un collega defunto', 'Abito comune', '10 mo'],
    feature: { name: 'Ricercatore', description: 'Quando non conosci un\'informazione, spesso sai dove e da chi poterla ottenere.' }
  },
  {
    id: 'soldato', name: 'Soldato', icon: '🛡️',
    description: 'La guerra è stata la tua vita: hai marciato, combattuto e visto la morte in faccia al servizio di un esercito.',
    skillProficiencies: ['atletica', 'intimidire'],
    toolProficiencies: ['Un tipo di gioco', 'Veicoli (terrestri)'],
    languages: [],
    equipment: ['Insegne del grado', 'Trofeo di un nemico caduto', 'Set di dadi in osso', 'Abito comune', '10 mo'],
    feature: { name: 'Grado Militare', description: 'I soldati fedeli alla tua vecchia organizzazione riconoscono ancora la tua autorità.' }
  },
  {
    id: 'intrattenitore', name: 'Intrattenitore', icon: '🎭',
    description: 'Vivi per il pubblico: musica, danza e racconti sono le tue armi per conquistare i cuori delle folle.',
    skillProficiencies: ['acrobazia', 'intrattenere'],
    toolProficiencies: ['Trucchi per il camuffamento', 'Un tipo di strumento musicale'],
    languages: [],
    equipment: ['Strumento musicale', 'Pegno di un ammiratore', 'Costume', '15 mo'],
    feature: { name: 'A Richiesta del Pubblico', description: 'Puoi sempre trovare un posto dove esibirti, ricevendo vitto e alloggio in cambio.' }
  },
  {
    id: 'artigiano-gilda', name: 'Artigiano di Gilda', icon: '🔨',
    description: 'Sei membro di una gilda di artigiani, esperto in un mestiere e ben inserito nella rete mercantile.',
    skillProficiencies: ['intuizione', 'persuasione'],
    toolProficiencies: ['Un tipo di strumenti da artigiano'],
    languages: ['Una lingua a scelta'],
    equipment: ['Strumenti da artigiano', 'Lettera di presentazione della gilda', 'Abito da viaggiatore', '15 mo'],
    feature: { name: 'Appartenenza alla Gilda', description: 'La tua gilda ti offre alloggio, supporto legale e una rete di contatti commerciali.' }
  },
  {
    id: 'ciarlatano', name: 'Ciarlatano', icon: '🃏',
    description: 'Sei sempre stato bravo a leggere le persone e a dire loro esattamente ciò che vogliono sentire, vivendo di raggiri e false identità.',
    skillProficiencies: ['inganno', 'rapidita-di-mano'],
    toolProficiencies: ['Kit da travestitore', 'Kit da falsario'],
    languages: [],
    equipment: ['Abito raffinato', 'Kit da travestitore', 'Attrezzi della truffa (dadi truccati, mazzo di carte segnate o anello con sigillo di un duca immaginario)', '15 mo'],
    feature: { name: 'Falsa Identità', description: 'Hai creato una seconda identità completa di documenti, contatti e alloggio, che puoi usare per proteggere la tua vera natura.' }
  },
  {
    id: 'eremita', name: 'Eremita', icon: '🕯️',
    description: 'Hai vissuto in isolamento, in un rifugio remoto lontano dalla civiltà, dedicandoti alla contemplazione o alla ricerca di un segreto spirituale.',
    skillProficiencies: ['medicina', 'religione'],
    toolProficiencies: ['Borsa da erborista'],
    languages: ['Una lingua a scelta'],
    equipment: ['Astuccio con appunti sui tuoi studi', 'Coperta invernale', 'Abito comune', 'Borsa da erborista', '5 mo'],
    feature: { name: 'Scoperta', description: 'La tua vita di contemplazione ti ha rivelato una grande verità o un segreto importante sul multiverso.' }
  },
  {
    id: 'forestiero', name: 'Forestiero', icon: '🏔️',
    description: 'Sei cresciuto nella natura selvaggia, lontano dalla civiltà, tra ampie distese o profonde foreste dove hai imparato a sopravvivere.',
    skillProficiencies: ['atletica', 'sopravvivenza'],
    toolProficiencies: ['Un tipo di strumento musicale'],
    languages: ['Una lingua a scelta'],
    equipment: ['Bastone', 'Trappola da caccia', 'Trofeo dell\'animale che hai ucciso', 'Abito da viaggiatore', '10 mo'],
    feature: { name: 'Vagabondo', description: 'Ricordi sempre la strada di casa e puoi trovare cibo e acqua per te e altre cinque persone ogni giorno, a patto che la regione offra bacche, acqua fresca e selvaggina.' }
  },
  {
    id: 'marinaio', name: 'Marinaio', icon: '⚓',
    description: 'Hai navigato su una nave oceanica per anni, affrontando tempeste, mostri marini e chiunque abbia cercato di affondare la tua nave.',
    skillProficiencies: ['atletica', 'percezione'],
    toolProficiencies: ['Strumenti di navigazione', 'Veicoli (acquatici)'],
    languages: [],
    equipment: ['Bastone da manovra (clava)', '15 metri di corda di seta', 'Amuleto portafortuna', 'Abito comune', '10 mo'],
    feature: { name: 'Passaggio sulla Nave', description: 'Puoi ottenere un passaggio gratuito su una nave mercantile per te e i tuoi compagni, in cambio di aiuto durante il viaggio.' }
  },
  {
    id: 'monello', name: 'Monello', icon: '🐀',
    description: 'Sei cresciuto per strada, orfano e povero, imparando a sopravvivere rubando cibo e trovando riparo in ogni angolo nascosto della città.',
    skillProficiencies: ['rapidita-di-mano', 'furtivita'],
    toolProficiencies: ['Kit da travestitore', 'Arnesi da scasso'],
    languages: [],
    equipment: ['Piccolo coltello', 'Mappa della città natale', 'Topo domestico', 'Ricordo dei genitori', 'Abito comune', '10 mo'],
    feature: { name: 'Segreti della Città', description: 'Conosci i passaggi segreti e nascosti di una città e puoi trovare rifugio o attraversarla rapidamente non vista con te e sei compagni.' }
  }
];
