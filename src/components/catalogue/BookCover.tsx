import { useState } from 'react'
import styled from 'styled-components'

const Wrapper = styled.div<{ $width: number; $height: number }>`
  width: ${({ $width }) => $width}px;
  height: ${({ $height }) => $height}px;
  border-radius: ${({ theme }) => theme.radii.md};
  overflow: hidden;
  background-color: ${({ theme }) => theme.colors.navyLight};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`

const Img = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`

const Placeholder = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 8px;
  text-align: center;
  color: ${({ theme }) => theme.colors.navy};
  opacity: 0.4;
  font-size: 1.5rem;
`

interface Props {
  src: string
  alt: string
  width?: number
  height?: number
}

export function BookCover({ src, alt, width = 80, height = 120 }: Props) {
  const [error, setError] = useState(false)

  if (error) {
    return (
      <Wrapper $width={width} $height={height}>
        <Placeholder>📖</Placeholder>
      </Wrapper>
    )
  }

  return (
    <Wrapper $width={width} $height={height}>
      <Img src={src} alt={alt} loading="lazy" onError={() => setError(true)} />
    </Wrapper>
  )
}
