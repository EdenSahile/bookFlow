# Stock Status & Availability Filter — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remplacer StockBadge par StockStatus inline partout, ajouter le filtre disponibilité sur FondsPage, et unifier la typographie des BookCard.

**Architecture:** `StockStatus` est un composant pur (icône + texte + tooltip optionnel) sans fond ni bordure, 11.5 px. Il remplace `StockBadge` dans BookCard, BookCardRow et FicheProduitPage. Le filtre disponibilité dans FondsPage fonctionne en ET cumulatif avec le filtre univers existant. CartPage et HistoriquePage ont leurs labels déjà en place — aucune modification requise.

**Tech Stack:** React 18, TypeScript strict, styled-components v6, Vitest + @testing-library/react, Vite 5.

---

## Fichiers touchés

| Fichier | Action |
|---------|--------|
| `src/data/mockBooks.ts` | Modifier — ajouter `delaiReimp?: string` à `Book` + 3 mocks |
| `src/components/ui/StockStatus.tsx` | Créer |
| `src/components/ui/__tests__/StockStatus.test.tsx` | Créer |
| `src/components/catalogue/BookCard.tsx` | Modifier — remplacer StockBadge, typo |
| `src/components/catalogue/BookCardRow.tsx` | Modifier — remplacer StockBadge, fixer AvailStatus |
| `src/pages/catalogue/FicheProduitPage.tsx` | Modifier — remplacer StockBadge |
| `src/pages/fonds/FondsPage.tsx` | Modifier — filtre disponibilité cumulatif |
| `src/pages/fonds/__tests__/fondsFilter.test.ts` | Créer |

**Intouchable :** `src/contexts/__tests__/computeTotals.test.ts`, `src/lib/__tests__/bookUtils.test.ts`, `computeTotals` dans CartContext.

---

## Task 1 — Modèle de données : `delaiReimp`

**Files:**
- Modify: `src/data/mockBooks.ts`

- [ ] **Step 1 : Ajouter `delaiReimp` à l'interface `Book`**

Dans `src/data/mockBooks.ts`, après la ligne `statut?: StockStatut`, ajouter :

```ts
delaiReimp?: string  // ex: "2 semaines" | "15 mai 2026" — uniquement pour en_reimp
```

- [ ] **Step 2 : Attribuer `delaiReimp` sur 3 livres en réimpression**

Dans le tableau `_RAW_MOCK_BOOKS`, trouver les 3 entrées suivantes et leur ajouter le champ :

```ts
// f-lit-bovary — Madame Bovary
{ id: 'f-lit-bovary', ..., delaiReimp: '2 semaines' }

// f-lit-gatsby — Gatsby le Magnifique
{ id: 'f-lit-gatsby', ..., delaiReimp: '15 mai 2026' }

// f-lit-alchimiste — L'Alchimiste
{ id: 'f-lit-alchimiste', ..., delaiReimp: '3 semaines' }
```

Les deux autres livres `en_reimp` (`f-lit-millenium`, `f-bd-onepiece`) n'ont pas de `delaiReimp` — le tooltip affichera "Délai non communiqué".

- [ ] **Step 3 : Vérifier TypeScript**

```bash
cd /Users/macbookeden/Desktop/AppBook && npx tsc --noEmit
```

Attendu : 0 erreurs.

- [ ] **Step 4 : Commit**

```bash
git add src/data/mockBooks.ts
git commit -m "feat(data): add delaiReimp field to Book interface and mock data"
```

---

## Task 2 — Composant `StockStatus.tsx`

**Files:**
- Create: `src/components/ui/StockStatus.tsx`
- Create: `src/components/ui/__tests__/StockStatus.test.tsx`

- [ ] **Step 1 : Écrire le test**

Créer `src/components/ui/__tests__/StockStatus.test.tsx` :

