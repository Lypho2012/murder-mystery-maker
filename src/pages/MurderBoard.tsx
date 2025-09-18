import { useParams } from "react-router-dom"
import "./MurderBoard.css"
import { useState } from "react"
function MurderBoard() {
  const {boardId} = useParams()
  const [title, setTitle] = useState("")
  return (
    <div id="board-div">
      <input type="text" id="board-title" value={title}/>
    </div>
  )
}

export default MurderBoard