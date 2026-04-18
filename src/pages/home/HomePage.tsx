import { useState, useEffect, useRef } from 'react'
import styled, { keyframes } from 'styled-components'
import { Link, useNavigate } from 'react-router-dom'
import { BookCover } from '@/components/catalogue/BookCover'
import { useAuth } from '@/hooks/useAuth'
import { useCart } from '@/contexts/CartContext'
import { MOCK_BOOKS } from '@/data/mockBooks'
import { MOCK_FLASH_INFOS } from '@/data/mockFlashInfos'

const GREEN = '#226241'
const TEXT_ON_GREEN = '#d4ead9'

const nouveautes = MOCK_BOOKS
  .filter(b => b.type === 'nouveaute')
  .sort((a, b) => b.publicationDate.localeCompare(a.publicationDate))
  .slice(0, 5)

const nouveautesCount = MOCK_BOOKS.filter(b => b.type === 'nouveaute').length
const flashInfosCount = MOCK_FLASH_INFOS.length

/* ── SVG Icons ── */
function IconSearch() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={GREEN}
      strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  )
}

function IconPackage() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 2 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.29 7 12 12 20.71 7" />
      <line x1="12" y1="22" x2="12" y2="12" />
    </svg>
  )
}

function IconBooks() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  )
}

function IconStar() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  )
}

function IconClipboard() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
      <line x1="9" y1="12" x2="15" y2="12" />
      <line x1="9" y1="16" x2="15" y2="16" />
    </svg>
  )
}

/* ── Page layout ── */
const Page = styled.div`
  min-height: calc(100vh - ${({ theme }) => theme.layout.headerHeight});
  background-color: ${({ theme }) => theme.colors.gray[50]};
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.xl} ${({ theme }) => theme.spacing.lg};

  @media (min-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: ${({ theme }) => theme.spacing['2xl']} ${({ theme }) => theme.spacing['3xl']};
  }
`

const Content = styled.div`
  width: 100%;
  max-width: 720px;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`

/* ── Hero ── */
const HeroSection = styled.section`
  text-align: center;
`

const GreetingTitle = styled.h1`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 22px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.gray[800]};
  margin-bottom: 4px;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: 20px;
  }
`

const LibraireName = styled.span`
  color: ${GREEN};
`

const GreetingSubtitle = styled.p`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.gray[600]};
  margin-bottom: 1.5rem;
`

const SearchBox = styled.form`
  max-width: 540px;
  margin: 0 auto;
  background: #fff;
  border: 1.5px solid ${GREEN};
  border-radius: 10px;
  padding: 10px 16px;
  display: flex;
  align-items: center;
  gap: 10px;
`

const SearchIconWrap = styled.span`
  flex-shrink: 0;
  display: flex;
  align-items: center;
`

const HeroSearchInput = styled.input`
  flex: 1;
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 14px;
  border: none;
  outline: none;
  background: transparent;
  color: ${({ theme }) => theme.colors.gray[800]};

  &::placeholder {
    color: ${({ theme }) => theme.colors.gray[400]};
  }
`

const SearchBtn = styled.button`
  background: ${GREEN};
  color: ${TEXT_ON_GREEN};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 13px;
  font-weight: 500;
  padding: 6px 14px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  flex-shrink: 0;
  transition: opacity 0.15s;

  &:hover { opacity: 0.88; }
`

const KeyHint = styled.p`
  font-family: ${({ theme }) => theme.typography.fontFamilyMono};
  font-size: 11px;
  letter-spacing: 0.03em;
  color: ${({ theme }) => theme.colors.gray[400]};
  text-align: center;
  margin-top: 8px;
`

/* ── Stats ── */
const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
`

const StatCard = styled.div`
  background: ${({ theme }) => theme.colors.gray[100]};
  border-radius: 8px;
  padding: 12px 16px;
`

const StatValue = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 20px;
  font-weight: 500;
  color: ${GREEN};
  margin-bottom: 2px;
`

const StatLabel = styled.p`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 11px;
  color: ${({ theme }) => theme.colors.gray[600]};
`

const RedDot = styled.span`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #e24b4a;
  flex-shrink: 0;
`

/* ── Shortcuts ── */
const ShortcutsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;

  @media (max-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
  }
`

const ShortcutCard = styled(Link)`
  background: ${({ theme }) => theme.colors.gray[100]};
  border: 0.5px solid ${({ theme }) => theme.colors.gray[200]};
  border-radius: 8px;
  padding: 12px;
  text-align: center;
  text-decoration: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  color: ${({ theme }) => theme.colors.gray[600]};
  transition: border-color 0.15s;

  &:hover {
    border-color: ${GREEN};
  }
