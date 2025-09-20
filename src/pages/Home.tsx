import axios from "axios";
import "./Home.css"
import { useNavigate } from 'react-router-dom';

function Home() {
    const navigate = useNavigate();

    const createBoard = async () => {
        try {
            const result = await axios.post('http://localhost:8000/add-board');
            navigate("/murder-board/"+result.data)
          } catch (e) {
              console.error("Error fetching data:", e);
          }
    }
    return (
        <div id="home-div">
            <p id="home-title">Murder Mystery Maker</p>
            <button className="home-page-buttons" onClick={()=> {createBoard()}}>New</button>
            <button className="home-page-buttons" onClick={()=> {navigate("/saved-boards")}}>Load</button>
        </div>
    )
}

export default Home