import { Feat } from '../core/models/content.model';

export const FEATS: Feat[] = [
  {
    id: 'allerta', name: 'Allerta',
    description: 'Sempre vigile e pronto al pericolo, non ti fai cogliere di sorpresa.',
    benefits: [
      '+5 ai tiri di iniziativa.',
      'Non puoi essere sorpreso finché sei cosciente.',
      'Le creature nascoste non ottengono vantaggio ai tiri d\'attacco contro di te.'
    ]
  },
  {
    id: 'atleta', name: 'Atleta',
    description: 'Hai raggiunto un notevole livello di allenamento fisico.',
    benefits: [
      '+1 a Forza o Destrezza (massimo 20).',
      'Rialzarti da prono ti costa solo 1,5 metri di movimento.',
      'Scalare non dimezza la tua velocità; salti con rincorsa dopo soli 1,5 metri.'
    ]
  },
  {
    id: 'attaccante-selvaggio', name: 'Attaccante Selvaggio',
    description: 'I tuoi colpi puntano a fare più male possibile.',
    benefits: ['Una volta per turno, quando tiri i danni di un attacco con arma in mischia, puoi ritirare i dadi dei danni e usare il totale che preferisci.']
  },
  {
    id: 'duro-a-morire', name: 'Duro a Morire',
    description: 'Robusto e pieno di vitalità, ti riprendi in fretta dalle ferite.',
    benefits: [
      '+1 a Costituzione (massimo 20).',
      'Quando tiri un Dado Vita per recuperare pf, il minimo che puoi ottenere è il doppio del tuo modificatore di Costituzione.'
    ]
  },
  {
    id: 'esperto-balestre', name: 'Esperto di Balestre',
    description: 'Il lungo addestramento ti ha reso letale con le balestre.',
    benefits: [
      'Ignori la proprietà "ricarica" delle balestre con cui hai competenza.',
      'Nessuno svantaggio agli attacchi a distanza entro 1,5 metri da una creatura ostile.',
      'Quando attacchi con un\'arma a una mano, puoi attaccare con una balestra a mano come azione bonus.'
    ]
  },
  {
    id: 'fortunato', name: 'Fortunato',
    description: 'La fortuna sembra sorriderti nei momenti decisivi.',
    benefits: [
      'Hai 3 punti fortuna: puoi spenderne uno per tirare un d20 aggiuntivo a un tuo attacco, prova o TS, o quando vieni attaccato.',
      'Recuperi i punti fortuna con un riposo lungo.'
    ]
  },
  {
    id: 'grande-maestro-armi', name: 'Grande Maestro d\'Armi',
    description: 'Hai imparato a sfruttare il peso delle armi pesanti per colpi devastanti.',
    benefits: [
      'Quando metti a segno un critico o riduci una creatura a 0 pf con un\'arma in mischia, puoi attaccare di nuovo come azione bonus.',
      'Prima di attaccare con un\'arma pesante puoi accettare -5 al tiro per colpire in cambio di +10 ai danni.'
    ]
  },
  {
    id: 'incantatore-guerra', name: 'Incantatore da Guerra',
    description: 'Hai imparato a lanciare incantesimi nel cuore della mischia.',
    prerequisite: 'Capacità di lanciare almeno un incantesimo',
    benefits: [
      'Vantaggio ai TS su Costituzione per mantenere la concentrazione quando subisci danni.',
      'Puoi eseguire le componenti somatiche anche con armi o scudo in mano.',
      'Puoi lanciare un incantesimo (1 azione, un solo bersaglio) al posto dell\'attacco di opportunità.'
    ]
  },
  {
    id: 'maestro-armature-pesanti', name: 'Maestro delle Armature Pesanti',
    description: 'La tua armatura devia i colpi che ucciderebbero altri.',
    prerequisite: 'Competenza con le armature pesanti',
    benefits: [
      '+1 a Forza (massimo 20).',
      'Mentre indossi un\'armatura pesante, i danni contundenti, perforanti e taglienti non magici che subisci sono ridotti di 3.'
    ]
  },
  {
    id: 'maestro-armi-inastate', name: 'Maestro d\'Armi Inastate',
    description: 'Sai tenere i nemici a distanza con armi ad asta.',
    benefits: [
      'Quando attacchi con alabarda, falcione, picca o bastone puoi attaccare con l\'altra estremità come azione bonus (d4).',
      'Le creature provocano un attacco di opportunità quando entrano nella tua portata.'
    ]
  },
  {
    id: 'maestro-scudi', name: 'Maestro di Scudi',
    description: 'Usi lo scudo non solo per proteggerti, ma come arma tattica.',
    benefits: [
      'Se usi l\'azione di Attacco, puoi spingere una creatura entro 1,5 m con lo scudo come azione bonus.',
      'Aggiungi il bonus CA dello scudo ai TS su Destrezza contro effetti che bersagliano solo te.',
      'Con la reazione, se superi un TS su Destrezza per dimezzare un danno, puoi invece annullarlo.'
    ]
  },
  {
    id: 'mobile', name: 'Mobile',
    description: 'Sei eccezionalmente veloce e agile in battaglia.',
    benefits: [
      'La tua velocità aumenta di 3 metri.',
      'Quando usi l\'azione di Scatto, il terreno difficile non ti rallenta.',
      'Se attacchi una creatura in mischia, non provochi i suoi attacchi di opportunità per il resto del turno.'
    ]
  },
  {
    id: 'osservatore', name: 'Osservatore',
    description: 'Nulla sfugge al tuo sguardo attento.',
    benefits: [
      '+1 a Intelligenza o Saggezza (massimo 20).',
      'Puoi leggere le labbra di chi parla una lingua che conosci.',
      '+5 a Percezione passiva e Indagare passiva.'
    ]
  },
  {
    id: 'resiliente', name: 'Resiliente',
    description: 'Rafforzi corpo, mente o spirito contro le avversità.',
    benefits: [
      '+1 a una caratteristica a scelta (massimo 20).',
      'Ottieni competenza nei tiri salvezza di quella caratteristica.'
    ]
  },
  {
    id: 'robusto', name: 'Robusto',
    description: 'Il tuo fisico è straordinariamente resistente.',
    benefits: [
      'Il tuo massimo dei punti ferita aumenta di 2 per ogni tuo livello (attuale e futuro).'
    ]
  },
  {
    id: 'sentinella', name: 'Sentinella',
    description: 'Hai padroneggiato le tecniche per punire chi abbassa la guardia.',
    benefits: [
      'Quando colpisci con un attacco di opportunità, la velocità della creatura scende a 0 per il turno.',
      'Le creature provocano attacchi di opportunità anche se usano Disimpegno.',
      'Con la reazione puoi attaccare una creatura entro 1,5 m che attacca un bersaglio diverso da te.'
    ]
  },
  {
    id: 'tiratore-scelto', name: 'Tiratore Scelto',
    description: 'La tua mira con le armi a distanza è leggendaria.',
    benefits: [
      'Attaccare a lunga gittata non impone svantaggio.',
      'I tuoi attacchi a distanza ignorano la copertura parziale e i tre quarti.',
      'Prima di attaccare puoi accettare -5 al tiro per colpire in cambio di +10 ai danni.'
    ]
  }
];
