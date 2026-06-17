import { StyledCard } from './Card.styles'

export const Card = ({ children, padding, margin, ...props }) => {
  return (
    <StyledCard padding={padding} margin={margin} {...props}>
      {children}
    </StyledCard>
  )
}
