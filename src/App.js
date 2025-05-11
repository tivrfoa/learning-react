import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './Home';
import Board from './Grok3';
import { default as Gemini } from './Gemini2.5Pro';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/grok3" element={<Board />} />
        <Route path="/gemeni2.5Pro" element={<Gemini />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;