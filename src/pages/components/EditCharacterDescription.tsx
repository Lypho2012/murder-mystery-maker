import { useState } from "react"
import "./EditCharacterDescription.css"
function EditCharacterDescription() {
    const [physicalDescription, setPhysicalDescription] = useState("")

    const updatePhysicalDescription = (value:any) => {
        setPhysicalDescription(value)
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