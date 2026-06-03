import styled from 'styled-components'

export const StyledCard = styled.div`
  background-color: ${props => props.theme.surface};
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: ${props => props.padding || '20px'};
  margin: ${props => props.margin || '0'};
  border: 1px solid ${props => props.theme.cardBorder};
  overflow: hidden;
  color: ${props => props.theme.text};
`

export const CardHeader = styled.div`
  padding-bottom: 15px;
  margin-bottom: 15px;
  border-bottom: 1px solid ${props => props.theme.border};
`

export const CardFooter = styled.div`
  padding-top: 15px;
  margin-top: 15px;
  border-top: 1px solid ${props => props.theme.border};
`
