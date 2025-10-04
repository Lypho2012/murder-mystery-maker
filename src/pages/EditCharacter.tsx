import { useNavigate, useParams } from "react-router-dom"
import "./EditCharacter.css"
import { useEffect, useState } from "react"
import { Timestamp } from "firebase/firestore/lite"
import axios from "axios"

function EditCharacter() {
    const {boardId, charId} = useParams()
    const [name, setName] = useState("")
    const [lastSaved, setLastSaved] = useState(new Timestamp(0,0))
    const navigate = useNavigate()

    const fetchData = async () => {
      try {
          const result = await axios.get('http://localhost:8000/get-name/'+boardId+'/'+charId);
          setName(result.data)

          const result2 = await axios.get('http://localhost:8000/get-last-modified/'+boardId);
          setLastSaved(new Timestamp(
            result2.data.seconds,
            result2.data.nanoseconds
          ))

      } catch (e) {
          console.error("Error fetching data:", e);
      }
  };
  useEffect(() => {
    fetchData();
  }, []);

    const changeName = (newName: string) => {
        setName(newName)
        const performQuery = async () => {
            try {
            const result = await axios.post('http://localhost:8000/set-name/'+boardId+'/'+charId,{name:newName});
            setLastSaved(new Timestamp(
                result.data.seconds,
                result.data.nanoseconds
            ))
            } catch (e) {
                console.error("Error fetching data:", e);
            }
        };
        performQuery()
    }
    return (
        <div id="edit-character-div">
            <button id="back-button"><img id="back-button-img" src={require("../images/back_button.png")} alt="back button" onClick={()=> {navigate("/murder-board/"+boardId)}} /></button>
            <input type="text" id="char-name" value={name} onChange={e => changeName(e.target.value)}/>
            <div>Last Saved {lastSaved.toDate().toLocaleDateString()} {lastSaved.toDate().toLocaleTimeString()}</div>
      
        </div>
    )
}

export default EditCharacter