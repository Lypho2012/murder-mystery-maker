import { useEffect, useState } from "react"
import axios from "axios";
import { Timestamp } from "firebase/firestore/lite"
import "./SavedBoards.css"
import { useNavigate } from "react-router-dom"

interface Board {
    id: string;
    name: string;
    "last modified": Timestamp;
}

function SavedBoards() {
    const [prevBoards, setPrevBoards] = useState<Board[]>([])
    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await axios.get('http://localhost:8000/get-boards');
                setPrevBoards(result.data.map((board: any) => ({
                    ...board,
                    "last modified": new Timestamp(
                        board["last modified"].seconds,
                        board["last modified"].nanoseconds
                    )
                })));
                console.log(result.data);
            } catch (e) {
                console.error("Error fetching data:", e);
            }
        };
  
        fetchData();
      }, []);

    const navigate = useNavigate();
    return (
        <div id="load-div">
            <button id="home-button"><img id="home-button-img" src={require("../images/home_button.png")} alt="home button" onClick={()=> {navigate("/")}} /></button>
            {
                prevBoards.length == 0 ? 
                <div>Empty</div> 
                : prevBoards.map((board) => 
                <div className="board" onClick={()=>{navigate("/murder-board/"+board["id"])}}>
                    <div>{board["name"]}</div>
                    <div>Last Modified {board["last modified"].toDate().toLocaleDateString()} {board["last modified"].toDate().toLocaleTimeString()}</div>
                </div>)
            }
        </div>
    )
}

export default SavedBoards