`

const ShortcutLabel = styled.span`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 11px;
  color: ${({ theme }) => theme.colors.gray[600]};
`

/* ── Nouveautés ── */
const NouveautesSection = styled.section`
  width: 100%;
  position: relative;
`

const SectionHeader = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`

const SectionTitle = styled.h2`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 15px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.navy};
`

const SeeAllLink = styled(Link)`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 12px;
  font-weight: 500;
  color: ${GREEN};
  text-decoration: none;
  &:hover { text-decoration: underline; }
`

const CardScroll = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  overflow-x: auto;
  padding-bottom: ${({ theme }) => theme.spacing.sm};
  scrollbar-width: none;
  &::-webkit-scrollbar { display: none; }
`

const BookCard = styled.div`
  flex-shrink: 0;
  width: 130px;
  display: flex;
  flex-direction: column;
`

const CoverWrapper = styled.div`
  cursor: pointer;
  transition: transform 0.15s ease;
  &:hover { transform: translateY(-2px); }
`

const CardBody = styled.div`
  display: flex;
  flex-direction: column;
  padding: 6px 2px 4px;
  flex: 1;
`

const BadgeRow = styled.div`
  display: flex;
  gap: 4px;
  align-items: center;
  margin-bottom: 6px;
  flex-wrap: wrap;
`

const CategoryBadge = styled.span`
  background: #F4F4F0;
  color: #555;
  border: 0.5px solid #ddd;
  border-radius: 10px;
  font-family: 'DM Mono', 'Courier New', monospace;
  font-size: 9px;
  padding: 2px 7px;
`

const NouveauteBadge = styled.span`
  background: #C9A84C;
  color: #3d2f00;
  border-radius: 10px;
  font-family: 'DM Mono', 'Courier New', monospace;
  font-size: 9px;
  padding: 2px 7px;
`

const BookTitle = styled.p`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 13px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.gray[800]};
  line-height: 1.3;
  margin-bottom: 2px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`

const BookAuthor = styled.p`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 11px;
  color: ${({ theme }) => theme.colors.gray[600]};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const Divider = styled.hr`
  border: none;
  border-top: 0.5px solid ${({ theme }) => theme.colors.gray[200]};
  margin: 8px 0;
`

const PriceRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 4px;
`

const Price = styled.span`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.gray[800]};
`

const AddToCartBtn = styled.button`
  background: #226241;
  color: #d4ead9;
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 11px;
  font-weight: 500;
  padding: 5px 10px;
  border-radius: 5px;
  border: none;
  cursor: pointer;
  white-space: nowrap;
  flex-shrink: 0;
  transition: opacity 0.15s;

  &:hover { opacity: 0.90; }
  &:active { opacity: 0.80; }
`

/* ── Toast ── */
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
`

const Toast = styled.div`
  position: absolute;
  bottom: -44px;
  left: 50%;
  transform: translateX(-50%);
  background: ${({ theme }) => theme.colors.navy};
  color: #fff;
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  font-weight: ${({ theme }) => theme.typography.weights.medium};
  padding: 10px 20px;
  border-radius: 20px;
  white-space: nowrap;
  box-shadow: 0 4px 16px rgba(0,0,0,0.18);
  animation: ${fadeIn} 0.2s ease;
  pointer-events: none;
  z-index: 10;

  span { color: ${({ theme }) => theme.colors.accent}; margin-right: 6px; }
`

