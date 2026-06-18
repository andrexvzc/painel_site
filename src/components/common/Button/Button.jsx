import { StyledButton } from './Button.styles'

export const Button = ({ children, variant = 'primary', type = 'button', ...props }) => {
  return (
    <StyledButton variant={variant} type={type} {...props}>
      {children}
    </StyledButton>
  )
}
