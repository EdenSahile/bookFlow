import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import type { Book } from '@/data/mockBooks'
import { BookCover } from './BookCover'
import { TextBadge } from '@/components/ui/Badge'

const Card = styled.article`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.radii.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  overflow: hidden;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  transition: box-shadow 0.15s, transform 0.15s;

  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.md};
    transform: translateY(-2px);
  }
`

const CoverArea = styled.div`
  display: flex;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.md} 0;
`

const Body = styled.div`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.md};
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
`

const Title = styled.h3`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  color: ${({ theme }) => theme.colors.navy};
  line-height: ${({ theme }) => theme.typography.lineHeights.tight};
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`

const Authors = styled.p`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  color: ${({ theme }) => theme.colors.gray[600]};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const Publisher = styled.p`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  color: ${({ theme }) => theme.colors.gray[400]};
`

const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
  padding-top: ${({ theme }) => theme.spacing.sm};
`

const Price = styled.span`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.sizes.md};
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  color: ${({ theme }) => theme.colors.navy};
`

const universeBadgeColor: Record<string, string> = {
  'Littérature': '#1E3A5F',
  'BD/Mangas': '#E65100',
  'Jeunesse': '#1565C0',
  'Adulte-pratique': '#2E7D32',
}

const UniverseDot = styled.span<{ $color: string }>`
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
  flex-shrink: 0;
`

const UniverseLabel = styled.span`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  color: ${({ theme }) => theme.colors.gray[600]};
`

const TopRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  margin-bottom: 2px;
`

interface Props {
  book: Book
  showType?: boolean
}

export function BookCard({ book, showType = false }: Props) {
  const navigate = useNavigate()

  return (
    <Card onClick={() => navigate(`/livre/${book.id}`)} role="button" tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && navigate(`/livre/${book.id}`)}>
      <CoverArea>
        <BookCover src={book.coverUrl} alt={`Couverture de ${book.title}`} width={90} height={130} />
      </CoverArea>

      <Body>
        <TopRow>
          <UniverseDot $color={universeBadgeColor[book.universe] ?? '#999'} />
          <UniverseLabel>{book.universe}</UniverseLabel>
          {showType && book.type === 'nouveaute' && (
            <TextBadge variant="new" style={{ marginLeft: 'auto' }}>Nouveau</TextBadge>
          )}
        </TopRow>

        <Title>{book.title}</Title>
        <Authors>{book.authors.join(', ')}</Authors>
        <Publisher>{book.publisher}{book.collection ? ` — ${book.collection}` : ''}</Publisher>

        <Footer>
          <Price>{book.priceTTC.toFixed(2)} €</Price>
          {book.type === 'a-paraitre' && (
            <TextBadge variant="top" style={{ background: '#E65100', color: '#fff', fontSize: '10px' }}>
              À paraître
            </TextBadge>
          )}
        </Footer>
      </Body>
    </Card>
  )
}
