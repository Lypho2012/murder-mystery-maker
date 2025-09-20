import { useNavigate, useParams } from "react-router-dom"
import "./MurderBoard.css"
import { useEffect, useState } from "react"
import axios from "axios"
import { Timestamp } from "firebase/firestore/lite"
function MurderBoard() {
  const {boardId} = useParams()
  const [title, setTitle] = useState("")
  const [lastSaved, setLastSaved] = useState(new Timestamp(0,0))

  useEffect(() => {
    const fetchData = async () => {
        try {
            const result = await axios.get('http://localhost:8000/get-name/'+boardId);
            setTitle(result.data)

            const result2 = await axios.get('http://localhost:8000/get-last-modified/'+boardId);
            setLastSaved(new Timestamp(
              result2.data.seconds,
              result2.data.nanoseconds
          ))
        } catch (e) {
            console.error("Error fetching data:", e);
        }
    };

    fetchData();
  }, []);

  const changeTitle = (newTitle: string) => {
    setTitle(newTitle)
    const fetchData = async () => {
        try {
          const result = await axios.post('http://localhost:8000/set-name/'+boardId,{title:newTitle});
          setLastSaved(new Timestamp(
            result.data.seconds,
            result.data.nanoseconds
        ))
        } catch (e) {
            console.error("Error fetching data:", e);
        }
    };
    fetchData()
  }

  const navigate = useNavigate()
  return (
    <div id="board-div">
      <button id="home-button"><img id="home-button-img" src={require("../images/home_button.png")} alt="home button" onClick={()=> {navigate("/")}} /></button>
      <div id="board-top-div">
        <input type="text" id="board-title" value={title} onChange={e => changeTitle(e.target.value)}/>
        <div>Last Saved {lastSaved.toDate().toLocaleDateString()} {lastSaved.toDate().toLocaleTimeString()}</div>
      </div>
    </div>
  )
}

export default MurderBoard