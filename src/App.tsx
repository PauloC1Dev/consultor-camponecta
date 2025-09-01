
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css'
import { Login } from './pages/login/Login'
import { Procurar } from './pages/procurar/Procurar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

function App() {

const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/procurar" element={<Procurar />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App
