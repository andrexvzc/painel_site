import styled from 'styled-components'

export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  display: flex;
  flex-direction: column;
  gap: 32px;
`

export const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 24px;
  border: 1px solid #eee;
  border-radius: 8px;
  background-color: #f9f9f9;
`

export const Title = styled.h1`
  color: #333;
  font-size: 2.5rem;
  margin-bottom: 8px;
`

export const SubTitle = styled.h2`
  color: #666;
  font-size: 1.5rem;
`

export const ButtonGrid = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`

export const StatusText = styled.p`
  margin-top: 12px;
  font-weight: 500;
  color: ${props => (props.active ? '#28a745' : '#dc3545')};
`
