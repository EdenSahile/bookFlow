import { useState, useDeferredValue } from 'react'
import styled from 'styled-components'
import { BookCard } from '@/components/catalogue/BookCard'
import { UniverseFilter } from '@/components/catalogue/UniverseFilter'
import { getBooksByType, searchBooks } from '@/data/mockBooks'
import type { Universe } from '@/data/mockBooks'
import { Input } from '@/components/ui/Input'

/* ── Tabs ── */
type Tab = 'mois' | 'a-paraitre'

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

const TabBar = styled.div`
  display: flex;
  gap: 2px;
  background: ${({ theme }) => theme.colors.gray[100]};
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: 4px;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  width: fit-content;
`

const Tab = styled.button<{ $active: boolean }>`
  padding: 9px 22px;
  border: none;
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme, $active }) => $active ? theme.colors.navy : 'transparent'};
  color: ${({ theme, $active }) => $active ? theme.colors.white : theme.colors.gray[600]};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  font-weight: ${({ theme, $active }) => $active ? theme.typography.weights.semibold : theme.typography.weights.normal};
  cursor: pointer;
  transition: background 0.18s, color 0.18s;
  white-space: nowrap;
  letter-spacing: 0.01em;
`

const Controls = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
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

const ResultCount = styled.p`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  color: ${({ theme }) => theme.colors.gray[600]};
  margin-bottom: ${({ theme }) => theme.spacing.md};

  strong {
    color: ${({ theme }) => theme.colors.navy};
    font-weight: 700;
  }
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
    content: '📭';
    display: block;
    font-size: 2.5rem;
    margin-bottom: 12px;
  }
`

const ParaitreInfo = styled.div`
  background: #EEF2FA;
  border: 1px solid #BFCCE8;
  border-left: 4px solid ${({ theme }) => theme.colors.navy};
  border-radius: ${({ theme }) => theme.radii.md};
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  color: ${({ theme }) => theme.colors.navy};
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.sm};
  line-height: 1.5;
`

const ProgrammeSection = styled.section`
  margin-bottom: ${({ theme }) => theme.spacing['2xl']};
`

const ProgrammeTitle = styled.h2`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.sizes.lg};
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  color: ${({ theme }) => theme.colors.navy};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  padding-bottom: ${({ theme }) => theme.spacing.sm};
  border-bottom: 2px solid ${({ theme }) => theme.colors.primary};
  display: flex;
  align-items: center;
  gap: 8px;
`

export function NouveautesPage() {
  const [tab, setTab]           = useState<Tab>('mois')
  const [universe, setUniverse] = useState<Universe | null>(null)
  const [query, setQuery]       = useState('')
  const deferred = useDeferredValue(query)

  let nouveautes = deferred.trim()
    ? searchBooks(deferred).filter(b => b.type === 'nouveaute')
    : getBooksByType('nouveaute')

  let aParaitre = deferred.trim()
    ? searchBooks(deferred).filter(b => b.type === 'a-paraitre')
    : getBooksByType('a-paraitre')

  if (universe) {
    nouveautes = nouveautes.filter(b => b.universe === universe)
    aParaitre  = aParaitre.filter(b => b.universe === universe)
  }

  /* Regrouper les "à paraître" par programme */
  const programmes = [...new Set(aParaitre.map(b => b.programme ?? 'Autres'))].sort()

  return (
    <Page>
      <PageHeader>
        <PageTitle>Nouveautés</PageTitle>
        <PageSubtitle>
          {tab === 'mois'
            ? 'Titres du mois disponibles à la commande immédiate'
            : 'Titres à venir — consultation catalogue uniquement'}
        </PageSubtitle>
      </PageHeader>

      <TabBar>
        <Tab $active={tab === 'mois'} onClick={() => setTab('mois')}>
          Nouveautés du mois
        </Tab>
        <Tab $active={tab === 'a-paraitre'} onClick={() => setTab('a-paraitre')}>
          À paraître
        </Tab>
      </TabBar>

      <Controls>
        <SearchWrapper>
          <SearchIcon>🔍</SearchIcon>
          <Input
            id="nouveautes-search"
            type="search"
            placeholder="Titre, auteur, ISBN, éditeur…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            aria-label="Rechercher dans les nouveautés"
          />
        </SearchWrapper>
        <UniverseFilter value={universe} onChange={setUniverse} />
      </Controls>

      {tab === 'mois' && (
        <>
          {nouveautes.length > 0 && (
            <ResultCount>
              <strong>{nouveautes.length}</strong> titre{nouveautes.length > 1 ? 's' : ''} ce mois-ci
            </ResultCount>
          )}
          {nouveautes.length > 0 ? (
            <Grid>
              {nouveautes.map(book => <BookCard key={book.id} book={book} showType />)}
            </Grid>
          ) : (
            <EmptyState>
              {deferred.trim()
                ? `Aucun résultat pour « ${deferred} »`
                : 'Aucun titre pour cet univers ce mois-ci.'}
            </EmptyState>
          )}
        </>
      )}

      {tab === 'a-paraitre' && (
        <>
          <ParaitreInfo>
            ℹ️ <span>Les titres à paraître sont consultables uniquement. La commande se fait via votre représentant commercial. Vous pouvez recevoir le catalogue par email.</span>
          </ParaitreInfo>

          {programmes.length === 0 && (
            <EmptyState>Aucun titre à paraître pour cet univers.</EmptyState>
          )}

          {programmes.map(prog => {
            const books = aParaitre.filter(b => (b.programme ?? 'Autres') === prog)
            return (
              <ProgrammeSection key={prog}>
                <ProgrammeTitle>
                  <span>{prog}</span>
                  <ResultCount as="span" style={{ marginBottom: 0, fontSize: '12px' }}>
                    {books.length} titre{books.length > 1 ? 's' : ''}
                  </ResultCount>
                </ProgrammeTitle>
                <Grid>
                  {books.map(book => <BookCard key={book.id} book={book} />)}
                </Grid>
              </ProgrammeSection>
            )
          })}
        </>
      )}
    </Page>
  )
}
