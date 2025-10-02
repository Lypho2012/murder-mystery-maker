import { useNavigate, useParams } from "react-router-dom"
import "./MurderBoard.css"
import { useEffect, useRef, useState } from "react"
import axios from "axios"
import { Timestamp } from "firebase/firestore/lite"
import Draggable from 'react-draggable';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';

function MurderBoard() {
  const {boardId} = useParams()
  const [title, setTitle] = useState("")
  const [lastSaved, setLastSaved] = useState(new Timestamp(0,0))
  const [characters, setCharacters] = useState([])

  const fetchData = async () => {
      try {
          const result = await axios.get('http://localhost:8000/get-name/'+boardId);
          setTitle(result.data)

          const result2 = await axios.get('http://localhost:8000/get-last-modified/'+boardId);
          setLastSaved(new Timestamp(
            result2.data.seconds,
            result2.data.nanoseconds
          ))

          const result3 = await axios.get('http://localhost:8000/get-characters/'+boardId);
          setCharacters(result3.data)
      } catch (e) {
          console.error("Error fetching data:", e);
      }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const changeTitle = (newTitle: string) => {
    setTitle(newTitle)
    const performQuery = async () => {
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
    performQuery()
  }

  const addChar = () => {
    const performQuery = async () => {
        try {
          const result = await axios.post('http://localhost:8000/add-char/'+boardId);
          setLastSaved(new Timestamp(
            result.data["lastModified"].seconds,
            result.data["lastModified"].nanoseconds
          ))
          setCharacters(result.data["characters"])
        } catch (e) {
            console.error("Error fetching data:", e);
        }
    };
    performQuery()
  }

  const navigate = useNavigate()

  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [deleteCharId, setDeleteCharId] = useState(0);

  const handleCloseDeleteConfirmation = () => setShowDeleteConfirmation(false);
  const handleShowDeleteConfirmation = () => setShowDeleteConfirmation(true);
  const handleDeleteCharacter = () => {
    handleCloseDeleteConfirmation();
    const performQuery = async () => {
        try {
          const result = await axios.delete('http://localhost:8000/delete-char/'+boardId+'/'+deleteCharId);
          setLastSaved(new Timestamp(
            result.data["lastModified"].seconds,
            result.data["lastModified"].nanoseconds
          ))
          setCharacters(result.data["characters"])
        } catch (e) {
            console.error("Error fetching data:", e);
        }
    };
    performQuery()
  }

  return (
    <div id="board-div">
      <button id="home-button"><img id="home-button-img" src={require("../images/home_button.png")} alt="home button" onClick={()=> {navigate("/")}} /></button>
      
      <input type="text" id="board-title" value={title} onChange={e => changeTitle(e.target.value)}/>
      <div>Last Saved {lastSaved.toDate().toLocaleDateString()} {lastSaved.toDate().toLocaleTimeString()}</div>
      
      <button id="add-char-button"><img id="add-button-img" src={require("../images/add.png")} alt="add button" onClick={()=> {addChar()}} /></button>
      
      <div id="characters-div">
      {
        characters.length == 0 ? 
        <div>Empty</div> 
        : characters.map((character) => 
          <Draggable bounds="parent" key={character["id"]}>
            <div className="character-div">
              <div className="character-topbar">
                <button className="character-topbar-button"><img className="character-topbar-button-img" src={require("../images/edit.png")} alt="edit button" onClick={(e)=> {e.stopPropagation()}} /></button>
                <button className="character-topbar-button">
                  <img className="character-topbar-button-img" src={require("../images/delete.png")} alt="delete button" onClick={(e)=> {
                  e.stopPropagation();
                  handleShowDeleteConfirmation();
                  setDeleteCharId(character["id"]);}} /></button>
              </div>
              <img className="character-profile-img" src={require("../images/profile.png")} alt="character profile"/>
              <div className="character-name">{character["name"]}</div>
            </div>
          </Draggable>
        )
      }
      <Modal show={showDeleteConfirmation} onHide={handleCloseDeleteConfirmation}>
        <Modal.Body>Are you sure you want to delete this character?</Modal.Body>
        <Modal.Footer>
          <Button onClick={handleCloseDeleteConfirmation}>
            Cancel
          </Button>
          <Button onClick={handleDeleteCharacter}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
      </div>
    </div>
  )
}

export default MurderBoard