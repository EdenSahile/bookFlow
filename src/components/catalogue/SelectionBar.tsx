import { useState } from 'react'
import styled, { keyframes } from 'styled-components'
import type { Book } from '@/data/mockBooks'
import { useCart } from '@/contexts/CartContext'
import { useToast } from '@/components/ui/Toast'

/* ══════════════════════════════════════════════════════
   ANIMATION
══════════════════════════════════════════════════════ */

const slideUp = keyframes`
  from { transform: translateY(100%); opacity: 0; }
  to   { transform: translateY(0);    opacity: 1; }
`

/* ══════════════════════════════════════════════════════
   LAYOUT
══════════════════════════════════════════════════════ */

const Bar = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 200;
  background: #fff;
  border-top: 2px solid ${({ theme }) => theme.colors.navy};
  box-shadow: 0 -6px 30px rgba(28, 50, 82, 0.15);
  animation: ${slideUp} 0.22s ease-out;
  font-family: ${({ theme }) => theme.typography.fontFamily};
`

const Inner = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing.lg};
`

/* ── Bandeau titre ── */
const TopStrip = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0 6px;
  border-bottom: 1px solid #E6E1DA;
`

const SelectionCount = styled.span`
  font-size: 13px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.navy};

  b {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.navy};
    color: #fff;
    font-size: 11px;
    font-weight: 800;
    margin-right: 8px;
  }
`

const ClearBtn = styled.button`
  font-size: 11px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.gray[600]};
  background: none;
  border: none;
  cursor: pointer;
  padding: 2px 6px;
  border-radius: 4px;
  transition: color .12s, background .12s;

  &:hover {
    color: ${({ theme }) => theme.colors.navy};
    background: #F0EDE8;
  }
`

/* ── Rangée champs ── */
const FieldsRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 0 8px;
  flex-wrap: wrap;
`

const FieldGroup = styled.label`
  display: flex;
  flex-direction: column;
  gap: 3px;
  flex: 1;
  min-width: 140px;
  max-width: 220px;
`

const FieldLabel = styled.span`
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.gray[600]};
`

const FieldInput = styled.input`
  height: 32px;
  padding: 0 10px;
  border: 1px solid #D8D3CC;
  border-radius: 6px;
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 12px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.navy};
  background: #FAFAF8;
  transition: border-color .15s, box-shadow .15s;

  &::placeholder { color: ${({ theme }) => theme.colors.gray[400]}; }
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.navy};
    box-shadow: 0 0 0 3px rgba(28,50,82,.08);
    background: #fff;
  }
`

const FieldSelect = styled.select`
  height: 32px;
  padding: 0 28px 0 10px;
  border: 1px solid #D8D3CC;
  border-radius: 6px;
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 12px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.navy};
  background-color: #FAFAF8;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23706A62' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round' fill='none'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 9px center;
  cursor: pointer;
  transition: border-color .15s, box-shadow .15s;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.navy};
    box-shadow: 0 0 0 3px rgba(28,50,82,.08);
    background-color: #fff;
  }
`

const OptionalHint = styled.span`
  font-size: 9px;
  color: ${({ theme }) => theme.colors.gray[400]};
  font-weight: 400;
  margin-left: 3px;
`

const FieldDivider = styled.div`
  width: 1px;
  height: 36px;
  background: #E6E1DA;
  flex-shrink: 0;
  align-self: flex-end;
`

/* ── Rangée bas : prix + actions ── */
const BottomRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0 12px;
  border-top: 1px solid #E6E1DA;
  gap: 16px;
`

const PriceSummary = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
`

const PriceItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1px;
`

const PriceLabel = styled.span`
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.gray[400]};
`

const PriceValue = styled.span<{ $highlight?: boolean }>`
  font-size: ${({ $highlight }) => $highlight ? '16px' : '13px'};
  font-weight: ${({ $highlight }) => $highlight ? '800' : '600'};
  color: ${({ $highlight, theme }) => $highlight ? theme.colors.navy : theme.colors.gray[600]};
`

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
`

const CsvBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  height: 34px;
  padding: 0 14px;
  border: 1.5px solid #D8D3CC;
  border-radius: 6px;
  background: #fff;
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 11px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.gray[600]};
  cursor: pointer;
  transition: border-color .15s, color .15s, background .15s;
  white-space: nowrap;

  &:hover {
    border-color: ${({ theme }) => theme.colors.navy};
    color: ${({ theme }) => theme.colors.navy};
    background: #F5F3F0;
  }
`

const PreCartBtn = styled.button`
  height: 34px;
  padding: 0 16px;
  border: 1.5px dashed ${({ theme }) => theme.colors.gray[400]};
  border-radius: 6px;
  background: #FAFAF8;
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 11px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.gray[600]};
  cursor: not-allowed;
  white-space: nowrap;
  position: relative;

  &::after {
    content: 'Bientôt';
    position: absolute;
    top: -18px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 9px;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.gray[400]};
    white-space: nowrap;
    letter-spacing: 0.04em;
  }
`

const AddBtn = styled.button`
  height: 34px;
  padding: 0 20px;
  border: none;
  border-radius: 6px;
  background: ${({ theme }) => theme.colors.navy};
  color: #fff;
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  letter-spacing: 0.04em;
  white-space: nowrap;
  transition: background .15s, transform .1s;

  &:hover  { background: ${({ theme }) => theme.colors.navyHover}; }
  &:active { transform: scale(0.98); }
