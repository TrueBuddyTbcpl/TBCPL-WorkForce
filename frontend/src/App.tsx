import { BrowserRouter } from 'react-router-dom'
import AppRoutes from './routes';

function App() {

  return (
    <BrowserRouter basename="/TBCPL-WorkForce">
      {/**st checking */}
      <AppRoutes />
    </BrowserRouter>
  )
}

export default App
