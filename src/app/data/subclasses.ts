import { Subclass } from '../core/models/content.model';

export const SUBCLASSES: Subclass[] = [
  // ---------- BARBARO ----------
  {
    id: 'berserker', classId: 'barbaro', name: 'Cammino del Berserker',
    description: 'Per il berserker l\'ira è un mezzo per raggiungere un fine: la violenza pura e incontrollata.',
    features: [
      { id: 'berserker-frenesia', name: 'Frenesia', level: 3, actionType: 'none', description: 'Quando entri in ira puoi scatenarti in frenesia: un attacco in mischia extra come azione bonus a ogni turno. Al termine subisci un livello di indebolimento.' },
      { id: 'berserker-ira-insensata', name: 'Ira Insensata', level: 6, actionType: 'none', description: 'Non puoi essere affascinato o spaventato mentre sei in ira.' },
      { id: 'berserker-presenza', name: 'Presenza Intimidatoria', level: 10, actionType: 'action', description: 'Come azione puoi spaventare una creatura entro 9 metri (TS su Saggezza).' }
    ]
  },
  {
    id: 'totem-lupo', classId: 'barbaro', name: 'Cammino del Combattente Totemico',
    description: 'Un cammino spirituale che accetta uno spirito animale come guida, protettore e fonte di potere.',
    features: [
      { id: 'totem-cercatore', name: 'Cercatore di Spiriti', level: 3, actionType: 'none', description: 'Puoi lanciare Percezione delle Bestie e Parlare con gli Animali come rituali.' },
      { id: 'totem-spirito', name: 'Spirito Totemico', level: 3, actionType: 'none', description: 'Scegli uno spirito totem (Orso, Aquila, Lupo) che ti concede un potere mentre sei in ira. L\'Orso dona resistenza a tutti i danni tranne quelli psichici.' },
      { id: 'totem-aspetto', name: 'Aspetto della Bestia', level: 6, actionType: 'none', description: 'Ottieni un beneficio magico legato al tuo animale totemico, attivo anche fuori dall\'ira.' }
    ]
  },
  // ---------- BARDO ----------
  {
    id: 'collegio-sapienza', classId: 'bardo', name: 'Collegio della Sapienza',
    description: 'I bardi di questo collegio raccolgono ogni frammento di conoscenza e usano parole taglienti come lame.',
    features: [
      { id: 'sapienza-competenze', name: 'Competenze Bonus', level: 3, actionType: 'none', description: 'Ottieni competenza in tre abilità a tua scelta.' },
      { id: 'sapienza-parole-taglienti', name: 'Parole Taglienti', level: 3, actionType: 'reaction', description: 'Con la reazione spendi un dado di Ispirazione Bardica per sottrarlo a un tiro d\'attacco, prova o danno di un nemico.' },
      { id: 'sapienza-segreti', name: 'Segreti Magici Aggiuntivi', level: 6, actionType: 'none', description: 'Apprendi due incantesimi a scelta da qualsiasi classe.' }
    ]
  },
  {
    id: 'collegio-valore', classId: 'bardo', name: 'Collegio del Valore',
    description: 'Bardi audaci che cantano le gesta degli eroi antichi e combattono in prima linea per ispirarne di nuove.',
    features: [
      { id: 'valore-competenze', name: 'Competenze Bonus', level: 3, actionType: 'none', description: 'Ottieni competenza con armature medie, scudi e armi da guerra.' },
      { id: 'valore-ispirazione', name: 'Ispirazione al Combattimento', level: 3, actionType: 'reaction', description: 'Chi ha il tuo dado di ispirazione può aggiungerlo ai danni o alla CA come reazione.' },
      { id: 'valore-attacco-extra', name: 'Attacco Extra', level: 6, actionType: 'none', description: 'Quando usi l\'azione di Attacco puoi attaccare due volte anziché una.' }
    ]
  },
  // ---------- CHIERICO ----------
  {
    id: 'dominio-vita', classId: 'chierico', name: 'Dominio della Vita',
    description: 'Il dominio della vitalità positiva che scorre nel multiverso: i suoi chierici sono guaritori senza pari.',
    features: [
      { id: 'vita-discepolo', name: 'Discepolo della Vita', level: 1, actionType: 'none', description: 'I tuoi incantesimi di guarigione di 1° livello o superiore curano 2 + livello dell\'incantesimo pf aggiuntivi.' },
      { id: 'vita-competenza', name: 'Competenza Bonus', level: 1, actionType: 'none', description: 'Ottieni competenza con le armature pesanti.' },
      { id: 'vita-incanalare', name: 'Incanalare Divinità: Preservare Vita', level: 2, actionType: 'action', description: 'Distribuisci punti ferita di guarigione pari a 5 × il tuo livello da chierico tra creature entro 9 metri.' },
      { id: 'vita-guaritore-benedetto', name: 'Guaritore Benedetto', level: 6, actionType: 'none', description: 'Quando curi altri con un incantesimo, recuperi anche tu 2 + livello dell\'incantesimo punti ferita.' }
    ]
  },
  {
    id: 'dominio-luce', classId: 'chierico', name: 'Dominio della Luce',
    description: 'Chierici del sole e della fiamma purificatrice, portatori di verità che scacciano le tenebre.',
    features: [
      { id: 'luce-trucchetto', name: 'Trucchetto Bonus', level: 1, actionType: 'none', description: 'Conosci il trucchetto Luce.' },
      { id: 'luce-fiamma-protettrice', name: 'Fiamma Protettrice', level: 1, actionType: 'reaction', description: 'Con la reazione imponi svantaggio a un attacco contro di te (utilizzi pari al mod. di Saggezza).' },
      { id: 'luce-incanalare', name: 'Incanalare Divinità: Splendore dell\'Alba', level: 2, actionType: 'action', description: 'Scacci l\'oscurità magica entro 9 m; i nemici subiscono 2d10 + livello danni radiosi (TS su Costituzione dimezza).' }
    ]
  },
  {
    id: 'dominio-conoscenza', classId: 'chierico', name: 'Dominio della Conoscenza',
    description: 'Chierici eruditi devoti a divinità del sapere, custodi di biblioteche e segreti dimenticati dal tempo.',
    features: [
      { id: 'conoscenza-benedizioni', name: 'Benedizioni del Sapiente', level: 1, actionType: 'none', description: 'Apprendi due lingue a scelta e ottieni competenza in due tra Arcano, Storia, Natura o Religione; il bonus di competenza è raddoppiato per quelle prove.' },
      { id: 'conoscenza-incanalare-eta', name: 'Incanalare Divinità: Sapienza degli Evi', level: 2, actionType: 'action', description: 'Ottieni competenza in una prova di caratteristica a tua scelta per i prossimi 10 minuti.' },
      { id: 'conoscenza-leggere-pensieri', name: 'Incanalare Divinità: Leggere i Pensieri', level: 6, actionType: 'action', description: 'Leggi la mente di una creatura per 1 minuto; puoi sondarne i pensieri più profondi o impiantare un suggerimento.' }
    ]
  },
  {
    id: 'dominio-natura', classId: 'chierico', name: 'Dominio della Natura',
    description: 'Chierici che venerano gli dèi della natura selvaggia, custodi delle foreste e alleati delle creature del mondo naturale.',
    features: [
      { id: 'natura-discepolo', name: 'Discepolo della Natura', level: 1, actionType: 'none', description: 'Apprendi un trucchetto druidico e ottieni competenza in una tra Addestrare Animali, Natura o Sopravvivenza.' },
      { id: 'natura-competenza', name: 'Competenza Bonus', level: 1, actionType: 'none', description: 'Ottieni competenza con le armature pesanti.' },
      { id: 'natura-incanalare', name: 'Incanalare Divinità: Ammaliare Animali e Piante', level: 2, actionType: 'action', description: 'Affascini bestie e piante entro 18 metri, che devono superare un TS su Saggezza o esserti amichevoli.' },
      { id: 'natura-attenuare', name: 'Attenuare gli Elementi', level: 6, actionType: 'none', description: 'Tu e gli alleati entro 3 metri avete resistenza ai danni da freddo e da fuoco.' }
    ]
  },
  {
    id: 'dominio-tempesta', classId: 'chierico', name: 'Dominio della Tempesta',
    description: 'Chierici delle divinità del cielo, del tuono e del mare, che scagliano fulmini contro i nemici della fede.',
    features: [
      { id: 'tempesta-competenza', name: 'Competenza Bonus', level: 1, actionType: 'none', description: 'Ottieni competenza con armature pesanti e armi da guerra.' },
      { id: 'tempesta-ira', name: 'Ira della Tempesta', level: 1, actionType: 'reaction', description: 'Con la reazione, quando subisci danni da un attacco in mischia, infliggi all\'attaccante 2d8 danni da fulmine o tuono.' },
      { id: 'tempesta-incanalare', name: 'Incanalare Divinità: Ira Distruttiva', level: 2, actionType: 'none', description: 'Massimizzi i danni da fulmine o tuono del prossimo incantesimo che lanci.' },
      { id: 'tempesta-folgore', name: 'Colpo di Fulmine', level: 6, actionType: 'none', description: 'Quando colpisci con un attacco con arma, puoi scagliare la creatura fino a 3 metri con un TS su Forza.' }
    ]
  },
  {
    id: 'dominio-inganno', classId: 'chierico', name: 'Dominio dell\'Inganno',
    description: 'Chierici di divinità ingannevoli, mercanti di segreti e maestri dell\'illusione al servizio di scopi indicibili.',
    features: [
      { id: 'inganno-benedizione', name: 'Benedizione dell\'Imbroglione', level: 1, actionType: 'action', description: 'Tocchi una creatura consenziente donandole vantaggio alle prove di Furtività per 1 ora.' },
      { id: 'inganno-invocare-duplicita', name: 'Incanalare Divinità: Invocare Duplicità', level: 2, actionType: 'action', description: 'Crei un\'illusione di te stesso che dura un minuto, utile per distrarre e ingannare i nemici.' },
      { id: 'inganno-manto-ombre', name: 'Incanalare Divinità: Manto d\'Ombre', level: 6, actionType: 'action', description: 'Diventi invisibile fino alla fine del tuo prossimo turno.' }
    ]
  },
  {
    id: 'dominio-guerra', classId: 'chierico', name: 'Dominio della Guerra',
    description: 'Chierici delle divinità della battaglia, che portano la fede sul campo di battaglia con lama e preghiera.',
    features: [
      { id: 'guerra-competenza', name: 'Competenza Bonus', level: 1, actionType: 'none', description: 'Ottieni competenza con armature pesanti e armi da guerra.' },
      { id: 'guerra-sacerdote', name: 'Sacerdote di Guerra', level: 1, actionType: 'bonus', description: 'Come azione bonus, quando usi l\'azione di Attacco, effettui un attacco extra con arma. Utilizzi pari al mod. di Saggezza per riposo.' },
      { id: 'guerra-incanalare', name: 'Incanalare Divinità: Colpo Guidato', level: 2, actionType: 'none', description: 'Ottieni +10 a un tiro per colpire dopo averlo tirato.' },
      { id: 'guerra-benedizione', name: 'Incanalare Divinità: Benedizione del Dio della Guerra', level: 6, actionType: 'reaction', description: 'Con la reazione, dopo che un alleato entro 9 m attacca, gli concedi +10 al tiro per colpire.' }
    ]
  },
  // ---------- DRUIDO ----------
  {
    id: 'circolo-terra', classId: 'druido', name: 'Circolo della Terra',
    description: 'Mistici custodi dei luoghi sacri, la cui magia è plasmata dal territorio in cui sono stati iniziati.',
    features: [
      { id: 'terra-trucchetto', name: 'Trucchetto Bonus', level: 2, actionType: 'none', description: 'Apprendi un trucchetto da druido aggiuntivo.' },
      { id: 'terra-recupero', name: 'Recupero Naturale', level: 2, actionType: 'none', description: 'Durante un riposo breve recuperi slot incantesimo di livello complessivo pari a metà del tuo livello da druido.' },
      { id: 'terra-incantesimi', name: 'Incantesimi del Circolo', level: 3, actionType: 'none', description: 'Il tuo legame con la terra ti concede incantesimi aggiuntivi sempre preparati, in base al territorio scelto.' },
      { id: 'terra-passo', name: 'Passo sul Territorio', level: 6, actionType: 'none', description: 'Il terreno difficile non magico non ti costa movimento extra e non puoi essere rallentato da piante magiche.' }
    ]
  },
  {
    id: 'circolo-luna', classId: 'druido', name: 'Circolo della Luna',
    description: 'Druidi feroci che dominano la Forma Selvatica, trasformandosi in bestie possenti per difendere la natura.',
    features: [
      { id: 'luna-forma-combattente', name: 'Forma Selvatica da Combattimento', level: 2, actionType: 'bonus', description: 'Puoi usare Forma Selvatica come azione bonus e trasformarti in bestie di GS 1 (che cresce con il livello).' },
      { id: 'luna-guarigione', name: 'Guarigione Primordiale', level: 2, actionType: 'bonus', description: 'Mentre sei in Forma Selvatica puoi spendere slot incantesimo come azione bonus per recuperare 1d8 pf per livello di slot.' },
      { id: 'luna-colpi-primordiali', name: 'Colpi Primordiali', level: 6, actionType: 'none', description: 'I tuoi attacchi in forma bestiale contano come magici.' }
    ]
  },
  // ---------- GUERRIERO ----------
  {
    id: 'campione', classId: 'guerriero', name: 'Campione',
    description: 'L\'archetipo della potenza fisica pura, affinata fino alla perfezione letale.',
    features: [
      { id: 'campione-critico', name: 'Critico Migliorato', level: 3, actionType: 'none', description: 'I tuoi attacchi con le armi mettono a segno un colpo critico con un risultato di 19 o 20.' },
      { id: 'campione-atleta', name: 'Atleta Eccezionale', level: 7, actionType: 'none', description: 'Aggiungi metà del bonus di competenza alle prove di Forza, Destrezza e Costituzione che non lo includono già.' },
      { id: 'campione-stile', name: 'Stile di Combattimento Aggiuntivo', level: 10, actionType: 'none', description: 'Adotti un secondo Stile di Combattimento.' }
    ]
  },
  {
    id: 'maestro-battaglia', classId: 'guerriero', name: 'Maestro di Battaglia',
    description: 'Un tattico erudito che tramanda tecniche marziali antiche: per lui la battaglia è una scienza.',
    features: [
      {
        id: 'mdb-manovre', name: 'Manovre di Combattimento', level: 3, actionType: 'none',
        description: 'Apprendi manovre alimentate da dadi superiorità (4d8, che crescono di numero e taglia con il livello). Apprendi 3 manovre al 3° livello e altre ai livelli 7, 10 e 15.',
        selection: { poolId: 'manovre', unlocks: [{ level: 3, maxTotal: 3 }, { level: 7, maxTotal: 5 }, { level: 10, maxTotal: 7 }, { level: 15, maxTotal: 9 }] }
      },
      { id: 'mdb-dadi', name: 'Dadi Superiorità', level: 3, actionType: 'none', description: 'Hai 4 dadi superiorità (d8) per alimentare le manovre; li recuperi con un riposo breve o lungo. Un dado in più ai livelli 7 e 15.' },
      { id: 'mdb-studioso', name: 'Studioso di Guerra', level: 3, actionType: 'none', description: 'Ottieni competenza in un tipo di strumenti da artigiano a tua scelta.' },
      { id: 'mdb-conosci-nemico', name: 'Conosci il Tuo Nemico', level: 7, actionType: 'none', description: 'Osservando una creatura per 1 minuto scopri se ti è superiore o inferiore in due caratteristiche a scelta.' }
    ]
  },
  {
    id: 'cavaliere-mistico', classId: 'guerriero', name: 'Cavaliere Mistico',
    description: 'Un guerriero che affianca alla maestria marziale lo studio dell\'arcano, intrecciando acciaio e magia.',
    spellcasting: { ability: 'INT', progression: 'third', prepares: false, hasCantrips: true },
    features: [
      { id: 'cm-incantesimi', name: 'Uso degli Incantesimi', level: 3, actionType: 'none', description: 'Apprendi trucchetti e incantesimi da mago (soprattutto di abiurazione ed evocazione), con progressione da incantatore a un terzo.' },
      { id: 'cm-legame-arma', name: 'Legame con l\'Arma', level: 3, actionType: 'bonus', description: 'Con un rituale leghi a te fino a due armi: non puoi essere disarmato e puoi evocarle come azione bonus.' },
      { id: 'cm-magia-guerra', name: 'Magia da Guerra', level: 7, actionType: 'bonus', description: 'Quando usi l\'azione per lanciare un trucchetto, puoi effettuare un attacco con l\'arma come azione bonus.' }
    ]
  },
  // ---------- MONACO ----------
  {
    id: 'mano-aperta', classId: 'monaco', name: 'Via della Mano Aperta',
    description: 'Maestri supremi del combattimento a mani nude, capaci di manipolare il ki altrui.',
    features: [
      { id: 'mano-tecnica', name: 'Tecnica della Mano Aperta', level: 3, actionType: 'none', description: 'Quando colpisci con la Raffica di Colpi puoi buttare a terra il bersaglio, spingerlo di 4,5 m o impedirgli le reazioni.' },
      { id: 'mano-integrita', name: 'Integrità del Corpo', level: 6, actionType: 'action', description: 'Come azione recuperi punti ferita pari a 3 × il tuo livello da monaco. Una volta per riposo lungo.' },
      { id: 'mano-tranquillita', name: 'Tranquillità', level: 11, actionType: 'none', description: 'Al termine di un riposo lungo ottieni l\'effetto di Santuario che dura finché non viene infranto.' }
    ]
  },
  {
    id: 'quattro-elementi', classId: 'monaco', name: 'Via dei Quattro Elementi',
    description: 'Monaci che incanalano il ki per dominare i quattro elementi, trasformando il corpo in un tramite per la furia della natura.',
    features: [
      {
        id: 'qe-discipline', name: 'Discipline Elementali', level: 3, actionType: 'none',
        description: 'Apprendi discipline che sfruttano il ki per dominare gli elementi. Conosci la Sintonia Elementale e scegli 1 disciplina al 3° livello, un\'altra ai livelli 6, 11 e 17. Puoi sostituirne una quando ne apprendi una nuova.',
        selection: { poolId: 'discipline-elementali', unlocks: [{ level: 3, maxTotal: 1 }, { level: 6, maxTotal: 2 }, { level: 11, maxTotal: 3 }, { level: 17, maxTotal: 4 }] }
      },
      { id: 'qe-sintonia', name: 'Sintonia Elementale', level: 3, actionType: 'action', description: 'Puoi creare piccoli effetti sensoriali elementali: scintille, brezze, tremolii dell\'acqua o della terra.' }
    ]
  },
  {
    id: 'via-ombra', classId: 'monaco', name: 'Via dell\'Ombra',
    description: 'Monaci addestrati in un\'arte marziale segreta che intreccia tecniche ninja con la magia dell\'oscurità.',
    features: [
      { id: 'ombra-arti', name: 'Arti Ombrose', level: 3, actionType: 'action', description: 'Spendendo punti ki puoi lanciare Oscurità, Scurovisione, Silenzio o Passo Senza Tracce senza componenti materiali.' },
      { id: 'ombra-passo', name: 'Passo nell\'Ombra', level: 6, actionType: 'bonus', description: 'In penombra o oscurità puoi teletrasportarti come azione bonus tra due zone d\'ombra entro 18 metri, con vantaggio al primo attacco dopo il teletrasporto.' },
      { id: 'ombra-manto', name: 'Manto d\'Ombra', level: 11, actionType: 'none', description: 'Nella penombra o nell\'oscurità puoi diventare invisibile finché non attacchi, lanci un incantesimo o crei luce.' }
    ]
  },
  // ---------- PALADINO ----------
  {
    id: 'devozione', classId: 'paladino', name: 'Giuramento di Devozione',
    description: 'Il giuramento del cavaliere ideale: onestà, coraggio, compassione e onore contro le forze dell\'oscurità.',
    features: [
      { id: 'devozione-arma-sacra', name: 'Incanalare Divinità: Arma Sacra', level: 3, actionType: 'action', description: 'Per 1 minuto aggiungi il modificatore di Carisma ai tiri per colpire con un\'arma, che emana luce intensa.' },
      { id: 'devozione-scacciare', name: 'Incanalare Divinità: Scacciare i Profani', level: 3, actionType: 'action', description: 'Immondi e non morti entro 9 metri devono superare un TS su Saggezza o fuggire da te.' },
      { id: 'devozione-aura', name: 'Aura di Devozione', level: 7, actionType: 'none', description: 'Tu e gli alleati entro 3 metri non potete essere affascinati.' }
    ]
  },
  {
    id: 'antichi', classId: 'paladino', name: 'Giuramento degli Antichi',
    description: 'Un giuramento antico quanto le foreste primordiali: proteggere la luce, la bellezza e la vita dalle tenebre che avanzano.',
    features: [
      { id: 'antichi-ira-natura', name: 'Incanalare Divinità: Ira della Natura', level: 3, actionType: 'action', description: 'Evochi radici spettrali che intrappolano le creature entro 3 metri (TS su Forza).' },
      { id: 'antichi-respingere', name: 'Incanalare Divinità: Respingere gli Infedeli', level: 3, actionType: 'action', description: 'Creature immonde o non morte entro 9 metri devono superare un TS su Saggezza o essere spaventate e messe in fuga.' },
      { id: 'antichi-aura', name: 'Aura di Protezione Arcana', level: 7, actionType: 'none', description: 'Tu e gli alleati entro 3 metri avete resistenza ai danni degli incantesimi lanciati dai nemici.' }
    ]
  },
  {
    id: 'vendetta', classId: 'paladino', name: 'Giuramento di Vendetta',
    description: 'Un giuramento solenne di punire chi ha commesso peccati imperdonabili: la giustizia prima della misericordia.',
    features: [
      { id: 'vendetta-abiura', name: 'Incanalare Divinità: Abiurare il Nemico', level: 3, actionType: 'action', description: 'Una creatura entro 18 m deve superare un TS su Saggezza o essere spaventata e bloccata sul posto.' },
      { id: 'vendetta-voto', name: 'Incanalare Divinità: Voto di Inimicizia', level: 3, actionType: 'bonus', description: 'Come azione bonus ottieni vantaggio ai tiri d\'attacco contro una creatura per 1 minuto.' },
      { id: 'vendetta-vendicatore', name: 'Vendicatore Implacabile', level: 7, actionType: 'reaction', description: 'Quando colpisci con un attacco di opportunità puoi muoverti di metà velocità senza provocare attacchi.' }
    ]
  },
  // ---------- RANGER ----------
  {
    id: 'cacciatore', classId: 'ranger', name: 'Cacciatore',
    description: 'L\'archetipo del predatore perfetto: il cacciatore accetta il ruolo di baluardo tra la civiltà e i terrori della natura selvaggia.',
    features: [
      { id: 'cacciatore-preda', name: 'Preda del Cacciatore', level: 3, actionType: 'none', description: 'Scegli: Uccisore di Colossi (+1d8 danni a creature ferite), Ammazzagiganti o Distruttore di Orde (attacco extra a creatura adiacente).' },
      { id: 'cacciatore-difesa', name: 'Tattiche Difensive', level: 7, actionType: 'none', description: 'Scegli: Sfuggire all\'Orda, Difesa da Attacchi Multipli o Volontà d\'Acciaio.' },
      { id: 'cacciatore-multiattacco', name: 'Multiattacco', level: 11, actionType: 'none', description: 'Scegli Raffica (attacco a ogni creatura entro 3 m di un punto) o Turbine (attacco a ogni creatura adiacente).' }
    ]
  },
  {
    id: 'signore-bestie', classId: 'ranger', name: 'Signore delle Bestie',
    description: 'Un ranger che stringe un legame mistico con una bestia, compagna fedele in battaglia e nell\'esplorazione.',
    features: [
      { id: 'sb-compagno', name: 'Compagno del Ranger', level: 3, actionType: 'none', description: 'Ottieni un compagno animale (GS 1/4 o inferiore) che obbedisce ai tuoi comandi e agisce nel tuo turno.' },
      { id: 'sb-addestramento', name: 'Addestramento Eccezionale', level: 7, actionType: 'bonus', description: 'Come azione bonus il tuo compagno può Scattare, Disimpegnarsi o Aiutare; i suoi attacchi contano come magici.' }
    ]
  },
  // ---------- LADRO ----------
  {
    id: 'furfante', classId: 'ladro', name: 'Furfante',
    description: 'Il ladro per eccellenza: borseggiatore, scassinatore e acrobata dalle mani fatate.',
    features: [
      {
        id: 'furfante-mani-veloci', name: 'Mani Veloci', level: 3, actionType: 'bonus',
        description: 'Puoi usare l\'azione bonus di Azione Scaltra per prove di Rapidità di Mano, scasso, disattivare trappole o usare oggetti.'
      },
      { id: 'furfante-lavoro-secondo-piano', name: 'Lavoro al Secondo Piano', level: 3, actionType: 'none', description: 'Scalare non ti costa movimento extra e i salti con rincorsa coprono distanza maggiore.' },
      { id: 'furfante-furto-supremo', name: 'Furto Supremo', level: 9, actionType: 'none', description: 'Hai vantaggio alle prove di Furtività e Rapidità di Mano se ti muovi di non più di metà velocità.' }
    ]
  },
  {
    id: 'assassino', classId: 'ladro', name: 'Assassino',
    description: 'Un ladro che ha elevato l\'omicidio a forma d\'arte: colpisce nell\'ombra e scompare prima che l\'allarme sia dato.',
    features: [
      { id: 'assassino-competenze', name: 'Competenze Bonus', level: 3, actionType: 'none', description: 'Ottieni competenza con il kit del travestitore e il kit da avvelenatore.' },
      { id: 'assassino-assassinio', name: 'Assassinio', level: 3, actionType: 'none', description: 'Hai vantaggio ai tiri d\'attacco contro ogni creatura che non ha ancora agito. Ogni colpo a segno contro un bersaglio sorpreso è un critico automatico.' },
      { id: 'assassino-infiltrazione', name: 'Abilità d\'Infiltrazione', level: 9, actionType: 'none', description: 'Puoi creare false identità documentate e travestimenti quasi perfetti, con l\'aiuto di 25 mo e una settimana di lavoro.' }
    ]
  },
  {
    id: 'mistificatore-arcano', classId: 'ladro', name: 'Mistificatore Arcano',
    description: 'Un ladro che arricchisce la propria arte con illusioni e ammaliamenti rubati ai maghi.',
    spellcasting: { ability: 'INT', progression: 'third', prepares: false, hasCantrips: true },
    features: [
      { id: 'ma-incantesimi', name: 'Uso degli Incantesimi', level: 3, actionType: 'none', description: 'Apprendi trucchetti e incantesimi da mago (soprattutto illusione e ammaliamento), incluso Mano Magica, con progressione a un terzo.' },
      { id: 'ma-mano-magica', name: 'Mano del Prestigiatore', level: 3, actionType: 'none', description: 'La tua Mano Magica è invisibile e può borseggiare, scassinare e disattivare trappole a distanza.' },
      { id: 'ma-imboscata', name: 'Imboscata Magica', level: 9, actionType: 'none', description: 'Se sei nascosto quando lanci un incantesimo, il bersaglio ha svantaggio al TS in quel turno.' }
    ]
  },
  // ---------- STREGONE ----------
  {
    id: 'discendenza-draconica', classId: 'stregone', name: 'Discendenza Draconica',
    description: 'La magia innata che deriva dal sangue di drago che scorre nelle tue vene.',
    features: [
      { id: 'dd-antenato', name: 'Antenato Draconico', level: 1, actionType: 'none', description: 'Scegli un tipo di drago: parli il Draconico e raddoppi il bonus di competenza nelle prove di Carisma con i draghi.' },
      { id: 'dd-resilienza', name: 'Resilienza Draconica', level: 1, actionType: 'none', description: 'Il tuo massimo dei pf aumenta di 1 per livello; senza armatura la tua CA è 13 + modificatore di Destrezza.' },
      { id: 'dd-affinita', name: 'Affinità Elementale', level: 6, actionType: 'none', description: 'Aggiungi il modificatore di Carisma ai danni degli incantesimi del tipo del tuo antenato; puoi spendere 1 punto stregoneria per ottenerne resistenza.' }
    ]
  },
  {
    id: 'magia-selvaggia', classId: 'stregone', name: 'Magia Selvaggia',
    description: 'Il caos primordiale scorre in te: la tua magia è potente ma imprevedibile.',
    features: [
      { id: 'ms-impulso', name: 'Impulso di Magia Selvaggia', level: 1, actionType: 'none', description: 'Lanciando un incantesimo di 1° livello o superiore, il DM può farti tirare sulla tabella della Magia Selvaggia.' },
      { id: 'ms-marea', name: 'Maree del Caos', level: 1, actionType: 'none', description: 'Ottieni vantaggio a un tiro d\'attacco, prova o TS. Una volta per riposo lungo (o quando il caos si manifesta).' },
      { id: 'ms-piegare', name: 'Piegare la Fortuna', level: 6, actionType: 'reaction', description: 'Con la reazione spendi 2 punti stregoneria per sommare o sottrarre 1d4 al tiro d20 di una creatura che puoi vedere.' }
    ]
  },
  // ---------- WARLOCK ----------
  {
    id: 'signore-fatato', classId: 'warlock', name: 'Il Signore Fatato',
    description: 'Il tuo patrono è un signore o una signora delle fate, creatura di leggenda dai fini imperscrutabili.',
    features: [
      { id: 'sf-presenza', name: 'Presenza Fatata', level: 1, actionType: 'action', description: 'Come azione, le creature in un cubo di 3 m devono superare un TS su Saggezza o essere affascinate o spaventate fino alla fine del tuo prossimo turno.' },
      { id: 'sf-fuga', name: 'Fuga Nebbiosa', level: 6, actionType: 'reaction', description: 'Quando subisci danni puoi usare la reazione per diventare invisibile e teletrasportarti fino a 18 metri.' },
      { id: 'sf-difese', name: 'Difese Ammalianti', level: 10, actionType: 'none', description: 'Non puoi essere affascinato; chi ci prova subisce il proprio incantesimo riflesso.' }
    ]
  },
  {
    id: 'immondo', classId: 'warlock', name: 'L\'Immondo',
    description: 'Hai stretto un patto con un potente immondo degli Inferi: potere in cambio di un prezzo che scoprirai troppo tardi.',
    features: [
      { id: 'immondo-benedizione', name: 'Benedizione dell\'Oscuro', level: 1, actionType: 'none', description: 'Quando riduci una creatura ostile a 0 pf, ottieni punti ferita temporanei pari a mod. Carisma + livello da warlock.' },
      { id: 'immondo-fortuna', name: 'Fortuna dell\'Oscuro', level: 6, actionType: 'none', description: 'Puoi aggiungere 1d10 a una prova o TS. Una volta per riposo.' },
      { id: 'immondo-resilienza', name: 'Resilienza Immonda', level: 10, actionType: 'none', description: 'Scegli un tipo di danno alla fine di ogni riposo: ne ottieni resistenza.' }
    ]
  },
  {
    id: 'vecchio-immondo', classId: 'warlock', name: 'Il Grande Antico',
    description: 'Il tuo patrono è un\'entità aliena da un altro tempo e un altro spazio, i cui pensieri sfuggono alla comprensione mortale.',
    features: [
      { id: 'vi-mente-risvegliata', name: 'Mente Risvegliata', level: 1, actionType: 'none', description: 'Puoi comunicare telepaticamente con qualsiasi creatura entro 9 metri che comprenda un linguaggio.' },
      { id: 'vi-baluardo', name: 'Baluardo Entropico', level: 6, actionType: 'reaction', description: 'Con la reazione imponi svantaggio a un attacco contro di te; se manca, ottieni vantaggio al tuo prossimo attacco.' },
      { id: 'vi-schermo', name: 'Schermo del Pensiero', level: 10, actionType: 'none', description: 'Hai resistenza ai danni psichici e chi legge la tua mente subisce danni psichici pari al tuo livello da warlock.' }
    ]
  },
  // ---------- MAGO ----------
  {
    id: 'invocatore', classId: 'mago', name: 'Scuola di Invocazione',
    description: 'La scuola che plasma le energie elementali: fuoco, fulmine, gelo e tuono al comando del mago.',
    features: [
      { id: 'invocatore-esperto', name: 'Esperto di Invocazione', level: 2, actionType: 'none', description: 'Tempo e denaro per copiare incantesimi di invocazione nel tuo libro sono dimezzati.' },
      { id: 'invocatore-scolpire', name: 'Scolpire Incantesimi', level: 2, actionType: 'none', description: 'Puoi proteggere 1 + livello dell\'incantesimo creature dagli effetti ad area dei tuoi incantesimi di invocazione.' },
      { id: 'invocatore-potente', name: 'Trucchetto Potenziato', level: 6, actionType: 'none', description: 'I tuoi trucchetti danneggiano anche i bersagli che superano il tiro salvezza (metà danni).' },
      { id: 'invocatore-sovraccarico', name: 'Sovraccarico', level: 14, actionType: 'none', description: 'Aggiungi il modificatore di Intelligenza ai danni di qualsiasi incantesimo di invocazione da mago.' }
    ]
  },
  {
    id: 'abiuratore', classId: 'mago', name: 'Scuola di Abiurazione',
    description: 'La scuola della protezione e dell\'annullamento: scudi arcani, interdizioni e dissoluzioni.',
    features: [
      { id: 'abiuratore-esperto', name: 'Esperto di Abiurazione', level: 2, actionType: 'none', description: 'Tempo e denaro per copiare incantesimi di abiurazione nel tuo libro sono dimezzati.' },
      { id: 'abiuratore-interdizione', name: 'Interdizione Arcana', level: 2, actionType: 'none', description: 'Lanciando un incantesimo di abiurazione crei una barriera di pf temporanei che ti protegge.' },
      { id: 'abiuratore-resistenza', name: 'Resistenza agli Incantesimi', level: 14, actionType: 'none', description: 'Hai vantaggio ai TS contro gli incantesimi e resistenza ai loro danni.' }
    ]
  },
  {
    id: 'congiuratore', classId: 'mago', name: 'Scuola di Congiurazione',
    description: 'Maghi che piegano lo spazio stesso, evocando creature e oggetti o teletrasportandosi in un istante.',
    features: [
      { id: 'congiuratore-minore', name: 'Congiurazione Minore', level: 2, actionType: 'action', description: 'Come azione conjuri un oggetto non magico nella tua mano o a terra entro 3 metri, che svanisce dopo 1 ora.' },
      { id: 'congiuratore-trasposizione', name: 'Trasposizione Benigna', level: 6, actionType: 'action', description: 'Ti teletrasporti fino a 9 metri, oppure scambi posto con una creatura consenziente. Una volta per riposo (o con uno slot).' },
      { id: 'congiuratore-focalizzata', name: 'Congiurazione Focalizzata', level: 10, actionType: 'none', description: 'Non puoi perdere la concentrazione su un incantesimo di congiurazione a causa dei danni subiti.' },
      { id: 'congiuratore-evocazioni', name: 'Evocazioni Durature', level: 14, actionType: 'none', description: 'Le creature che evochi con incantesimi di congiurazione ottengono 2 punti ferita temporanei per dado vita.' }
    ]
  },
  {
    id: 'divinatore', classId: 'mago', name: 'Scuola di Divinazione',
    description: 'Maghi veggenti che scrutano il velo del destino, prevedendo il futuro per piegarlo a proprio vantaggio.',
    features: [
      { id: 'divinatore-portento', name: 'Portento', level: 2, actionType: 'none', description: 'All\'inizio di ogni giornata tiri 2d20 e annoti i risultati: puoi sostituirli a qualsiasi tiro d\'attacco, prova o TS.' },
      { id: 'divinatore-esperto', name: 'Divinazione Esperta', level: 6, actionType: 'none', description: 'Lanciando un incantesimo di divinazione di 2° livello o superiore, recuperi uno slot di livello inferiore.' },
      { id: 'divinatore-terzo-occhio', name: 'Il Terzo Occhio', level: 10, actionType: 'action', description: 'Come azione ottieni scurovisione, vista magica, lettura di lingue sconosciute o percezione dell\'invisibile fino a 1 minuto.' },
      { id: 'divinatore-portento-magg', name: 'Portento Superiore', level: 14, actionType: 'none', description: 'Tiri tre dadi invece di due per il Portento.' }
    ]
  },
  {
    id: 'incantatore', classId: 'mago', name: 'Scuola di Ammaliamento',
    description: 'Maghi che dominano le menti altrui, tessendo incantesimi capaci di piegare la volontà di chiunque.',
    features: [
      { id: 'incantatore-sguardo', name: 'Sguardo Ipnotico', level: 2, actionType: 'action', description: 'Come azione incanti una creatura entro 1,5 metri: resta incapacitata e con velocità 0 finché non ti muovi o attacchi.' },
      { id: 'incantatore-fascino', name: 'Fascino Istintivo', level: 6, actionType: 'reaction', description: 'Con la reazione ridirigi verso un\'altra creatura a tua scelta un attacco che ti avrebbe colpito.' },
      { id: 'incantatore-doppio', name: 'Ammaliamento Duplice', level: 10, actionType: 'none', description: 'Lanciando un incantesimo di ammaliamento a bersaglio singolo, puoi colpire un secondo bersaglio con uno slot dello stesso livello.' },
      { id: 'incantatore-alterare', name: 'Alterare Ricordi', level: 14, actionType: 'none', description: 'Dopo aver affascinato una creatura puoi cancellarne i ricordi del periodo in cui era affascinata.' }
    ]
  },
  {
    id: 'illusionista', classId: 'mago', name: 'Scuola di Illusione',
    description: 'Maghi che tessono realtà fittizie indistinguibili dal vero, ingannando i sensi di amici e nemici.',
    features: [
      { id: 'illusionista-minore', name: 'Illusione Minore Migliorata', level: 2, actionType: 'none', description: 'Il trucchetto Illusione Minore crea contemporaneamente un suono e un\'immagine.' },
      { id: 'illusionista-malleabili', name: 'Illusioni Malleabili', level: 6, actionType: 'action', description: 'Come azione modifichi la natura di un\'illusione che hai creato, finché dura.' },
      { id: 'illusionista-io', name: 'Io Illusorio', level: 10, actionType: 'reaction', description: 'Con la reazione, quando vieni colpito, crei l\'illusione di essere altrove ed eviti i danni.' },
      { id: 'illusionista-realta', name: 'Realtà Illusoria', level: 14, actionType: 'none', description: 'Un oggetto all\'interno di un\'illusione che crei diventa reale per un breve periodo.' }
    ]
  },
  {
    id: 'necromante', classId: 'mago', name: 'Scuola di Necromanzia',
    description: 'Maghi che scrutano il confine tra vita e morte, comandando i non morti e traendo forza dal decadimento.',
    features: [
      { id: 'necromante-raccolto', name: 'Raccolto Funesto', level: 2, actionType: 'none', description: 'Quando un incantesimo di necromanzia uccide una creatura, recuperi punti ferita pari al livello dell\'incantesimo.' },
      { id: 'necromante-schiavi', name: 'Servitori Non Morti', level: 6, actionType: 'none', description: 'Rianimare i Morti crea non morti più potenti, con più punti ferita e danni extra.' },
      { id: 'necromante-inured', name: 'Assuefatto alla Non Morte', level: 10, actionType: 'none', description: 'Hai resistenza ai danni necrotici e il tuo massimo dei pf non può essere ridotto.' },
      { id: 'necromante-comandare', name: 'Comandare i Non Morti', level: 14, actionType: 'action', description: 'Come azione prendi il controllo di un non morto entro 18 metri (TS su Carisma per resistere).' }
    ]
  },
  {
    id: 'trasmutatore', classId: 'mago', name: 'Scuola di Trasmutazione',
    description: 'Maghi che alterano la sostanza stessa della realtà, trasformando materia, forma e persino se stessi.',
    features: [
      { id: 'trasmutatore-alchimia', name: 'Alchimia Minore', level: 2, actionType: 'none', description: 'Trasformi un materiale in un altro per un breve periodo: legno in ferro, vetro in ghiaccio e simili.' },
      { id: 'trasmutatore-pietra', name: 'Pietra del Trasmutatore', level: 6, actionType: 'none', description: 'Crei una pietra che dona un beneficio a scelta: scurovisione, velocità, resistenza a un tipo di danno o competenza nei TS.' },
      { id: 'trasmutatore-mutaforma', name: 'Mutaforma', level: 10, actionType: 'action', description: 'Puoi lanciare Polimorfia su te stesso senza spendere uno slot incantesimo, una volta per riposo breve o lungo.' },
      { id: 'trasmutatore-maestro', name: 'Maestro Trasmutatore', level: 14, actionType: 'action', description: 'Consumi la Pietra del Trasmutatore per un potente effetto: cura totale, neutralizza veleni e malattie, o mutaforma illimitata per 8 ore.' }
    ]
  }
];
