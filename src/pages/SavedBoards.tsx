import { useEffect, useState } from "react"
import { getLastModified, getIds, getName } from "../backend/firebase_backend"
import { Timestamp } from "firebase/firestore/lite"
import "./SavedBoards.css"
import MurderBoard from "./MurderBoard"
import { useNavigate } from "react-router-dom"

function SavedBoards() {
    const [prevBoards, setPrevBoards] = useState([{"name":"","last modified":new Timestamp(0,0),"id":""}])
    const [called, setCalled] = useState(false)
    const fetchData = async () => {
        try {
            const ids = await getIds()
            const boards = await Promise.all(ids.map(async (id:string) => {
                const name = await getName(id);
                const lastModified = await getLastModified(id);
                    return {
                        "name":name,
                        "last modified":lastModified,
                        "id":id
                    }}))
            setPrevBoards(boards)
        } catch (e) {
            console.log(e)
        }
    }
    if (!called) {
        setCalled(true);
        fetchData()
    }
    setTimeout(() => {
        fetchData()
      }, 10000);

    const navigate = useNavigate();
    return (
        <div id="load-div">
            {
                prevBoards.map((board) => 
                <div className="board" onClick={()=>{navigate("/murder-board/"+board["id"])}}>
                    <div>{board["name"]}</div>
                    <div>Last Modified {board["last modified"].toDate().toLocaleDateString()} {board["last modified"].toDate().toLocaleTimeString()}</div>
                </div>)
            }
        </div>
    )
}

export default SavedBoards