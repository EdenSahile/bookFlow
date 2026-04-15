import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import type { Book, Universe } from '@/data/mockBooks'
import { BookCover } from './BookCover'
import { useCart } from '@/contexts/CartContext'
import { useToast } from '@/components/ui/Toast'

/* ══════════════════════════════════════════════════════
   TYPES & DONNÉES
══════════════════════════════════════════════════════ */

interface EbookOption {
  hebergeur: string
  format: string
  price: number
  isbnEbook: string
  droits: { lectureEnLigne: boolean; telechargement: boolean; copierColler: boolean; impression: boolean }
  partenaireLabel: string
  partenaireColor: string
}

type Mode = 'print' | 'ebook'

const EBOOK_OPTIONS: Record<Universe, EbookOption[]> = {
  'Littérature': [
    { hebergeur: 'Amalivre',  format: 'PDF',          price: 6.99, isbnEbook: '9782072886PDF', droits: { lectureEnLigne: true,  telechargement: true,  copierColler: true,  impression: false }, partenaireLabel: 'Amalivre',  partenaireColor: '#C47B0A' },
    { hebergeur: 'OpenEdition', format: 'HTML/PDF/EPUB', price: 6.99, isbnEbook: '9782072886EPB', droits: { lectureEnLigne: true,  telechargement: true,  copierColler: false, impression: false }, partenaireLabel: 'OpenEdition', partenaireColor: '#D4500A' },
    { hebergeur: 'Cairn',       format: 'HTML/PDF/EPUB', price: 4.99, isbnEbook: '9782072886CRN', droits: { lectureEnLigne: true,  telechargement: false, copierColler: false, impression: false }, partenaireLabel: 'Cairn',       partenaireColor: '#1A5E8A' },
  ],
  'BD/Mangas': [
    { hebergeur: 'Numilog', format: 'PDF/EPUB', price: 8.99, isbnEbook: '9782756001PDF', droits: { lectureEnLigne: true, telechargement: true, copierColler: true,  impression: false }, partenaireLabel: 'Numilog', partenaireColor: '#2D7A3A' },
    { hebergeur: 'Izneo',   format: 'HTML/PDF',  price: 7.49, isbnEbook: '9782756001IZN', droits: { lectureEnLigne: true, telechargement: true, copierColler: false, impression: false }, partenaireLabel: 'Izneo',   partenaireColor: '#6B3FA0' },
  ],
  'Jeunesse': [
    { hebergeur: 'Numilog',    format: 'PDF/EPUB',      price: 5.99, isbnEbook: '9782070636PDF', droits: { lectureEnLigne: true, telechargement: true,  copierColler: true,  impression: false }, partenaireLabel: 'Numilog',    partenaireColor: '#2D7A3A' },
    { hebergeur: 'OpenEdition',format: 'HTML/PDF/EPUB', price: 4.99, isbnEbook: '9782070636EPB', droits: { lectureEnLigne: true, telechargement: false, copierColler: false, impression: false }, partenaireLabel: 'OpenEdition',partenaireColor: '#D4500A' },
  ],
  'Adulte-pratique': [
    { hebergeur: 'Cairn',   format: 'PDF',      price: 9.99, isbnEbook: '9782035000PDF', droits: { lectureEnLigne: true, telechargement: true, copierColler: true,  impression: true  }, partenaireLabel: 'Cairn',   partenaireColor: '#1A5E8A' },
    { hebergeur: 'Numilog', format: 'PDF/EPUB', price: 8.49, isbnEbook: '9782035000EPB', droits: { lectureEnLigne: true, telechargement: true, copierColler: false, impression: false }, partenaireLabel: 'Numilog', partenaireColor: '#2D7A3A' },
  ],
}

const CLASSIF: Record<Universe, [string, string][]> = {
  'Littérature':     [['843', 'Romans et nouvelles français'], ['PQ', 'Romance Literatures French lit.'], ['050', 'Bibliothèques publiques']],
  'BD/Mangas':       [['741.5', 'Bandes dessinées, comics'],  ['PN', 'Arts graphiques narratifs']],
  'Jeunesse':        [['028.5', 'Litt. pour la jeunesse'],     ['PZ', 'Fiction et poésie jeunesse']],
  'Adulte-pratique': [['640', 'Arts ménagers, vie pratique'],  ['TX', 'Cuisine, gastronomie, loisirs']],
}

