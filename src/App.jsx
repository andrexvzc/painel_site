import { useState } from 'react'
import { ThemeProvider } from 'styled-components'
import { AppRoutes } from '@/routes/AppRoutes'
import { lightTheme, darkTheme } from '@/styles/theme'
import { ThemeContext } from '@/store/context/ThemeContext'

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const theme = isDarkMode ? darkTheme : lightTheme

  const toggleTheme = () => setIsDarkMode(!isDarkMode)

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      <ThemeProvider theme={theme}>
        <AppRoutes />
      </ThemeProvider>
    </ThemeContext.Provider>
  )
}

export default App
