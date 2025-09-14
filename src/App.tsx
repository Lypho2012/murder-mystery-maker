import './App.css';
import { Routes, Route, BrowserRouter} from 'react-router-dom'
import Home from './pages/Home';
import MurderBoard from './pages/MurderBoard';

function App() {
  return (
    <BrowserRouter>
    <div className="App">
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/murder-board" element={<MurderBoard/>}/>
      </Routes>
    </div>
    </BrowserRouter>
  );
}

export default App;
