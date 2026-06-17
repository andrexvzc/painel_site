import styled from 'styled-components'

export const Container = styled.div`
  width: 100%;
  max-width: ${props => props.maxWidth || '1200px'};
  margin: 0 auto;
  padding: 0 15px;
`

export const Flex = styled.div`
  display: flex;
  flex-direction: ${props => props.direction || 'row'};
  justify-content: ${props => props.justify || 'flex-start'};
  align-items: ${props => props.align || 'stretch'};
  gap: ${props => props.gap || '0'};
  flex-wrap: ${props => props.wrap || 'nowrap'};
`

export const Grid = styled.div`
  display: grid;
  grid-template-columns: ${props => props.columns || 'repeat(12, 1fr)'};
  gap: ${props => props.gap || '20px'};
  align-items: ${props => props.align || 'stretch'};
`
