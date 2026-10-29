import { useLayoutEffect, useRef, type ReactNode } from 'react'
import styled from 'styled-components'
import { IconButton } from './IconButton.tsx'
import { CloseIcon } from './icons.tsx'

interface DialogProps {
  title: string
  description?: string
  onClose: () => void
  children: ReactNode
}

export const Dialog = ({
  title,
  description,
  onClose,
  children,
}: DialogProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useLayoutEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) {
      return
    }
    if (!dialog.open) {
      dialog.showModal()
    }
    return () => dialog.close()
  }, [])

  return (
    <Root
      ref={dialogRef}
      closedby="any"
      onClose={() => {
        if (!dialogRef.current?.open) {
          onClose()
        }
      }}
    >
      <Content>
        <Header>
          <Title>{title}</Title>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Header>
        {description && <Description>{description}</Description>}
        {children}
      </Content>
    </Root>
  )
}

const Root = styled.dialog.withConfig({
  shouldForwardProp: () => true,
})`
  width: min(110rem, calc(100vw - 8rem));
  max-height: calc(100vh - 16rem);
  padding: 0;
  border: 0;
  border-radius: ${({ theme }) => theme.radii.lg};
  color: ${({ theme }) => theme.colors.text};
  background: ${({ theme }) => theme.colors.surface};
  box-shadow: ${({ theme }) => theme.shadows.lg};

  &::backdrop {
    background: ${({ theme }) => theme.colors.overlay};
  }
`

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.lg};
  padding: ${({ theme }) => theme.space.xl};
`

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.space.md};
`

const Title = styled.h2`
  margin: 0;
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: 600;
`

const Description = styled.p`
  margin: -${({ theme }) => theme.space.sm} 0 0;
  color: ${({ theme }) => theme.colors.textMuted};
`
