export type Universe = 'BD/Mangas' | 'Jeunesse' | 'Littérature' | 'Adulte-pratique'
export type BookType = 'nouveaute' | 'a-paraitre' | 'fonds'

export interface Book {
  id: string
  isbn: string
  title: string
  authors: string[]
  publisher: string
  collection?: string
  universe: Universe
  type: BookType
  price: number        // prix HT libraire
  priceTTC: number     // prix public TTC
  format: string
  pages?: number
  publicationDate: string   // YYYY-MM-DD
  description: string
  programme?: string        // uniquement pour "à paraître" : ex. "Avril–Juin 2026"
  coverUrl: string
}

const OL = (isbn: string) => `https://covers.openlibrary.org/b/isbn/${isbn}-M.jpg`

export const MOCK_BOOKS: Book[] = [
  /* ─────────────────────────────
     NOUVEAUTÉS DU MOIS — Littérature
  ───────────────────────────────── */
  {
    id: 'n-lit-01',
    isbn: '9782072970931',
    title: 'Le Nom secret des choses',
    authors: ['Laure Manel'],
    publisher: 'Gallimard',
    collection: 'Blanche',
    universe: 'Littérature',
    type: 'nouveaute',
    price: 14.10,
    priceTTC: 21.00,
    format: 'Grand format',
    pages: 320,
    publicationDate: '2026-03-06',
    description: 'Un roman sur la mémoire et les secrets de famille dans la France contemporaine.',
    coverUrl: OL('9782072970931'),
  },
  {
    id: 'n-lit-02',
    isbn: '9782221267813',
    title: 'La Traversée des nuits',
    authors: ['Éric Vuillard'],
    publisher: 'Robert Laffont',
    universe: 'Littérature',
    type: 'nouveaute',
    price: 13.40,
    priceTTC: 19.90,
    format: 'Grand format',
    pages: 240,
    publicationDate: '2026-03-13',
    description: 'Un récit historique haletant sur les grandes migrations du XXe siècle.',
    coverUrl: OL('9782221267813'),
  },
  {
    id: 'n-lit-03',
    isbn: '9782246826361',
    title: 'Après l\'hiver',
    authors: ['Marie-Hélène Lafon'],
    publisher: 'Buchet-Chastel',
    universe: 'Littérature',
    type: 'nouveaute',
    price: 11.70,
    priceTTC: 17.50,
    format: 'Grand format',
    pages: 192,
    publicationDate: '2026-03-20',
    description: 'Un roman sobre et puissant sur la vie rurale dans le Cantal.',
    coverUrl: OL('9782246826361'),
  },
  /* ─────────────────────────────
     NOUVEAUTÉS DU MOIS — BD/Mangas
  ───────────────────────────────── */
  {
    id: 'n-bd-01',
    isbn: '9782505124368',
    title: 'Kaguya-sama : Love is War T.29',
    authors: ['Aka Akasaka'],
    publisher: 'Pika Édition',
    collection: 'Shōnen',
    universe: 'BD/Mangas',
    type: 'nouveaute',
    price: 5.95,
    priceTTC: 7.99,
    format: 'Manga',
    pages: 192,
    publicationDate: '2026-03-05',
    description: 'Le choc psychologique entre Kaguya et Miyuki atteint son paroxysme.',
    coverUrl: OL('9782505124368'),
  },
  {
    id: 'n-bd-02',
    isbn: '9782344063132',
    title: 'Glénat Manga Collection 2026',
    authors: ['Collectif'],
    publisher: 'Glénat',
    universe: 'BD/Mangas',
    type: 'nouveaute',
    price: 9.20,
    priceTTC: 13.50,
    format: 'Album',
    pages: 56,
    publicationDate: '2026-03-12',
    description: 'La sélection printanière des plus belles séries manga de Glénat.',
    coverUrl: OL('9782344063132'),
  },
  {
    id: 'n-bd-03',
    isbn: '9782800178929',
    title: 'Blake et Mortimer : L\'Onde Septimus',
    authors: ['Jean Dufaux', 'Antoine Aubin'],
    publisher: 'Dargaud',
    collection: 'Blake et Mortimer',
    universe: 'BD/Mangas',
    type: 'nouveaute',
    price: 10.00,
    priceTTC: 14.99,
    format: 'Album',
    pages: 64,
    publicationDate: '2026-03-19',
    description: 'Un nouveau mystère attend nos héros dans cette aventure haletante.',
    coverUrl: OL('9782800178929'),
  },
  /* ─────────────────────────────
     NOUVEAUTÉS DU MOIS — Jeunesse
  ───────────────────────────────── */
  {
    id: 'n-jes-01',
    isbn: '9782075201742',
    title: 'Le Grand Voyage de Léa',
    authors: ['Alice Brière-Haquet'],
    publisher: 'Gallimard Jeunesse',
    universe: 'Jeunesse',
    type: 'nouveaute',
    price: 8.60,
    priceTTC: 12.90,
    format: 'Album illustré',
    pages: 48,
    publicationDate: '2026-03-06',
    description: 'Un album magnifiquement illustré sur le courage et l\'amitié.',
    coverUrl: OL('9782075201742'),
  },
  {
    id: 'n-jes-02',
    isbn: '9782747097802',
    title: 'Les Chroniques de la Forêt T.4',
    authors: ['Romain Sardou'],
    publisher: 'Bayard Jeunesse',
    collection: 'Aventure',
    universe: 'Jeunesse',
    type: 'nouveaute',
    price: 9.30,
    priceTTC: 13.90,
    format: 'Roman jeunesse',
    pages: 256,
    publicationDate: '2026-03-13',
    description: 'Le quatrième tome de la saga forestière tant attendue par les jeunes lecteurs.',
    coverUrl: OL('9782747097802'),
  },
  /* ─────────────────────────────
     NOUVEAUTÉS DU MOIS — Adulte-pratique
  ───────────────────────────────── */
  {
    id: 'n-pra-01',
    isbn: '9782410025309',
    title: 'Cuisine du monde en 200 recettes',
    authors: ['Stéphane Reynaud'],
    publisher: 'Belin',
    universe: 'Adulte-pratique',
    type: 'nouveaute',
    price: 19.90,
    priceTTC: 29.90,
    format: 'Grand format',
    pages: 384,
    publicationDate: '2026-03-05',
    description: 'Un tour du monde gastronomique avec des recettes accessibles et généreuses.',
    coverUrl: OL('9782410025309'),
  },
  {
    id: 'n-pra-02',
    isbn: '9782035987624',
    title: 'Mon jardin en permaculture',
    authors: ['Bernard Alonso', 'Nathalie Tordjman'],
    publisher: 'Larousse',
    universe: 'Adulte-pratique',
    type: 'nouveaute',
    price: 15.90,
    priceTTC: 23.90,
    format: 'Grand format',
    pages: 272,
    publicationDate: '2026-03-19',
    description: 'Toutes les clés pour créer un jardin durable et productif.',
    coverUrl: OL('9782035987624'),
  },
  /* ─────────────────────────────
     À PARAÎTRE — toutes catégories
  ───────────────────────────────── */
  {
    id: 'ap-lit-01',
    isbn: '9782072989012',
    title: 'Les Enfants du silence',
    authors: ['Leïla Slimani'],
    publisher: 'Gallimard',
    collection: 'Blanche',
    universe: 'Littérature',
    type: 'a-paraitre',
    price: 14.60,
    priceTTC: 21.90,
    format: 'Grand format',
    pages: 304,
    publicationDate: '2026-05-07',
    description: 'Le nouveau roman très attendu de Leïla Slimani.',
    programme: 'Avril–Juin 2026',
    coverUrl: OL('9782072989012'),
  },
  {
    id: 'ap-bd-01',
    isbn: '9782205207682',
    title: 'Astérix et la Déesse de la Rome T.42',
    authors: ['Fabcaro', 'Didier Conrad'],
    publisher: 'Albert René',
    collection: 'Astérix',
    universe: 'BD/Mangas',
    type: 'a-paraitre',
    price: 7.30,
    priceTTC: 10.95,
    format: 'Album',
    pages: 48,
    publicationDate: '2026-06-25',
    description: 'Nos héros gaulois s\'aventurent dans les arcanes de la mythologie romaine.',
    programme: 'Avril–Juin 2026',
    coverUrl: OL('9782205207682'),
  },
  {
    id: 'ap-jes-01',
    isbn: '9782070643066',
    title: 'Lune de neige',
    authors: ['Timothée de Fombelle'],
    publisher: 'Gallimard Jeunesse',
    universe: 'Jeunesse',
    type: 'a-paraitre',
    price: 10.60,
    priceTTC: 15.90,
    format: 'Roman jeunesse',
    pages: 336,
    publicationDate: '2026-08-20',
    description: 'Une aventure poétique au cœur des grands espaces nordiques.',
    programme: 'Juillet–Septembre 2026',
    coverUrl: OL('9782070643066'),
  },
  {
    id: 'ap-pra-01',
    isbn: '9782263184826',
    title: 'Yoga & Pleine conscience',
    authors: ['Céline Chadelat'],
    publisher: 'Solar',
    universe: 'Adulte-pratique',
    type: 'a-paraitre',
    price: 17.90,
    priceTTC: 26.90,
    format: 'Grand format',
    pages: 224,
    publicationDate: '2026-09-10',
    description: 'Un guide complet pour allier pratique du yoga et méditation au quotidien.',
    programme: 'Juillet–Septembre 2026',
    coverUrl: OL('9782263184826'),
  },
  /* ─────────────────────────────
     FONDS — Littérature
  ───────────────────────────────── */
  {
    id: 'f-lit-01',
    isbn: '9782070360024',
    title: 'L\'Étranger',
    authors: ['Albert Camus'],
    publisher: 'Gallimard',
    collection: 'Folio',
    universe: 'Littérature',
    type: 'fonds',
    price: 4.90,
    priceTTC: 7.30,
    format: 'Poche',
    pages: 192,
    publicationDate: '1942-01-01',
    description: 'Roman fondateur de l\'absurde, chef-d\'œuvre de la littérature française du XXe siècle.',
    coverUrl: OL('9782070360024'),
  },
  {
    id: 'f-lit-02',
    isbn: '9782070408504',
    title: 'Le Petit Prince',
    authors: ['Antoine de Saint-Exupéry'],
    publisher: 'Gallimard',
    collection: 'Folio Junior',
    universe: 'Littérature',
    type: 'fonds',
    price: 5.20,
    priceTTC: 7.80,
    format: 'Poche',
    pages: 128,
    publicationDate: '1943-01-01',
    description: 'Le livre le plus traduit au monde après la Bible. Un conte philosophique intemporel.',
    coverUrl: OL('9782070408504'),
  },
  {
    id: 'f-lit-03',
    isbn: '9782253004226',
    title: 'Notre-Dame de Paris',
    authors: ['Victor Hugo'],
    publisher: 'Livre de Poche',
    collection: 'Classiques',
    universe: 'Littérature',
    type: 'fonds',
    price: 5.90,
    priceTTC: 8.80,
    format: 'Poche',
    pages: 736,
    publicationDate: '1831-01-01',
    description: 'Le roman historique le plus célèbre de Victor Hugo, autour de la cathédrale de Paris.',
    coverUrl: OL('9782253004226'),
  },
  /* ─────────────────────────────
     FONDS — BD/Mangas
  ───────────────────────────────── */
  {
    id: 'f-bd-01',
    isbn: '9782203001046',
    title: 'Tintin au Tibet',
    authors: ['Hergé'],
    publisher: 'Casterman',
    collection: 'Les Aventures de Tintin',
    universe: 'BD/Mangas',
    type: 'fonds',
    price: 8.70,
    priceTTC: 12.99,
    format: 'Album',
    pages: 64,
    publicationDate: '1960-01-01',
    description: 'L\'album le plus personnel d\'Hergé, une ode à l\'amitié dans les sommets himalayens.',
    coverUrl: OL('9782203001046'),
  },
  {
    id: 'f-bd-02',
    isbn: '9782012101517',
    title: 'Astérix chez les Bretons',
    authors: ['René Goscinny', 'Albert Uderzo'],
    publisher: 'Albert René',
    collection: 'Astérix',
    universe: 'BD/Mangas',
    type: 'fonds',
    price: 7.30,
    priceTTC: 10.95,
    format: 'Album',
    pages: 48,
    publicationDate: '1966-01-01',
    description: 'Astérix traverse la Manche pour prêter main-forte à ses cousins les Bretons.',
    coverUrl: OL('9782012101517'),
  },
  /* ─────────────────────────────
     FONDS — Jeunesse
  ───────────────────────────────── */
  {
    id: 'f-jes-01',
    isbn: '9782070584628',
    title: 'Harry Potter à l\'école des sorciers',
    authors: ['J.K. Rowling'],
    publisher: 'Gallimard Jeunesse',
    collection: 'Folio Junior',
    universe: 'Jeunesse',
    type: 'fonds',
    price: 7.50,
    priceTTC: 11.20,
    format: 'Poche',
    pages: 320,
    publicationDate: '1998-10-01',
    description: 'Le début de l\'aventure magique de Harry Potter — un incontournable de la librairie.',
    coverUrl: OL('9782070584628'),
  },
  {
    id: 'f-jes-02',
    isbn: '9782070625734',
    title: 'Le Lion, la Sorcière Blanche et l\'Armoire Magique',
    authors: ['C.S. Lewis'],
    publisher: 'Gallimard Jeunesse',
    collection: 'Folio Junior',
    universe: 'Jeunesse',
    type: 'fonds',
    price: 5.90,
    priceTTC: 8.80,
    format: 'Poche',
    pages: 224,
    publicationDate: '1950-01-01',
    description: 'Le premier volume des Chroniques de Narnia, un classique de la fantasy jeunesse.',
    coverUrl: OL('9782070625734'),
  },
  /* ─────────────────────────────
     FONDS — Adulte-pratique
  ───────────────────────────────── */
  {
    id: 'f-pra-01',
    isbn: '9782011355737',
    title: 'Le Grand Larousse de la cuisine',
    authors: ['Collectif Larousse'],
    publisher: 'Larousse',
    universe: 'Adulte-pratique',
    type: 'fonds',
    price: 26.60,
    priceTTC: 39.95,
    format: 'Grand format',
    pages: 896,
    publicationDate: '2020-09-01',
    description: 'La référence culinaire absolue avec plus de 1 200 recettes de la gastronomie française.',
    coverUrl: OL('9782011355737'),
  },
  {
    id: 'f-pra-02',
    isbn: '9782019468422',
    title: 'Méthode Pilates complète',
    authors: ['Alice Pariaud'],
    publisher: 'Hachette Pratique',
    universe: 'Adulte-pratique',
    type: 'fonds',
    price: 13.20,
    priceTTC: 19.90,
    format: 'Grand format',
    pages: 192,
    publicationDate: '2021-03-01',
    description: 'Programme complet pour pratiquer le Pilates chez soi, pour tous les niveaux.',
    coverUrl: OL('9782019468422'),
  },
]

/* ─── Helpers ─── */
export const UNIVERSES: Universe[] = ['BD/Mangas', 'Jeunesse', 'Littérature', 'Adulte-pratique']

export function getBookById(id: string): Book | undefined {
  return MOCK_BOOKS.find(b => b.id === id)
}

export function getBooksByType(type: BookType, universe?: Universe): Book[] {
  return MOCK_BOOKS.filter(b =>
    b.type === type && (universe ? b.universe === universe : true)
  )
}

export function searchBooks(query: string): Book[] {
  const q = query.toLowerCase().trim()
  if (!q) return []
  return MOCK_BOOKS.filter(b =>
    b.title.toLowerCase().includes(q) ||
    b.authors.some(a => a.toLowerCase().includes(q)) ||
    b.publisher.toLowerCase().includes(q) ||
    b.isbn.includes(q) ||
    (b.collection?.toLowerCase().includes(q) ?? false)
  )
}
