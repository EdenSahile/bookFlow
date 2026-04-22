import styled from 'styled-components'

const Banner = styled.aside`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.92);
  border-top: 1px solid rgba(35, 47, 62, 0.08);
  border-bottom: 1px solid rgba(35, 47, 62, 0.08);
  color: ${({ theme }) => theme.colors.gray[600]};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 12px;
  line-height: 1.4;
  text-align: center;
`

const Icon = styled.span`
  font-size: 14px;
  line-height: 1;
  flex-shrink: 0;
`

const Text = styled.span`
  max-width: 780px;
`

interface DemoBannerProps {
  className?: string
}

export function DemoBanner({ className }: DemoBannerProps) {
  return (
    <Banner className={className} role="note" aria-label="Information démonstration">
      <Icon aria-hidden="true">ℹ️</Icon>
      <Text>
        Site de démonstration — Toutes les données affichées (livres, librairies, commandes) sont fictives et créées à des fins pédagogiques uniquement.
      </Text>
    </Banner>
  )
}
