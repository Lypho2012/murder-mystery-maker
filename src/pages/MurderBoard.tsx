import { useNavigate, useParams } from "react-router-dom"
import "./MurderBoard.css"
import { useEffect, useState } from "react"
import axios from "axios"
import { Timestamp } from "firebase/firestore/lite"

import {useDrag, DndProvider, useDrop} from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';

interface CharacterItemProps {
    character: any; 
    handleShowDeleteConfirmation: () => void;
    setDeleteCharId: (id: number) => void;
    x: number;
    y: number;
    boardId: any;
}

const CharacterItem: React.FC<CharacterItemProps> = ({ character, handleShowDeleteConfirmation, setDeleteCharId, x, y, boardId }) => {
    
    const [{ opacity }, dragRef] = useDrag(
      () => ({
        type: "character",
        item: { id: character["id"], x: x, y: y },
        collect: (monitor: any) => ({
          opacity: monitor.isDragging() ? 0.5 : 1
        }),
      }),
      [character, x, y]
    );

    const navigate = useNavigate()

    return (
        <div ref={dragRef as any} style={{ 
          opacity,position: 'absolute', 
          left: x, 
          top: y, 
          width: 'fit-content',
          height: 'fit-content',
          cursor: 'grab'}} className="character-div">
            <div className="character-topbar">
              <button className="character-topbar-button">
                <img className="character-topbar-button-img" src={require("../images/edit.png")} alt="edit button" onClick={(e)=> {
                  e.stopPropagation();
                  navigate("/edit-character/"+boardId+"/"+character["id"])}} /></button>
              <button className="character-topbar-button">
                <img className="character-topbar-button-img" src={require("../images/delete.png")} alt="delete button" onClick={(e)=> {
                e.stopPropagation();
                handleShowDeleteConfirmation();
                setDeleteCharId(character["id"]);}} /></button>
            </div>
            <img className="character-profile-img" src={require("../images/profile.png")} alt="character profile"/>
            <div className="character-name">{character["name"]}</div>
        </div>
    );
}

function MurderBoardContent() {
  const {boardId} = useParams()
  const [title, setTitle] = useState("")
  const [lastSaved, setLastSaved] = useState(new Timestamp(0,0))
  const [characters, setCharacters] = useState<any[]>([])

  const fetchData = async () => {
      try {
          const result = await axios.get('http://localhost:8000/get-title/'+boardId);
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
          const result = await axios.post('http://localhost:8000/set-title/'+boardId,{title:newTitle});
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

  const updateCharacterPosition = (charId: any, x: number, y: number) => {
    const performQuery = async () => {
        try {
          const result = await axios.post('http://localhost:8000/set-char-pos/'+boardId+'/'+charId,{x:x,y:y});
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

  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: "character", 
      drop: (item: any, monitor) => { 
        const delta = monitor.getDifferenceFromInitialOffset()
        if (!delta) return
        
        let newX = Math.round(item.x + delta.x)
        let newY = Math.round(item.y + delta.y)
        
        updateCharacterPosition(item.id,newX,newY)
      },
      collect: (monitor: any) => ({
        isOver: monitor.isOver()
      })
    }),
    []
  )

  return (
    <div id="board-div">
      <button id="home-button"><img id="home-button-img" src={require("../images/home_button.png")} alt="home button" onClick={()=> {navigate("/")}} /></button>
      
      <input type="text" id="board-title" value={title} onChange={e => changeTitle(e.target.value)}/>
      <div>Last Saved {lastSaved.toDate().toLocaleDateString()} {lastSaved.toDate().toLocaleTimeString()}</div>
      
      <button id="add-char-button"><img id="add-button-img" src={require("../images/add.png")} alt="add button" onClick={()=> {addChar()}} /></button>
      
      <div id="characters-div" ref={drop as any}>
      {
        characters.length == 0 ? 
        <div>Empty</div> 
        : characters.map((character) => 
            <CharacterItem 
                key={character["id"]}
                character={character} 
                handleShowDeleteConfirmation={handleShowDeleteConfirmation}
                setDeleteCharId={setDeleteCharId}
                x={character["x"]}
                y={character["y"]}
                boardId={boardId}
            />)
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

function MurderBoard() {
  return (
    <DndProvider backend={HTML5Backend}>
        <MurderBoardContent />
    </DndProvider>
  )
}

export default MurderBoard