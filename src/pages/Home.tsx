import "./Home.css"
import { useNavigate } from 'react-router-dom';

function Home() {
    const navigate = useNavigate();
    return (
        <div id="home-div">
            <p id="home-title">Murder Mystery Maker</p>
            <button className="home-button" onClick={()=> {navigate("/murder-board")}}>New</button>
            <button className="home-button" onClick={()=> {navigate("/saved-boards")}}>Load</button>
        </div>
    )
}

export default Home