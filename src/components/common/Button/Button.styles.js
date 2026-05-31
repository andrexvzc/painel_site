import styled from 'styled-components'

export const StyledButton = styled.button`
  padding: 10px 20px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  font-weight: 600;
  transition: opacity 0.2s;

  background-color: ${props => (props.variant === 'primary' ? '#007bff' : '#6c757d')};
  color: white;

  &:hover {
    opacity: 0.9;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`