```tsx
import { describe, it, expect } from 'vitest'
import { getTooltipText } from '@/components/ui/StockStatus'

describe('getTooltipText', () => {
  it('retourne null pour disponible', () => {
    expect(getTooltipText('disponible', undefined)).toBeNull()
  })

  it('retourne null pour stock_limite', () => {
    expect(getTooltipText('stock_limite', undefined)).toBeNull()
  })

  it('retourne null pour epuise', () => {
    expect(getTooltipText('epuise', undefined)).toBeNull()
  })

  it('retourne le message sur_commande', () => {
    expect(getTooltipText('sur_commande', undefined)).toBe(
      "Commandé spécialement auprès de l'éditeur — délai 7 à 15 jours ouvrés"
    )
  })

  it('retourne le délai quand delaiReimp est fourni', () => {
    expect(getTooltipText('en_reimp', '2 semaines')).toBe('Délai prévu : 2 semaines')
  })

  it('retourne "Délai non communiqué" si pas de delaiReimp', () => {
    expect(getTooltipText('en_reimp', undefined)).toBe('Délai non communiqué')
  })
})
```

- [ ] **Step 2 : Lancer le test — vérifier qu'il échoue**

```bash
cd /Users/macbookeden/Desktop/AppBook && npx vitest run src/components/ui/__tests__/StockStatus.test.tsx
```

Attendu : FAIL — `getTooltipText` non défini.

- [ ] **Step 3 : Créer `StockStatus.tsx`**

Créer `src/components/ui/StockStatus.tsx` :

```tsx
import { useState, useCallback, useRef } from 'react'
import { createPortal } from 'react-dom'
import styled from 'styled-components'
import type { StockStatut } from '@/data/mockBooks'

/* ── Palette par statut ── */
const STATUT_CONFIG: Record<StockStatut, { icon: string; label: string; color: string }> = {
  disponible:   { icon: '✅', label: 'Disponible',      color: '#2E7D32' },
  stock_limite: { icon: '⚠️', label: 'Stock limité',    color: '#C17E00' },
  sur_commande: { icon: '🔄', label: 'Sur commande',    color: '#5B7A9E' },
  en_reimp:     { icon: '🔁', label: 'En réimpression', color: '#A07040' },
  epuise:       { icon: '❌', label: 'Épuisé',          color: '#999999' },
}

const STATUTS_WITH_TOOLTIP: ReadonlyArray<StockStatut> = ['sur_commande', 'en_reimp']

export function getTooltipText(statut: StockStatut, delaiReimp: string | undefined): string | null {
  if (statut === 'sur_commande') {
    return "Commandé spécialement auprès de l'éditeur — délai 7 à 15 jours ouvrés"
  }
  if (statut === 'en_reimp') {
    return delaiReimp ? `Délai prévu : ${delaiReimp}` : 'Délai non communiqué'
  }
  return null
}

/* ── Styled ── */
const Wrap = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
`

const Text = styled.span<{ $color: string }>`
  font-size: 11.5px;
  font-weight: 500;
  color: ${({ $color }) => $color};
  line-height: 1.2;
`

const InfoIcon = styled.span`
  font-size: 11px;
  color: #AAAAAA;
  cursor: help;
  line-height: 1;
  flex-shrink: 0;
`

const Tooltip = styled.div<{ $top: number; $left: number }>`
  position: fixed;
  top: ${({ $top }) => $top}px;
  left: ${({ $left }) => $left}px;
  transform: translateY(-100%) translateY(-6px);
  background: #1E3A5F;
  color: #ffffff;
  font-size: 11px;
  line-height: 1.45;
  padding: 6px 10px;
  border-radius: 6px;
  max-width: 240px;
  white-space: normal;
  pointer-events: none;
  z-index: 99999;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
`

/* ── Component ── */
export interface StockStatusProps {
  statut: StockStatut
  delaiReimp?: string
  className?: string
}

