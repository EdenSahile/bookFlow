import bcrypt from 'bcryptjs'

// DEV ONLY — remplacé par Prisma/Supabase en Phase 12
const DEV_COST = 4

export interface MockUser {
  id: string
  codeClient: string
  nomLibrairie: string
  email: string
  passwordHash: string
  adresseLivraison: string
  remise: number // % de remise personnalisée
  telephone: string
}

function createMockUser(data: {
  codeClient: string
  nomLibrairie: string
  email: string
  password: string
  adresseLivraison: string
  remise: number
  telephone: string
}): MockUser {
  return {
    id: `mock-${data.codeClient.toLowerCase()}`,
    codeClient: data.codeClient,
    nomLibrairie: data.nomLibrairie,
    email: data.email,
    passwordHash: bcrypt.hashSync(data.password, DEV_COST),
    adresseLivraison: data.adresseLivraison,
    remise: data.remise,
    telephone: data.telephone,
  }
}

export const MOCK_USERS: MockUser[] = [
  createMockUser({
    codeClient: 'LIB001',
    nomLibrairie: 'Librairie du Parc',
    email: 'marie.lecomte@librairie-du-parc.fr',
    password: 'Libraire123!',
    adresseLivraison: '12 rue du Parc, 75001 Paris',
    remise: 15,
    telephone: '01 23 45 67 89',
  }),
  createMockUser({
    codeClient: 'LIB002',
    nomLibrairie: 'Les Mots Voyageurs',
    email: 'thomas.beaumont@motsvoyageurs.fr',
    password: 'Libraire123!',
    adresseLivraison: '8 place Bellecour, 69002 Lyon',
    remise: 20,
    telephone: '04 56 78 90 12',
  }),
  createMockUser({
    codeClient: 'LIB003',
    nomLibrairie: 'La Page Tournée',
    email: 'sophie.girard@lapageturne.fr',
    password: 'Libraire123!',
    adresseLivraison: '3 allée des Fleurs, 33000 Bordeaux',
    remise: 12,
    telephone: '05 56 12 34 56',
  }),
]

// Codes client valides pour l'inscription (simule la base AS400/CRM)
export const VALID_CLIENT_CODES = MOCK_USERS.map((u) => ({
  codeClient: u.codeClient,
  email: u.email,
}))
