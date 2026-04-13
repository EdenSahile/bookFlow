import { useState } from 'react'
import styled from 'styled-components'
import { BookCard } from '@/components/catalogue/BookCard'
import { UniverseFilter } from '@/components/catalogue/UniverseFilter'
import { getBooksByType } from '@/data/mockBooks'
import type { Universe } from '@/data/mockBooks'

/* ── Tabs ── */
type Tab = 'mois' | 'a-paraitre'

const Page = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  max-width: 1200px;
  margin: 0 auto;
`

const PageTitle = styled.h1`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.sizes['2xl']};
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  color: ${({ theme }) => theme.colors.navy};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
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
  padding: 8px 20px;
  border: none;
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme, $active }) => $active ? theme.colors.navy : 'transparent'};
  color: ${({ theme, $active }) => $active ? theme.colors.white : theme.colors.gray[600]};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  font-weight: ${({ theme, $active }) => $active ? theme.typography.weights.semibold : theme.typography.weights.normal};
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
  white-space: nowrap;
`

const FilterRow = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};

  @media (min-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  }
`

const EmptyState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing['3xl']};
  color: ${({ theme }) => theme.colors.gray[400]};
  font-family: ${({ theme }) => theme.typography.fontFamily};
`

const ParaitreInfo = styled.div`
  background: ${({ theme }) => theme.colors.navyLight};
  border: 1px solid ${({ theme }) => theme.colors.navy};
  border-radius: ${({ theme }) => theme.radii.md};
  padding: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  color: ${({ theme }) => theme.colors.navy};
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.sm};
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
`

export function NouveautesPage() {
  const [tab, setTab] = useState<Tab>('mois')
  const [universe, setUniverse] = useState<Universe | null>(null)

  const nouveautes = getBooksByType('nouveaute', universe ?? undefined)
  const aParaitre = getBooksByType('a-paraitre', universe ?? undefined)

  /* Regrouper les "à paraître" par programme */
  const programmes = [...new Set(aParaitre.map(b => b.programme ?? 'Autres'))].sort()

  return (
    <Page>
      <PageTitle>Nouveautés</PageTitle>

      <TabBar>
        <Tab $active={tab === 'mois'} onClick={() => setTab('mois')}>
          Nouveautés du mois
        </Tab>
        <Tab $active={tab === 'a-paraitre'} onClick={() => setTab('a-paraitre')}>
          À paraître
        </Tab>
      </TabBar>

      <FilterRow>
        <UniverseFilter value={universe} onChange={setUniverse} />
      </FilterRow>

      {tab === 'mois' && (
        nouveautes.length > 0 ? (
          <Grid>
            {nouveautes.map(book => <BookCard key={book.id} book={book} showType />)}
          </Grid>
        ) : (
          <EmptyState>Aucun titre pour cet univers ce mois-ci.</EmptyState>
        )
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
                <ProgrammeTitle>{prog}</ProgrammeTitle>
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
