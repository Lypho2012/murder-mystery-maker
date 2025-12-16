import './App.css';
import { Routes, Route, BrowserRouter} from 'react-router-dom'
import Home from './pages/Home';
import MurderBoard from './pages/MurderBoard';
import SavedBoards from './pages/SavedBoards';
import EditCharacter from './pages/EditCharacter';
import EvidenceBank from './pages/EvidenceBank';

function App() {
  return (
    <BrowserRouter>
    <div className="App">
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/murder-board/:boardId" element={<MurderBoard/>}/>
        <Route path="/evidence-bank/:boardId" element={<EvidenceBank/>}/>
        <Route path="/saved-boards" element={<SavedBoards/>}/>
        <Route path="/edit-character/:boardId/:charId" element={<EditCharacter/>}/>
      </Routes>
    </div>
    </BrowserRouter>
  );
}

export default App;