export function StockStatus({ statut, delaiReimp, className }: StockStatusProps) {
  const { icon, label, color } = STATUT_CONFIG[statut]
  const tooltipText = getTooltipText(statut, delaiReimp)
  const hasTooltip = STATUTS_WITH_TOOLTIP.includes(statut) && tooltipText !== null

  const [tooltipPos, setTooltipPos] = useState<{ top: number; left: number } | null>(null)
  const iconRef = useRef<HTMLSpanElement>(null)

  const showTooltip = useCallback(() => {
    if (!iconRef.current) return
    const rect = iconRef.current.getBoundingClientRect()
    setTooltipPos({ top: rect.top, left: rect.left + rect.width / 2 })
  }, [])

  const hideTooltip = useCallback(() => setTooltipPos(null), [])

  return (
    <Wrap className={className}>
      <Text $color={color}>
        {icon} {label}
      </Text>
      {hasTooltip && (
        <InfoIcon
          ref={iconRef}
          onMouseEnter={showTooltip}
          onMouseLeave={hideTooltip}
          aria-label={tooltipText ?? undefined}
          role="img"
        >
          ⓘ
        </InfoIcon>
      )}
      {hasTooltip && tooltipPos && tooltipText && createPortal(
        <Tooltip $top={tooltipPos.top} $left={tooltipPos.left}>
          {tooltipText}
        </Tooltip>,
        document.body,
      )}
    </Wrap>
  )
}
```

- [ ] **Step 4 : Lancer le test — vérifier qu'il passe**

```bash
cd /Users/macbookeden/Desktop/AppBook && npx vitest run src/components/ui/__tests__/StockStatus.test.tsx
```

Attendu : 6 tests PASS.

- [ ] **Step 5 : Vérifier TypeScript**

```bash
cd /Users/macbookeden/Desktop/AppBook && npx tsc --noEmit
```

Attendu : 0 erreurs.

- [ ] **Step 6 : Commit**

```bash
git add src/components/ui/StockStatus.tsx src/components/ui/__tests__/StockStatus.test.tsx
git commit -m "feat(ui): create StockStatus inline component with tooltip"
```

---

## Task 3 — BookCard : StockStatus + typographie

**Files:**
- Modify: `src/components/catalogue/BookCard.tsx`

- [ ] **Step 1 : Remplacer l'import StockBadge par StockStatus**

Dans `BookCard.tsx`, remplacer :
```ts
import { StockBadge } from './StockBadge'
```
par :
```ts
import { StockStatus } from '@/components/ui/StockStatus'
```

- [ ] **Step 2 : Mettre à jour le rendu du statut**

Trouver la section qui contient `<StockBadge statut={book.statut} />` (dans le bloc `StockRow`) et remplacer :
```tsx
{book.statut && !isAParaitre && (
  <StockRow>
    <StockBadge statut={book.statut} />
  </StockRow>
)}
```
par :
```tsx
{book.statut && !isAParaitre && (
  <StockRow>
    <StockStatus statut={book.statut} delaiReimp={book.delaiReimp} />
  </StockRow>
)}
```

- [ ] **Step 3 : Mettre à jour la typographie**

Dans les styled components de BookCard.tsx, appliquer ces changements :

**`Title`** — changer `font-size` de `15px` à `14px`, `font-weight` de `500` à `700`, et `color` vers `#1A2332` :
```ts
const Title = styled.h3`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 14px;
  font-weight: 700;
  color: #1A2332;
  line-height: 1.25;
  margin-bottom: 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`
```

**`Authors`** — changer `color` de `theme.colors.gray[600]` à `#555555` :
```ts
const Authors = styled.p`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 12px;
  color: #555555;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-style: italic;
`
```

**`Publisher`** — changer `color` de `theme.colors.gray[400]` à `#888888` :
```ts
const Publisher = styled.p`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 11px;
  color: #888888;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`
