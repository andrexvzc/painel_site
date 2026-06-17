import styled from 'styled-components'

export const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
  width: 100%;
`

export const StyledLabel = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${props => props.theme.text};
`

export const StyledInput = styled.input`
  padding: 10px 12px;
  border-radius: 4px;
  border: 1px solid ${props => (props.error ? '#dc3545' : props.theme.border)};
  background-color: ${props => props.theme.surface};
  color: ${props => props.theme.text};
  font-size: 1rem;
  outline: none;
  transition: border-color 0.2s;

  &:focus {
    border-color: ${props => (props.error ? '#dc3545' : props.theme.primary)};
  }

  &:disabled {
    background-color: ${props => props.theme.sidebarHover};
    cursor: not-allowed;
  }

  &::placeholder {
    color: ${props => props.theme.textSecondary};
  }
`

export const ErrorText = styled.span`
  font-size: 0.75rem;
  color: #dc3545;
`
