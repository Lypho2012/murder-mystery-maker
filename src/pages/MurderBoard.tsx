import { useParams } from "react-router-dom"
import "./MurderBoard.css"
function MurderBoard() {
  const {boardId} = useParams()
  return (
    <div id="board-div">
      <input type="text" id="board-title" placeholder="Murder Mystery Title"/>
    </div>
  )
}

export default MurderBoard