const AWARDS: Record<Universe, string[]> = {
  'Littérature':     ['Prix Cinq Continents de la Francophonie 2024 – Prix des Libraires 2024'],
  'BD/Mangas':       ["Fauve d'Angoulême — Sélection officielle 2024"],
  'Jeunesse':        ['Prix Sorcières 2024 – Prix des Incorruptibles'],
  'Adulte-pratique': ['Sélection Fnac Pratique 2024'],
}

const TYPE_META: Record<string, { label: string; bg: string; color: string }> = {
  nouveaute:    { label: 'NV', bg: '#FEF5E0', color: '#B8740A' },
  'a-paraitre': { label: 'AP', bg: '#EEE8FF', color: '#5B33C1' },
  fonds:        { label: 'FC', bg: '#E8F5EE', color: '#1E7045' },
}

function fictiveId(isbn: string) {
  return parseInt(isbn.replace(/\D/g, '').slice(-6), 10).toString()
}

/* ══════════════════════════════════════════════════════
   STYLED COMPONENTS
══════════════════════════════════════════════════════ */

const Card = styled.article<{ $mode: Mode }>`
  background: ${({ $mode }) => $mode === 'ebook' ? '#EDF4FF' : '#FFFFFF'};
  border: 1px solid ${({ $mode }) => $mode === 'ebook' ? '#BEDAFF' : '#E6E1DA'};
  border-radius: 8px;
  overflow: hidden;
  font-family: ${({ theme }) => theme.typography.fontFamily};
  transition: box-shadow 0.15s, background-color 0.25s, border-color 0.25s;

  &:hover { box-shadow: 0 4px 16px rgba(28,50,82,0.10); }
`

/* ── Rangée principale : sidebar cover + grille 3 cols ── */
const MainRow = styled.div`
  display: flex;
  cursor: pointer;
`

const CoverSidebar = styled.div`
  width: 150px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 16px 16px 12px;
  border-right: 1px solid #E6E1DA;
  gap: 10px;
`

const CoverDots = styled.div`
  display: flex;
  gap: 4px;
`

const Dot = styled.span<{ $active?: boolean }>`
  width: 6px; height: 6px;
  border-radius: 50%;
  background: ${({ $active, theme }) => $active ? theme.colors.navy : theme.colors.gray[200]};
`

/* Grille 3 colonnes ÉGALES */
const TextGrid = styled.div`
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  min-width: 0;
`

const Col = styled.div<{ $border?: boolean }>`
  padding: 12px 16px;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 3px;
  border-left: ${({ $border }) => $border ? '1px solid #E6E1DA' : 'none'};
`

/* ── Col 1 : bibliographie ── */
const BookTitle = styled.h3`
  font-size: 13px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.navy};
  line-height: 1.3;
  text-decoration: underline;
  text-underline-offset: 2px;
  margin-bottom: 1px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`

const Authors = styled.p`
  font-size: 12px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.gray[800]};
  margin-bottom: 3px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const MetaLine = styled.p`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.gray[600]};
  line-height: 1.5;
`

const MetaItalic = styled(MetaLine)`
  font-style: italic;
  color: ${({ theme }) => theme.colors.gray[400]};
`

const IsbnLine = styled.p`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.gray[600]};
  margin-top: 2px;
  letter-spacing: 0.01em;
`

/* ── Col 2 : classifications ── */
const ClassifItem = styled.p`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.gray[600]};
  line-height: 1.5;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const ClassifCode = styled.b`
  font-weight: 700;
  color: ${({ theme }) => theme.colors.navy};
  margin-right: 4px;
`

