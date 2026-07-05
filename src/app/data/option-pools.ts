import { OptionPool } from '../core/models/content.model';

// ============================================================
// Pool generici di sotto-opzioni selezionabili
// ============================================================
export const OPTION_POOLS: OptionPool[] = [
  {
    id: 'manovre', name: 'Manovre',
    description: 'Tecniche di combattimento del Maestro di Battaglia, alimentate dai dadi superiorità.',
    options: [
      { id: 'attacco-preciso', name: 'Attacco Preciso', description: 'Aggiungi un dado superiorità a un tiro d\'attacco, prima o dopo il tiro.' },
      { id: 'risposta', name: 'Risposta', description: 'Quando una creatura ti manca con un attacco in mischia, usa la reazione per attaccarla aggiungendo il dado superiorità ai danni.' },
      { id: 'spingere', name: 'Spingere', description: 'Aggiungi il dado superiorità ai danni; se il bersaglio è Grande o inferiore, deve superare un TS su Forza o essere spinto di 4,5 m.' },
      { id: 'disarmare', name: 'Attacco Disarmante', description: 'Aggiungi il dado superiorità ai danni; il bersaglio deve superare un TS su Forza o lasciar cadere un oggetto.' },
      { id: 'finta', name: 'Attacco con Finta', description: 'Usa un\'azione bonus per fintare: ottieni vantaggio al prossimo attacco e aggiungi il dado superiorità ai danni.' },
      { id: 'attacco-minaccioso', name: 'Attacco Minaccioso', description: 'Aggiungi il dado superiorità ai danni; il bersaglio deve superare un TS su Saggezza o essere spaventato.' },
      { id: 'sbilanciare', name: 'Attacco Sbilanciante', description: 'Aggiungi il dado superiorità ai danni; il bersaglio deve superare un TS su Forza o cadere a terra prono.' },
      { id: 'colpo-comandante', name: 'Colpo del Comandante', description: 'Rinuncia a un attacco per permettere a un alleato di attaccare con la sua reazione, aggiungendo il dado superiorità ai danni.' },
      { id: 'schivata-agile', name: 'Gioco di Gambe', description: 'Quando ti muovi, spendi un dado superiorità e sommalo alla CA contro un attacco di opportunità.' },
      { id: 'provocare', name: 'Attacco Provocatorio', description: 'Aggiungi il dado superiorità ai danni; il bersaglio ha svantaggio agli attacchi contro bersagli diversi da te.' }
    ]
  },
  {
    id: 'discipline-elementali', name: 'Discipline Elementali',
    description: 'Tecniche del monaco della Via dei Quattro Elementi che incanalano il ki negli elementi.',
    options: [
      { id: 'frusta-acqua', name: 'Frusta d\'Acqua', description: 'Spendi 2 punti ki: una frusta d\'acqua infligge 3d10 danni e può tirare il bersaglio verso di te o buttarlo prono.' },
      { id: 'pugno-fuoco', name: 'Pugno del Fuoco', description: 'Spendi 2 punti ki per lanciare Mani Brucianti.' },
      { id: 'cavalcare-vento', name: 'Cavalcare il Vento', description: 'Spendi 4 punti ki per lanciare Volare su te stesso.' },
      { id: 'stretta-tuono', name: 'Stretta del Tuono', description: 'Spendi 2 punti ki per lanciare Onda Tonante.' },
      { id: 'difesa-acqua', name: 'Difesa dell\'Acqua che Scorre', description: 'Spendi 2 punti ki per lanciare Armatura Magica su te stesso.' },
      { id: 'sfera-fuoco', name: 'Sfera del Fuoco Eterno', description: 'Spendi 5 punti ki per lanciare Sfera Infuocata.', prerequisite: { minLevel: 6 } },
      { id: 'cammino-vento', name: 'Passo del Vento', description: 'Spendi 2 punti ki per lanciare Passo Velato su te stesso.', prerequisite: { minLevel: 6 } },
      { id: 'onda-terremoto', name: 'Onda Sismica', description: 'Spendi 6 punti ki: le creature entro 3 m devono superare un TS su Destrezza o cadere prone.', prerequisite: { minLevel: 11 } }
    ]
  },
  {
    id: 'invocazioni-occulte', name: 'Invocazioni Occulte',
    description: 'Frammenti di sapere proibito che potenziano il warlock con capacità magiche permanenti.',
    options: [
      { id: 'lama-assetata', name: 'Lama Assetata', description: 'Puoi attaccare due volte con la tua arma del patto quando usi l\'azione di Attacco.', prerequisite: { minLevel: 5, note: 'Patto della Lama' } },
      { id: 'raggio-agonizzante', name: 'Raggio Agonizzante', description: 'Aggiungi il modificatore di Carisma ai danni di Deflagrazione Occulta.', prerequisite: { note: 'Trucchetto Deflagrazione Occulta' } },
      { id: 'armatura-ombre', name: 'Armatura delle Ombre', description: 'Puoi lanciare Armatura Magica su te stesso a volontà, senza spendere slot.' },
      { id: 'vista-diabolica', name: 'Vista Diabolica', description: 'Puoi vedere normalmente nell\'oscurità, sia magica sia non magica, fino a 36 metri.' },
      { id: 'sussurri-tomba', name: 'Sussurri della Tomba', description: 'Puoi lanciare Parlare con i Morti a volontà, senza spendere slot.', prerequisite: { minLevel: 9 } },
      { id: 'ladro-cinque-fati', name: 'Ladro dei Cinque Fati', description: 'Puoi lanciare Anatema una volta usando uno slot incantesimo da warlock per riposo lungo.' },
      { id: 'balzo-lontano', name: 'Balzo Oltremondano', description: 'Puoi lanciare Salto su te stesso a volontà.', prerequisite: { minLevel: 9 } },
      { id: 'maschera-volti', name: 'Maschera dai Mille Volti', description: 'Puoi lanciare Camuffare Se Stesso a volontà, senza spendere slot.' }
    ]
  },
  {
    id: 'metamagia', name: 'Opzioni di Metamagia',
    description: 'Lo stregone piega la trama della magia spendendo punti stregoneria.',
    options: [
      { id: 'incantesimo-accelerato', name: 'Incantesimo Accelerato', description: 'Spendi 2 punti stregoneria: un incantesimo con tempo di lancio 1 azione diventa 1 azione bonus.' },
      { id: 'incantesimo-attento', name: 'Incantesimo Attento', description: 'Spendi 1 punto stregoneria: proteggi un numero di creature pari al mod. di Carisma dagli effetti ad area del tuo incantesimo.' },
      { id: 'incantesimo-distante', name: 'Incantesimo Distante', description: 'Spendi 1 punto stregoneria: raddoppia la gittata di un incantesimo (o portala a 9 m se era contatto).' },
      { id: 'incantesimo-esteso', name: 'Incantesimo Esteso', description: 'Spendi 1 punto stregoneria: raddoppia la durata di un incantesimo (max 24 ore).' },
      { id: 'incantesimo-intensificato', name: 'Incantesimo Intensificato', description: 'Spendi 3 punti stregoneria: un bersaglio ha svantaggio al primo TS contro l\'incantesimo.' },
      { id: 'incantesimo-gemello', name: 'Incantesimo Gemello', description: 'Spendi punti stregoneria pari al livello dell\'incantesimo: bersaglia una seconda creatura.' }
    ]
  }
];
