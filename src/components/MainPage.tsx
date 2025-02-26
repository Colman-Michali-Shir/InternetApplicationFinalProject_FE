import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import TopBar from './TopBar'


export default function MainTemplate() {
  return (
    <div>
      <CssBaseline enableColorScheme />

      <TopBar />
      <Container
        maxWidth="lg"
        component="main"
        sx={{ display: 'flex', flexDirection: 'column', my: 16, gap: 4 }}
      >
        {/* <MainContent />
        <Latest /> */}
      </Container>
    </div>
  );
}