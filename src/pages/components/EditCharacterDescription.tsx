import { useEffect, useState } from "react"
import "./EditCharacterDescription.css"
import axios from "axios";
import { useParams } from "react-router-dom";
function EditCharacterDescription() {
    const {boardId,charId} = useParams()
    const [physicalDescription, setPhysicalDescription] = useState("")

    const fetchData = async() => {
        try {
            const result = await axios.get(`http://localhost:8000/get-char-description/${boardId}/${charId}`);
            setPhysicalDescription(result.data)
        } catch (e) {
            console.error("Error updating data:", e);
        }
    }
    useEffect(() => {
        fetchData()
    },[])

    const updatePhysicalDescription = (value:any) => {
        setPhysicalDescription(value)
        const performQuery = async() => {
            try {
                await axios.post(`http://localhost:8000/set-char-description/${boardId}/${charId}`,{content:value});
            } catch (e) {
                console.error("Error updating data:", e);
        }}
        performQuery()
    }
    return (
        <div id="char-description-div">
            <img id="edit-character-profile-img" src={require("../../images/profile.png")} alt="character profile"/>
            <p>Physical Description:</p>
            <textarea id="char-physical-description" defaultValue={"Enter description here"} value={physicalDescription} onChange={(e) => updatePhysicalDescription(e.target.value)}/>
        </div>
    )
}

export default EditCharacterDescription