```

**`MetaPill`** — supprimer `font-family: 'Roboto', sans-serif` et changer la couleur de `#555` à `#666666`, taille de `12px` (inchangé) :
```ts
const MetaPill = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 2px 8px 2px 0;
  border-radius: 20px;
  background: #f0f0f0;
  color: #666666;
  font-size: 12px;
  font-weight: 400;
`
```

**`Price`** — changer `font-weight` de `500` à `800` et `color` vers `#1A2332` :
```ts
const Price = styled.span`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 20px;
  font-weight: 800;
  color: #1A2332;
  letter-spacing: -0.01em;
  line-height: 1.1;
`
```

**`PriceLabel`** — changer `font-size` de `11px` à `10px` et `color` vers `#AAAAAA` :
```ts
const PriceLabel = styled.span`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 10px;
  color: #AAAAAA;
`
```

- [ ] **Step 4 : Vérifier TypeScript**

```bash
cd /Users/macbookeden/Desktop/AppBook && npx tsc --noEmit
```

Attendu : 0 erreurs.

- [ ] **Step 5 : Lancer tous les tests**

```bash
cd /Users/macbookeden/Desktop/AppBook && npm test
```

Attendu : tous les tests passent.

- [ ] **Step 6 : Commit**

```bash
git add src/components/catalogue/BookCard.tsx
git commit -m "feat(catalogue): replace StockBadge with StockStatus + unify BookCard typography"
```

---

## Task 4 — BookCardRow : StockStatus + AvailStatus

**Files:**
- Modify: `src/components/catalogue/BookCardRow.tsx`

- [ ] **Step 1 : Remplacer l'import StockBadge**

Dans `BookCardRow.tsx`, remplacer :
```ts
import { StockBadge } from './StockBadge'
```
par :
```ts
import { StockStatus } from '@/components/ui/StockStatus'
```

- [ ] **Step 2 : Remplacer StockBadge dans Col 1**

Trouver le bloc dans Col 1 (vers ligne 848) :
```tsx
{book.statut && !isAParaitre && (
  <div style={{ marginTop: 6 }}>
    <StockBadge statut={book.statut} />
  </div>
)}
```
Remplacer par :
```tsx
{book.statut && !isAParaitre && (
  <div style={{ marginTop: 6 }}>
    <StockStatus statut={book.statut} delaiReimp={book.delaiReimp} />
  </div>
)}
```

- [ ] **Step 3 : Mettre à jour `IsbnLine` dans BookCardRow (typographie §5)**

Trouver le styled component `IsbnLine` dans `BookCardRow.tsx` (vers ligne 184) :
```ts
const IsbnLine = styled.p`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.gray[600]};
  margin-top: 2px;
  letter-spacing: 0.01em;
`
```
Remplacer par :
```ts
const IsbnLine = styled.p`
  font-size: 12px;
  color: #666666;
  margin-top: 2px;
  letter-spacing: 0.01em;
`
```

- [ ] **Step 4 : Remplacer AvailStatus dans la OrderBar**

La `OrderBar` contient actuellement un bloc `AvailStatus` avec un `GreenDot` hardcodé et le texte "Available" / "Épuisé" / "À paraître". Trouver ce bloc (vers ligne 912) :

```tsx
<AvailStatus>
  <GreenDot />
  <AvailText>{
    isAParaitre ? 'À paraître' :
    isEpuise    ? 'Épuisé'     :
                  'Available'
  }</AvailText>
</AvailStatus>
```

Remplacer par (en conservant `<AvailStatus>` comme wrapper flex) :
```tsx
<AvailStatus>
  {isAParaitre
    ? <AvailText>À paraître</AvailText>
    : book.statut
      ? <StockStatus statut={book.statut} delaiReimp={book.delaiReimp} />
      : <AvailText>Disponible</AvailText>
  }
</AvailStatus>
```

Note : `GreenDot` et `AvailText` peuvent rester définis dans le fichier (ils sont utilisés en fallback) — ne pas supprimer leurs définitions styled.

