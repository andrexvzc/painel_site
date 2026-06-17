import styled, { css } from 'styled-components'

const variantStyles = {
  h1: css`
    font-size: 2.5rem;
    font-weight: 700;
  `,
  h2: css`
    font-size: 2rem;
    font-weight: 600;
  `,
  h3: css`
    font-size: 1.75rem;
    font-weight: 600;
  `,
  h4: css`
    font-size: 1.5rem;
    font-weight: 500;
  `,
  body: css`
    font-size: 1rem;
    font-weight: 400;
  `,
  small: css`
    font-size: 0.875rem;
    font-weight: 400;
  `
}

export const StyledTypography = styled.div`
  margin: 0;
  color: ${props => props.color || props.theme.text};
  text-align: ${props => props.align || 'left'};
  ${props => variantStyles[props.variant] || variantStyles.body};
`
