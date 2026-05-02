import { describe, it, expect } from 'vitest'
import { MOCK_BOOKS } from '@/data/mockBooks'

function findByIsbn(search: string, books: typeof MOCK_BOOKS) {
  const trimmed = search.trim()
  return books.find(b => b.isbn === trimmed) ?? null
}

describe('ISBN direct search', () => {
  it('trouve un livre par ISBN exact', () => {
    const first = MOCK_BOOKS[0]
    const found = findByIsbn(first.isbn, MOCK_BOOKS)
    expect(found?.id).toBe(first.id)
  })

  it('retourne null pour un ISBN inexistant', () => {
    expect(findByIsbn('000-0-000-00000-0', MOCK_BOOKS)).toBeNull()
  })

  it('ignore les espaces autour', () => {
    const first = MOCK_BOOKS[0]
    expect(findByIsbn(`  ${first.isbn}  `, MOCK_BOOKS)).not.toBeNull()
  })
})
