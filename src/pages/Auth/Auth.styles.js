import styled from 'styled-components'

export const Wrapper = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.theme.background};
  padding: 20px;
`

export const Box = styled.form`
  width: 100%;
  max-width: 380px;
  background-color: ${props => props.theme.surface};
  border: 1px solid ${props => props.theme.cardBorder};
  border-radius: 16px;
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 4px;
`

export const Brand = styled.h1`
  color: ${props => props.theme.primary};
  font-size: 1.75rem;
  margin: 0 0 4px;
  text-align: center;
`

export const Subtitle = styled.p`
  color: ${props => props.theme.textSecondary};
  text-align: center;
  margin: 0 0 24px;
  font-size: 0.95rem;
`

export const ErrorBox = styled.div`
  background-color: rgba(220, 53, 69, 0.1);
  color: #dc3545;
  border: 1px solid rgba(220, 53, 69, 0.3);
  border-radius: 8px;
  padding: 10px 12px;
  font-size: 0.875rem;
  margin-bottom: 12px;
`

export const Footer = styled.p`
  text-align: center;
  margin-top: 20px;
  font-size: 0.9rem;
  color: ${props => props.theme.textSecondary};

  a {
    color: ${props => props.theme.primary};
    font-weight: 600;
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }
`
