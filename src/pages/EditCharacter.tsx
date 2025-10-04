import { useParams } from "react-router-dom"

function EditCharacter() {
    const {boardId, charId} = useParams()
    console.log(boardId, charId)
    return (
        <div>EditCharacter</div>
    )
}

export default EditCharacter