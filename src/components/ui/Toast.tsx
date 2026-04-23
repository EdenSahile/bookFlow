import styled, { keyframes, css } from 'styled-components'

const slideDown = keyframes`
  from { opacity: 0; transform: translateY(-20px) translateX(-50%); }
  to   { opacity: 1; transform: translateY(0)     translateX(-50%); }
`

const slideUp = keyframes`
  from { opacity: 1; transform: translateY(0)     translateX(-50%); }
  to   { opacity: 0; transform: translateY(-20px) translateX(-50%); }
`

export type ToastType = 'success' | 'error'

export const ToastBox = styled.div<{ $leaving: boolean; $type: ToastType }>`
  position: fixed;
  top: 72px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;

  background: ${({ $type, theme }) => $type === 'error' ? theme.colors.error : theme.colors.navy};
  color: ${({ theme }) => theme.colors.white};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  font-weight: ${({ theme }) => theme.typography.weights.semibold};
  padding: 12px 24px;
  border-radius: ${({ theme }) => theme.radii.full};
  white-space: nowrap;
  pointer-events: none;
  max-width: 90vw;
  text-align: center;

  animation: ${({ $leaving }) => css`${$leaving ? slideUp : slideDown} .25s ease forwards`};
`