- [ ] **Step 5 : Vérifier TypeScript**

```bash
cd /Users/macbookeden/Desktop/AppBook && npx tsc --noEmit
```

Attendu : 0 erreurs.

- [ ] **Step 6 : Lancer tous les tests**

```bash
cd /Users/macbookeden/Desktop/AppBook && npm test
```

Attendu : tous les tests passent.

- [ ] **Step 7 : Commit**

```bash
git add src/components/catalogue/BookCardRow.tsx
git commit -m "feat(catalogue): replace StockBadge with StockStatus in BookCardRow + fix AvailStatus"
```

---

## Task 5 — FicheProduitPage : StockStatus

**Files:**
- Modify: `src/pages/catalogue/FicheProduitPage.tsx`

- [ ] **Step 1 : Remplacer l'import StockBadge**

Dans `FicheProduitPage.tsx`, remplacer :
```ts
import { StockBadge } from '@/components/catalogue/StockBadge'
```
par :
```ts
import { StockStatus } from '@/components/ui/StockStatus'
```

- [ ] **Step 2 : Remplacer le rendu StockBadge**

Trouver vers ligne 1201 :
```tsx
<MetaDd><StockBadge statut={book.statut} size="md" /></MetaDd>
```
Remplacer par :
```tsx
<MetaDd><StockStatus statut={book.statut} delaiReimp={book.delaiReimp} /></MetaDd>
```

(L'attribut `size="md"` disparaît — StockStatus n'a pas de variante de taille.)

- [ ] **Step 3 : Vérifier TypeScript**

```bash
cd /Users/macbookeden/Desktop/AppBook && npx tsc --noEmit
```

Attendu : 0 erreurs.

- [ ] **Step 4 : Lancer tous les tests**

```bash
cd /Users/macbookeden/Desktop/AppBook && npm test
```

Attendu : tous les tests passent.

- [ ] **Step 5 : Commit**

```bash
git add src/pages/catalogue/FicheProduitPage.tsx
git commit -m "feat(catalogue): replace StockBadge with StockStatus in FicheProduitPage"
```

---

## Task 6 — FondsPage : filtre disponibilité cumulatif

**Files:**
- Create: `src/pages/fonds/__tests__/fondsFilter.test.ts`
- Modify: `src/pages/fonds/FondsPage.tsx`

- [ ] **Step 1 : Écrire le test de la logique de filtre**

Créer `src/pages/fonds/__tests__/fondsFilter.test.ts` :

```ts
import { describe, it, expect } from 'vitest'
import type { Book, StockStatut, Universe } from '@/data/mockBooks'

function makeBook(id: string, universe: Universe, statut: StockStatut): Book {
  return {
    id, isbn: '0000000000000', title: id,
    authors: [], publisher: 'Test', universe,
    type: 'fonds', price: 10, priceTTC: 15,
    format: 'Poche', publicationDate: '2020-01-01',
    description: '', statut,
  }
}

function applyFilters(
  books: Book[],
  universe: Universe | null,
  statut: StockStatut | null,
): Book[] {
  let result = books
  if (universe) result = result.filter(b => b.universe === universe)
  if (statut)   result = result.filter(b => b.statut === statut)
  return result
}

const books: Book[] = [
  makeBook('a', 'Littérature',     'disponible'),
  makeBook('b', 'Littérature',     'epuise'),
  makeBook('c', 'BD/Mangas',       'disponible'),
  makeBook('d', 'Adulte-pratique', 'stock_limite'),
]

describe('FondsPage filter logic', () => {
  it('pas de filtre — retourne tout', () => {
    expect(applyFilters(books, null, null)).toHaveLength(4)
  })

  it('filtre univers uniquement', () => {
    const result = applyFilters(books, 'Littérature', null)
    expect(result).toHaveLength(2)
    expect(result.every(b => b.universe === 'Littérature')).toBe(true)
  })

  it('filtre statut uniquement', () => {
    const result = applyFilters(books, null, 'disponible')
    expect(result).toHaveLength(2)
    expect(result.every(b => b.statut === 'disponible')).toBe(true)
  })

  it('filtre cumulatif univers + statut', () => {
    const result = applyFilters(books, 'Littérature', 'disponible')
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('a')
  })

  it('retourne 0 résultats si combinaison vide', () => {
    const result = applyFilters(books, 'Jeunesse', 'epuise')
    expect(result).toHaveLength(0)
  })
})
```

