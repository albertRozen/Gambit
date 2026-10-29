import styled, { css } from 'styled-components'

const variantStyles = {
  primary: css`
    border: 1px solid ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.onPrimary};
    background: ${({ theme }) => theme.colors.primary};

    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.colors.primaryHover};
    }
  `,
  secondary: css`
    border: 1px solid ${({ theme }) => theme.colors.border};
    color: ${({ theme }) => theme.colors.text};
    background: ${({ theme }) => theme.colors.surface};

    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.colors.background};
    }
  `,
  link: css`
    height: auto;
    padding: 0;
    border: 0;
    color: inherit;
    background: none;

    &:hover:not(:disabled) {
      text-decoration: underline;
    }
  `,
  danger: css`
    border: 1px solid ${({ theme }) => theme.colors.danger};
    color: ${({ theme }) => theme.colors.onPrimary};
    background: ${({ theme }) => theme.colors.danger};

    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.colors.dangerHover};
    }
  `,
}

export const Button = styled.button<{
  $variant?: keyof typeof variantStyles
}>`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.space.sm};
  height: ${({ theme }) => theme.sizes.control};
  padding: 0 ${({ theme }) => theme.space.lg};
  border-radius: ${({ theme }) => theme.radii.md};
  font: inherit;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 120ms ease;

  ${({ $variant = 'secondary' }) => variantStyles[$variant]}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.focus};
    outline-offset: 2px;
  }
`
