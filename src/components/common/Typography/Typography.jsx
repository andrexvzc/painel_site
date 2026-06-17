import { StyledTypography } from './Typography.styles'

export const Typography = ({ 
  children, 
  variant = 'body', 
  component, 
  color, 
  align, 
  ...props 
}) => {
  // Map variant to default HTML tags if component is not provided
  const tagMap = {
    h1: 'h1',
    h2: 'h2',
    h3: 'h3',
    h4: 'h4',
    body: 'p',
    small: 'small'
  }

  const as = component || tagMap[variant] || 'div'

  return (
    <StyledTypography as={as} variant={variant} color={color} align={align} {...props}>
      {children}
    </StyledTypography>
  )
}
