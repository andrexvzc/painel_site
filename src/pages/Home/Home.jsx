import { useState } from 'react'
import { Button } from '@components/common/Button'
import * as S from './Home.styles'

const Home = () => {
  const [count, setCount] = useState(0)

  return (
    <S.Container>
      <header>
        <S.Title>Painel+ Demo</S.Title>
        <S.SubTitle>Testing styled-components & Button Component</S.SubTitle>
      </header>

      <S.Section>
        <h3>Button Variants</h3>
        <S.ButtonGrid>
          <Button variant="primary" onClick={() => alert('Primary Clicked')}>
            Primary Button
          </Button>
          <Button variant="secondary" onClick={() => alert('Secondary Clicked')}>
            Secondary Button
          </Button>
          <Button disabled onClick={() => alert('Should not happen')}>
            Disabled Button
          </Button>
        </S.ButtonGrid>
      </S.Section>

      <S.Section>
        <h3>State & Interactivity</h3>
        <p>Current Count: {count}</p>
        <S.ButtonGrid>
          <Button variant="primary" onClick={() => setCount(prev => prev + 1)}>
            Increment
          </Button>
          <Button variant="secondary" onClick={() => setCount(prev => prev - 1)}>
            Decrement
          </Button>
        </S.ButtonGrid>
        <S.StatusText active={count > 0}>
          {count > 0 ? 'Count is positive!' : 'Count is zero or negative.'}
        </S.StatusText>
      </S.Section>
    </S.Container>
  )
}

export default Home
