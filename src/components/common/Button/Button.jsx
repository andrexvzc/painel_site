import { StyledButton } from './Button.styles'

export const Button = ({ children, variant = 'primary', onClick, disabled }) => {
  return (
    <StyledButton variant={variant} onClick={onClick} disabled={disabled}>
      {children}
    </StyledButton>
  )
}
