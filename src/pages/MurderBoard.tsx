import { useParams } from "react-router-dom"
import "./MurderBoard.css"
import { useEffect, useState } from "react"
import axios from "axios"
function MurderBoard() {
  const {boardId} = useParams()
  const [title, setTitle] = useState("")

  useEffect(() => {
    const fetchData = async () => {
        try {
            const result = await axios.get('http://localhost:8000/get-name/'+boardId);
            setTitle(result.data)
            console.log(result);
        } catch (e) {
            console.error("Error fetching data:", e);
        }
    };

    fetchData();
  }, []);

  return (
    <div id="board-div">
      <input type="text" id="board-title" value={title} onChange={e => setTitle(e.target.value)}/>
    </div>
  )
}

export default MurderBoard