import './App.css';
import { Routes, Route, BrowserRouter} from 'react-router-dom'
import Home from './pages/Home';
import MurderBoard from './pages/MurderBoard';
import SavedBoards from './pages/SavedBoards';

function App() {
  return (
    <BrowserRouter>
    <div className="App">
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/murder-board/:board_id" element={<MurderBoard/>}/>
        <Route path="/saved-boards" element={<SavedBoards/>}/>
      </Routes>
    </div>
    </BrowserRouter>
  );
}

export default App;
