import type { BookType } from '@/data/mockBooks'

export function isOrderable(type: BookType): boolean {
  return type !== 'a-paraitre'
}