/* ── Col 3 : badge + avis + partenaire + droits ── */
const BadgeRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 5px;
`

const TypeBadge = styled.span<{ $bg: string; $color: string }>`
  font-size: 10px;
  font-weight: 700;
  background: ${({ $bg }) => $bg};
  color: ${({ $color }) => $color};
  border-radius: 3px;
  padding: 2px 7px;
  letter-spacing: 0.05em;
`

const EbookBadge = styled.span`
  font-size: 10px;
  font-weight: 700;
  background: ${({ theme }) => theme.colors.success};
  color: #fff;
  border-radius: 3px;
  padding: 2px 7px;
  letter-spacing: 0.05em;
`

const IdText = styled.span`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.gray[400]};
`

const StarsLine = styled.p`
  font-size: 11px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  line-height: 1.4;
`

const AwardLine = styled.p`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.gray[600]};
  font-style: italic;
  line-height: 1.4;
`

/* Lien partenaire — visible, coloré, avec icône */
const PartenaireLink = styled.a<{ $color: string }>`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  margin-top: 8px;
  align-self: flex-start;
  padding: 4px 10px;
  border-radius: 20px;
  background: ${({ $color }) => $color}15;
  border: 1px solid ${({ $color }) => $color}40;
  font-size: 11px;
  font-weight: 600;
  color: ${({ $color }) => $color};
  text-decoration: none;
  cursor: pointer;
  transition: background .12s, transform .1s;
  white-space: nowrap;

  &:hover {
    background: ${({ $color }) => $color}25;
    transform: translateY(-1px);
  }

  svg { flex-shrink: 0; }
`

/* Droits d'usage */
const DroitsWrap = styled.div`
  margin-top: 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
`

const DroitItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`

const DroitDot = styled.span<{ $ok: boolean }>`
  width: 8px; height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
  background: ${({ $ok, theme }) => $ok ? theme.colors.success : theme.colors.error};
`

const DroitLabel = styled.span`
  font-size: 10.5px;
  color: ${({ theme }) => theme.colors.gray[600]};
`

/* ── Barre de commande ── */
const OrderBar = styled.div`
  display: flex;
  align-items: center;
  gap: 0;
  padding: 0 14px;
  height: 38px;
  border-top: 1px solid #E6E1DA;
  background: #FAFAF8;
`

const AvailStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  padding-right: 12px;
  flex-shrink: 0;
`

const GreenDot = styled.span`
  width: 7px; height: 7px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.success};
`

const AvailText = styled.span`
  font-size: 11px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.success};
`

const VLine = styled.span`
  width: 1px; height: 18px;
  background: #E6E1DA;
  flex-shrink: 0;
`

/* Wrapper centré pour le dropdown */
const FormatSelectWrap = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 12px;
`

/* Select format — taille fixe, centré */
const FormatSelect = styled.select`
  width: 240px;
  height: 30px;
  padding: 0 32px 0 12px;
  border: 1px solid #D8D3CC;
  border-radius: 6px;
  background-color: #fff;
  color: ${({ theme }) => theme.colors.navy};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 6 5-6' stroke='%23706A62' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round' fill='none'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 10px center;
  transition: border-color .15s, box-shadow .15s;

  &:hover  { border-color: ${({ theme }) => theme.colors.navy}; }
  &:focus  { outline: none; border-color: ${({ theme }) => theme.colors.navy}; box-shadow: 0 0 0 3px rgba(28,50,82,.10); }

  option { font-weight: 600; padding: 6px; }
`

const RightControls = styled.div`
  display: flex;
  align-items: center;
  gap: 0;
  padding-left: 12px;
  border-left: 1px solid #E6E1DA;
`

const CtrlItem = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 0 12px;
  border-right: 1px solid #E6E1DA;

  &:last-child { border-right: none; }
`

const CheckBox = styled.input`
  width: 14px; height: 14px;
  cursor: pointer;
  accent-color: ${({ theme }) => theme.colors.navy};
