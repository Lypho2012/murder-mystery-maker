import axios from "axios";
import { useEffect, useRef, useState } from "react"
import { useParams } from "react-router-dom"
import "./EvidenceBank.css"

function EvidenceBank() {
    const {boardId} = useParams()
    const bottomRef = useRef<any>(null)
    const [evidenceList, setEvidenceList] = useState<any>([])
    const [evidenceDisplayed, setEvidenceDisplayed] = useState<any>({})

    const fetchData = async () => {
        try {
            const result = await axios.get('http://localhost:8000/get-evidence-list/'+boardId);
            setEvidenceList(result.data)
        } catch (e) {
            console.error("Error fetching data:", e);
        }
    }

    useEffect(() => {
        fetchData()
    })

    const handleAddEvidence = () => {
        const performQuery = async () => {
            try {
            const result = await axios.post('http://localhost:8000/add-evidence/'+boardId);
            setEvidenceList([...evidenceList,result.data])
            } catch (e) {
                console.error("Error fetching data:", e);
            }
        };
        performQuery()
    }
    useEffect(() => {
        bottomRef.current?.scrollIntoView({behavior:"smooth"})
    },[evidenceList])
    const changeEvidenceDescription = (value: any) => {
        const performQuery = async () => {
            try {
                await axios.post('http://localhost:8000/set-evidence-description/'+boardId+"/"+evidenceDisplayed.id,{description:value});
                evidenceDisplayed.description = value
            } catch (e) {
                console.error("Error fetching data:", e);
            }
        };
        performQuery()
    }

    return (
        <div style={{display:"flex",flexDirection:"row"}}>
            <div style={{width:"50%",alignContent:"flex-start",display:"flex"}}>
                <button onClick={handleAddEvidence}>Add evidence</button>
                <div style={{display:"flex",flexDirection:"column"}}>
                    {evidenceList.map((item:any) => 
                    <div>
                        {item.id}
                        {item.description}
                    </div>)}
                    <div ref={bottomRef}/>
                </div>
            </div>
            <div style={{width:"50%"}}>
                {evidenceDisplayed.id}
                <input type="text" id="evidence-description" value={evidenceDisplayed.description} onChange={e => changeEvidenceDescription(e.target.value)}/>
            </div>
        </div>
    )
}

export default EvidenceBank