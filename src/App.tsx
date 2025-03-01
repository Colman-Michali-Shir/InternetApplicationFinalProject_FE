import { Route, Routes } from 'react-router-dom'
import { Container, CssBaseline } from '@mui/material'
import HomePage from './components/HomePage'
import TopBar from './components/TopBar'
import ProfilePage from './components/ProfilePage'
import './App.css'

function App() {

  return (
   <>
      <CssBaseline enableColorScheme />

      <TopBar />
      <Container
        maxWidth="lg"
        component="main"
        sx={{ display: 'flex', flexDirection: 'column', my: 16, gap: 4 }}
      >
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>        
      </Container>
    </>
  )
}

export default App