`

const CtrlLabel = styled.span`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.gray[600]};
`

const QtyInput = styled.input`
  width: 34px; height: 22px;
  border: 1px solid #E6E1DA;
  border-radius: 3px;
  text-align: center;
  font-size: 12px;
  font-weight: 600;
  font-family: ${({ theme }) => theme.typography.fontFamily};
  color: ${({ theme }) => theme.colors.navy};
  background: #fff;

  &:focus { outline: none; border-color: ${({ theme }) => theme.colors.navy}; }
  &::-webkit-inner-spin-button { display: none; }
`

const AmBtn = styled.button`
  padding: 5px 14px;
  border: none;
  border-radius: 4px;
  background: ${({ theme }) => theme.colors.navy};
  color: #fff;
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
  letter-spacing: 0.06em;
  transition: background .15s;
  white-space: nowrap;

  &:hover { background: ${({ theme }) => theme.colors.navyHover}; }
`


/* ══════════════════════════════════════════════════════
   COMPOSANT
══════════════════════════════════════════════════════ */

interface Props {
  book: Book
  selected: boolean
  onToggle: () => void
}

export function BookCardRow({ book, selected, onToggle }: Props) {
  const navigate      = useNavigate()
  const { addToCart } = useCart()
  const { showToast } = useToast()

  const [mode, setMode]           = useState<Mode>('print')
  const [selectedEbook, setEbook] = useState<EbookOption | null>(null)
  const [qty, setQty]             = useState(1)

  const isOrderable = book.type !== 'a-paraitre'
  const badge       = TYPE_META[book.type] ?? TYPE_META['fonds']
  const classif     = CLASSIF[book.universe] ?? []
  const awards      = AWARDS[book.universe] ?? []
  const ebookOpts   = EBOOK_OPTIONS[book.universe] ?? []
  const bookId      = fictiveId(book.isbn)
  const pubYear     = book.publicationDate.slice(0, 4)
  const isReed      = book.publicationDate < '2023-01-01'

  const authorsStr = book.authors.map(a => {
    const parts = a.split(' ')
    return parts.length > 1 ? `${parts.at(-1)}, ${parts.slice(0,-1).join(' ')}` : a
  }).join(' ; ')

  function handleFormatChange(e: React.ChangeEvent<HTMLSelectElement>) {
    e.stopPropagation()
    const val = e.target.value
    if (val === 'print') { setMode('print'); setEbook(null) }
    else {
      const opt = ebookOpts[parseInt(val, 10)]
      if (opt) { setMode('ebook'); setEbook(opt) }
    }
  }

  function handleAdd(e: React.MouseEvent) {
    e.stopPropagation()
    addToCart(book, mode === 'print' ? qty : 1)
    showToast(mode === 'ebook' && selectedEbook
      ? `${selectedEbook.hebergeur} — ${selectedEbook.format} ajouté au panier`
      : 'Ouvrage ajouté au panier')
    setQty(1)
  }

  const isbnDisplay = mode === 'ebook' && selectedEbook
    ? `${selectedEbook.isbnEbook} (${selectedEbook.format})`
    : book.isbn


  return (
    <Card $mode={mode}>

      {/* ── Rangée principale ── */}
      <MainRow onClick={() => navigate(`/livre/${book.id}`)}>

        {/* Sidebar couverture */}
        <CoverSidebar>
          <BookCover isbn={book.isbn} alt={book.title} width={110} height={154} />
          <CoverDots><Dot $active /><Dot /></CoverDots>
        </CoverSidebar>

        {/* 3 colonnes égales */}
        <TextGrid>

          {/* Col 1 — Bibliographie */}
          <Col>
            <BookTitle>{book.title}</BookTitle>
            <Authors>{authorsStr}</Authors>
            <MetaLine>Paris, France : {book.publisher}, {pubYear}</MetaLine>
            {isReed && <MetaLine>Rééd.</MetaLine>}
            {book.pages && <MetaLine>{book.pages} p. – en français</MetaLine>}
            {book.collection && <MetaItalic>({book.collection})</MetaItalic>}
            <IsbnLine>ISBN {isbnDisplay}</IsbnLine>
          </Col>

          {/* Col 2 — Classifications */}
          <Col $border>
            {classif.map(([code, label]) => (
              <ClassifItem key={code}>
                <ClassifCode>[{code}]</ClassifCode>{label}
              </ClassifItem>
            ))}
          </Col>

          {/* Col 3 — Badge, étoiles, avis, droits, partenaire */}
          <Col $border>
            <BadgeRow>
              {mode === 'ebook'
                ? <EbookBadge>EBOOK</EbookBadge>
                : <TypeBadge $bg={badge.bg} $color={badge.color}>{badge.label}</TypeBadge>
              }
              <IdText>ID : {mode === 'ebook' ? '000000' : bookId}</IdText>
            </BadgeRow>

            <StarsLine>★★★ Reviewed by Amalivre</StarsLine>
            {awards.map((a, i) => <AwardLine key={i}>{a}</AwardLine>)}

            {mode === 'ebook' && selectedEbook?.droits && (
              <DroitsWrap>
                {([
                  [selectedEbook.droits.lectureEnLigne,  'Lecture en ligne'],
                  [selectedEbook.droits.telechargement,  'Téléchargement'],
                  [selectedEbook.droits.copierColler,    'Copier/coller'],
                  [selectedEbook.droits.impression,      selectedEbook.droits.impression ? 'Impression' : 'Impression indisponible'],
                ] as [boolean, string][]).map(([ok, label], i) => (
                  <DroitItem key={i}>
                    <DroitDot $ok={ok} />
                    <DroitLabel>{label}</DroitLabel>
                  </DroitItem>
                ))}
              </DroitsWrap>
            )}

            {mode === 'ebook' && selectedEbook && (
              <PartenaireLink
                $color={selectedEbook.partenaireColor}
                onClick={e => e.stopPropagation()}
                href="#"
              >
                <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                  <path d="M5.5 2H2a1 1 0 00-1 1v6a1 1 0 001 1h6a1 1 0 001-1V5.5M7 1h3m0 0v3m0-3L5 6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                En partenariat avec {selectedEbook.partenaireLabel}
              </PartenaireLink>
            )}
          </Col>

        </TextGrid>
      </MainRow>

      {/* ── Barre de commande ── */}
      <OrderBar>

        {/* Statut disponibilité */}
        <AvailStatus>
          <GreenDot />
          <AvailText>{isOrderable ? 'Available' : 'À paraître'}</AvailText>
        </AvailStatus>

        <VLine />

        {/* ─ Select format — centré, taille fixe ─ */}
        <FormatSelectWrap>
          <FormatSelect
            value={mode === 'print' ? 'print' : String(ebookOpts.findIndex(o => o.hebergeur === selectedEbook?.hebergeur))}
            onChange={handleFormatChange}
            onClick={e => e.stopPropagation()}
          >
            <option value="print">PRINT — {book.priceTTC.toFixed(2)} €</option>
            {ebookOpts.map((opt, i) => (
              <option key={i} value={String(i)}>
                {opt.hebergeur} · {opt.format} — {opt.price.toFixed(2)} €
              </option>
            ))}
          </FormatSelect>
        </FormatSelectWrap>

        <VLine />

        {/* Contrôles droite */}
        {isOrderable && (
          <RightControls onClick={e => e.stopPropagation()}>
            <CtrlItem>
              <CheckBox
                type="checkbox"
                checked={selected}
                onChange={onToggle}
                id={`sel-${book.id}`}
              />
              <CtrlLabel as="label" htmlFor={`sel-${book.id}`} style={{ cursor: 'pointer' }}>
                Select
              </CtrlLabel>
            </CtrlItem>

            {mode === 'print' && (
              <CtrlItem>
                <CtrlLabel>Qty</CtrlLabel>
                <QtyInput
                  type="number"
                  min={1}
                  value={qty}
                  onChange={e => setQty(Math.max(1, parseInt(e.target.value) || 1))}
                />
              </CtrlItem>
            )}

            <CtrlItem>
              <AmBtn onClick={handleAdd}>A M</AmBtn>
            </CtrlItem>
          </RightControls>
        )}
      </OrderBar>
    </Card>
  )
}
