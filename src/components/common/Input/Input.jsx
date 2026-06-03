import React from 'react'
import { InputContainer, StyledLabel, StyledInput, ErrorText } from './Input.styles'

export const Input = React.forwardRef(({ label, error, ...props }, ref) => {
  return (
    <InputContainer>
      {label && <StyledLabel>{label}</StyledLabel>}
      <StyledInput ref={ref} error={!!error} {...props} />
      {error && <ErrorText>{error}</ErrorText>}
    </InputContainer>
  )
})

Input.displayName = 'Input'