- [ ] **Step 2 : Lancer le test — vérifier qu'il passe** *(c'est une logique pure sans dépendance React)*

```bash
cd /Users/macbookeden/Desktop/AppBook && npx vitest run src/pages/fonds/__tests__/fondsFilter.test.ts
```

Attendu : 5 tests PASS.

- [ ] **Step 3 : Modifier `FondsPage.tsx`**

Remplacer le contenu complet de `FondsPage.tsx` par :

```tsx
import { useState, useDeferredValue } from 'react'
import styled from 'styled-components'
import { BookCard } from '@/components/catalogue/BookCard'
import { UniverseFilter } from '@/components/catalogue/UniverseFilter'
import { getBooksByType, searchBooks } from '@/data/mockBooks'
import type { Universe, StockStatut } from '@/data/mockBooks'
import { Input } from '@/components/ui/Input'

const DISPO_OPTIONS: Array<{ value: StockStatut; label: string }> = [
  { value: 'disponible',   label: '✅ Disponible' },
  { value: 'stock_limite', label: '⚠️ Stock limité' },
  { value: 'sur_commande', label: '🔄 Sur commande' },
  { value: 'en_reimp',     label: '🔁 En réimpression' },
  { value: 'epuise',       label: '❌ Épuisé' },
]

const Page = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  max-width: 1200px;
  margin: 0 auto;
`

const PageHeader = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`

const PageTitle = styled.h1`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.sizes['2xl']};
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  color: ${({ theme }) => theme.colors.navy};
  margin: 0 0 4px;
`

const PageSubtitle = styled.p`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  color: ${({ theme }) => theme.colors.gray[600]};
  margin: 0;
`

const Controls = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`

const FilterRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  flex-wrap: wrap;
`

const VDivider = styled.span`
  width: 1px;
  height: 24px;
  background: ${({ theme }) => theme.colors.gray[200]};
  flex-shrink: 0;
  margin: 0 4px;

  @media (max-width: 600px) { display: none; }
`

const CountLabel = styled.span`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  color: ${({ theme }) => theme.colors.gray[400]};
  margin-left: auto;
  white-space: nowrap;
  flex-shrink: 0;