`

/* ══════════════════════════════════════════════════════
   HELPERS
══════════════════════════════════════════════════════ */

const TVA = 0.055

function downloadCsv(rows: string[][], filename: string) {
  const content = rows.map(r => r.map(cell => `"${cell.replace(/"/g, '""')}"`).join(',')).join('\n')
  const blob = new Blob(['\uFEFF' + content], { type: 'text/csv;charset=utf-8;' })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a')
  a.href     = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

/* ══════════════════════════════════════════════════════
   COMPOSANT
══════════════════════════════════════════════════════ */

interface Props {
  books: Book[]
  onClearAll: () => void
}

export function SelectionBar({ books, onClearAll }: Props) {
  const { addToCart } = useCart()
  const { showToast } = useToast()

  const [refCommande,  setRefCommande]  = useState('')
  const [codeFonds,    setCodeFonds]    = useState('')
  const [locationCode, setLocationCode] = useState('')
  const [acheteur,     setAcheteur]     = useState('')

  const count  = books.length
  const totalHT  = books.reduce((sum, b) => sum + b.priceTTC / (1 + TVA), 0)
  const tva      = totalHT * TVA
  const totalTTC = totalHT + tva

  function handleAddToCart() {
    books.forEach(b => addToCart(b, 1))
    showToast(`${count} ouvrage${count > 1 ? 's' : ''} ajouté${count > 1 ? 's' : ''} au panier`)
    onClearAll()
  }

  function handleExportCsv() {
    const header = ['ISBN', 'Titre', 'Prix TTC (€)', 'Référence commande', 'Code fonds', 'Location', 'Sélectionneur']
    const rows = books.map(b => [
      b.isbn,
      b.title,
      b.priceTTC.toFixed(2),
      refCommande,
      codeFonds,
      locationCode,
      acheteur,
    ])
    downloadCsv([header, ...rows], `selection-bookflow-${new Date().toISOString().slice(0,10)}.csv`)
    showToast('Export CSV téléchargé')
  }

  return (
    <Bar>
      <Inner>

        {/* Titre + clear */}
        <TopStrip>
          <SelectionCount>
            <b>{count}</b>
            {count > 1 ? 'ouvrages sélectionnés' : 'ouvrage sélectionné'}
          </SelectionCount>
          <ClearBtn onClick={onClearAll}>Tout désélectionner ×</ClearBtn>
        </TopStrip>

        {/* Champs de commande */}
        <FieldsRow>

          <FieldGroup>
            <FieldLabel>Réf. commande <OptionalHint>optionnel</OptionalHint></FieldLabel>
            <FieldInput
              placeholder="Ex : CMD-2026-042"
              value={refCommande}
              onChange={e => setRefCommande(e.target.value)}
            />
          </FieldGroup>

          <FieldDivider />

          <FieldGroup>
            <FieldLabel>Code fonds <OptionalHint>optionnel</OptionalHint></FieldLabel>
            <FieldInput
              placeholder="Ex : FD-LIT-001"
              value={codeFonds}
              onChange={e => setCodeFonds(e.target.value)}
            />
          </FieldGroup>

          <FieldDivider />

          <FieldGroup>
            <FieldLabel>Location code <OptionalHint>optionnel</OptionalHint></FieldLabel>
            <FieldInput
              placeholder="Ex : A-12-3"
              value={locationCode}
              onChange={e => setLocationCode(e.target.value)}
            />
          </FieldGroup>

          <FieldDivider />

          <FieldGroup style={{ maxWidth: 160 }}>
            <FieldLabel>Acheteur <OptionalHint>optionnel</OptionalHint></FieldLabel>
            <FieldSelect value={acheteur} onChange={e => setAcheteur(e.target.value)}>
              <option value="">— Choisir —</option>
              <option value="Marie">Marie</option>
              <option value="Thomas">Thomas</option>
              <option value="Julien">Julien</option>
            </FieldSelect>
          </FieldGroup>

        </FieldsRow>

        {/* Prix + actions */}
        <BottomRow>

          <PriceSummary>
            <PriceItem>
              <PriceLabel>{count} titre{count > 1 ? 's' : ''}</PriceLabel>
              <PriceValue>sélectionné{count > 1 ? 's' : ''}</PriceValue>
            </PriceItem>
            <PriceItem>
              <PriceLabel>Total HT</PriceLabel>
              <PriceValue>{totalHT.toFixed(2)} €</PriceValue>
            </PriceItem>
            <PriceItem>
              <PriceLabel>TVA 5,5%</PriceLabel>
              <PriceValue>{tva.toFixed(2)} €</PriceValue>
            </PriceItem>
            <PriceItem>
              <PriceLabel>Total TTC</PriceLabel>
              <PriceValue $highlight>{totalTTC.toFixed(2)} €</PriceValue>
            </PriceItem>
          </PriceSummary>

          <Actions>
            <CsvBtn onClick={handleExportCsv}>
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <path d="M6.5 1v7m0 0L4 6m2.5 2L9 6M2 10h9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Export CSV
            </CsvBtn>

            <PreCartBtn disabled title="Fonctionnalité à venir">
              Pré-panier
            </PreCartBtn>

            <AddBtn onClick={handleAddToCart}>
              Ajouter au panier →
            </AddBtn>
          </Actions>

        </BottomRow>

      </Inner>
    </Bar>
  )
}