/* ── Component ── */
export function HomePage() {
  const { user } = useAuth()
  const { addToCart, totalItems } = useCart()
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [toast, setToast] = useState<string | null>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Bonjour' : hour < 18 ? 'Bon après-midi' : 'Bonsoir'

  /* Raccourci / → focus champ de recherche du header */
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key !== '/') return
      const active = document.activeElement
      if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA')) return
      e.preventDefault()
      const headerInput = document.getElementById('header-search-input') as HTMLInputElement | null
      headerInput?.focus()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [])

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    const q = searchQuery.trim()
    if (!q) return
    const found = MOCK_BOOKS.find(b => b.isbn === q.replace(/\s/g, ''))
    navigate(found ? `/livre/${found.id}` : `/recherche?q=${encodeURIComponent(q)}`)
  }

  function handleAdd(e: React.MouseEvent, book: typeof nouveautes[0]) {
    e.stopPropagation()
    addToCart(book, 1)
    setToast(book.title)
    setTimeout(() => setToast(null), 3000)
  }

  return (
    <Page>
      <Content>

        {/* 1 — Hero */}
        <HeroSection aria-label="Accueil">
          <GreetingTitle>
            {greeting}{user ? (
              <>, <LibraireName>{user.nomLibrairie}</LibraireName></>
            ) : null} 👋
          </GreetingTitle>
          <GreetingSubtitle>Que souhaitez-vous commander aujourd'hui ?</GreetingSubtitle>

          <SearchBox onSubmit={handleSearch} role="search" aria-label="Recherche rapide">
            <SearchIconWrap><IconSearch /></SearchIconWrap>
            <HeroSearchInput
              ref={searchInputRef}
              type="search"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="EAN, titre, auteur, éditeur, collection…"
              aria-label="Rechercher un livre"
            />
            <SearchBtn type="submit">Rechercher</SearchBtn>
          </SearchBox>
          <KeyHint>Appuyez sur / pour rechercher depuis n'importe où</KeyHint>
        </HeroSection>

        {/* 2 — Stats */}
        <StatsGrid aria-label="Résumé du compte">
          <StatCard>
            <StatValue>{totalItems}</StatValue>
            <StatLabel>Articles au panier</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>{nouveautesCount}</StatValue>
            <StatLabel>Nouveautés ce mois</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>
              {flashInfosCount}
              {flashInfosCount > 0 && <RedDot aria-hidden="true" />}
            </StatValue>
            <StatLabel>Flash infos non lus</StatLabel>
          </StatCard>
        </StatsGrid>

        {/* 3 — Raccourcis */}
        <ShortcutsGrid aria-label="Navigation rapide">
          <ShortcutCard to="/nouveautes" aria-label="Nouveautés">
            <IconPackage />
            <ShortcutLabel>Nouveautés</ShortcutLabel>
          </ShortcutCard>
          <ShortcutCard to="/fonds" aria-label="Fonds">
            <IconBooks />
            <ShortcutLabel>Fonds</ShortcutLabel>
          </ShortcutCard>
          <ShortcutCard to="/selections" aria-label="Sélections">
            <IconStar />
            <ShortcutLabel>Sélections</ShortcutLabel>
          </ShortcutCard>
          <ShortcutCard to="/historique" aria-label="Mon historique">
            <IconClipboard />
            <ShortcutLabel>Mon historique</ShortcutLabel>
          </ShortcutCard>
        </ShortcutsGrid>

        {/* 4 — Nouveautés du mois */}
        <NouveautesSection aria-label="Nouveautés du mois">
          <SectionHeader>
            <SectionTitle>Nouveautés du mois</SectionTitle>
            <SeeAllLink to="/nouveautes">Voir tout →</SeeAllLink>
          </SectionHeader>
          <CardScroll>
            {nouveautes.map(book => (
              <BookCard key={book.id}>
                <CoverWrapper
                  onClick={() => navigate(`/livre/${book.id}`)}
                  role="link"
                  aria-label={`Voir la fiche de ${book.title}`}
                >
                  <BookCover
                    isbn={book.isbn}
                    alt={book.title}
                    width={130}
                    height={178}
                    universe={book.universe}
                    authors={book.authors}
                    publisher={book.publisher}
                  />
                </CoverWrapper>
                <CardBody>
                  <BadgeRow>
                    <CategoryBadge>{book.universe}</CategoryBadge>
                    <NouveauteBadge>Nouveauté</NouveauteBadge>
                  </BadgeRow>
                  <BookTitle>{book.title}</BookTitle>
                  <BookAuthor>{book.authors[0]}</BookAuthor>
                  <Divider />
                  <PriceRow>
                    <Price>{book.priceTTC.toFixed(2).replace('.', ',')} €</Price>
                    <AddToCartBtn
                      onClick={e => handleAdd(e, book)}
                      aria-label={`Ajouter ${book.title} au panier`}
                    >
                      + Panier
                    </AddToCartBtn>
                  </PriceRow>
                </CardBody>
              </BookCard>
            ))}
          </CardScroll>

          {toast && (
            <Toast>
              <span>✓</span>« {toast.length > 30 ? toast.slice(0, 30) + '…' : toast} » ajouté au panier
            </Toast>
          )}
        </NouveautesSection>

      </Content>
    </Page>
  )
}