`

const DispoPill = styled.button<{ $active: boolean }>`
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 7px 13px;
  border-radius: ${({ theme }) => theme.radii.full};
  border: 2px solid ${({ $active, theme }) => $active ? theme.colors.navy : theme.colors.gray[200]};
  background: ${({ $active, theme }) => $active ? theme.colors.navy : theme.colors.white};
  color: ${({ $active, theme }) => $active ? theme.colors.white : theme.colors.gray[600]};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  font-weight: ${({ $active, theme }) => $active ? theme.typography.weights.semibold : theme.typography.weights.normal};
  cursor: pointer;
  transition: background 0.18s, border-color 0.18s, color 0.18s, transform 0.12s;
  white-space: nowrap;

  &:hover {
    border-color: ${({ theme }) => theme.colors.navy};
    color: ${({ $active, theme }) => $active ? theme.colors.white : theme.colors.navy};
    transform: translateY(-1px);
  }
  &:active { transform: translateY(0); }
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${({ theme }) => theme.spacing.md};

  @media (min-width: 480px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
`

const EmptyState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing['3xl']};
  color: ${({ theme }) => theme.colors.gray[400]};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.sizes.sm};

  &::before {
    content: '🔍';
    display: block;
    font-size: 2.5rem;
    margin-bottom: 12px;
  }
`

const SearchWrapper = styled.div`
  position: relative;

  input {
    padding-left: 42px;
  }
`

const SearchIcon = styled.span`
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.colors.gray[400]};
  font-size: 1rem;
  pointer-events: none;
`

export function FondsPage() {
  const [query, setQuery]       = useState('')
  const [universe, setUniverse] = useState<Universe | null>(null)
  const [statut, setStatut]     = useState<StockStatut | null>(null)
  const deferred = useDeferredValue(query)

  const allFonds = getBooksByType('fonds')

  let books = deferred.trim()
    ? searchBooks(deferred).filter(b => b.type === 'fonds')
    : allFonds

  if (universe) books = books.filter(b => b.universe === universe)
  if (statut)   books = books.filter(b => b.statut === statut)

  return (
    <Page>
      <PageHeader>
        <PageTitle>Fonds</PageTitle>
        <PageSubtitle>Titres déjà parus, disponibles à la commande immédiate</PageSubtitle>
      </PageHeader>

      <Controls>
        <SearchWrapper>
          <SearchIcon>🔍</SearchIcon>
          <Input
            id="fonds-search"
            type="search"
            placeholder="Titre, auteur, ISBN, éditeur…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            aria-label="Rechercher dans les fonds"
          />
        </SearchWrapper>

        <FilterRow role="group" aria-label="Filtres">
          <UniverseFilter value={universe} onChange={setUniverse} />

          <VDivider aria-hidden="true" />

          <DispoPill $active={statut === null} onClick={() => setStatut(null)}>
            Tous
          </DispoPill>
          {DISPO_OPTIONS.map(opt => (
            <DispoPill
              key={opt.value}
              $active={statut === opt.value}
              onClick={() => setStatut(statut === opt.value ? null : opt.value)}
            >
              {opt.label}
            </DispoPill>
          ))}

          <CountLabel>{books.length} titre{books.length > 1 ? 's' : ''}</CountLabel>
        </FilterRow>
      </Controls>

      {books.length > 0 ? (
        <Grid>
          {books.map(book => <BookCard key={book.id} book={book} showType />)}
        </Grid>
      ) : (
        <EmptyState>
          {deferred.trim()
            ? `Aucun résultat pour « ${deferred} »`
            : 'Aucun titre avec ces filtres.'}
        </EmptyState>
      )}
    </Page>
  )
}
```

- [ ] **Step 4 : Vérifier TypeScript**

```bash
cd /Users/macbookeden/Desktop/AppBook && npx tsc --noEmit
```

Attendu : 0 erreurs.

- [ ] **Step 5 : Lancer tous les tests**

```bash
cd /Users/macbookeden/Desktop/AppBook && npm test
```

Attendu : tous les tests passent (inclut les 5 nouveaux tests de filtre).

- [ ] **Step 6 : Commit**

```bash
git add src/pages/fonds/FondsPage.tsx src/pages/fonds/__tests__/fondsFilter.test.ts
git commit -m "feat(fonds): add cumulative availability filter with pill UI"
```

---

## Vérification finale

- [ ] **Lancer le build complet**

```bash
cd /Users/macbookeden/Desktop/AppBook && npm run build
```

Attendu : build sans erreur, pas de warnings TypeScript.

- [ ] **Vérifier qu'aucun fichier n'importe encore StockBadge**

```bash
grep -r "StockBadge" /Users/macbookeden/Desktop/AppBook/src --include="*.tsx" --include="*.ts" | grep -v "StockBadge.tsx"
```

Attendu : aucune ligne affichée.

- [ ] **Lancer tous les tests une dernière fois**

```bash
cd /Users/macbookeden/Desktop/AppBook && npm test
```

Attendu : tous les tests PASS.
