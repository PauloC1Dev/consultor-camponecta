
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css'
import { Login } from './pages/login/Login'
import { Procurar } from './pages/procurar/Procurar';

function App() {

console.log(import.meta.env.VITE_TESTE) // "opa-funcionou"

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/procurar" element={<Procurar />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
