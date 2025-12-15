import { useState, useRef, useEffect, useCallback } from "react";
import "./EditCharacterBackground.css"
import axios from "axios"
import { useParams } from "react-router-dom";

function EditCharacterBackground() {
  const contentRef = useRef<any>(null)
  const cursorPos = useRef<any>(null)
  const [content,setContent] = useState('')
  const {boardId,charId} = useParams()
  const [showEvidenceList, setShowEvidenceList] = useState(false)
  const [showSelectedList, setShowSelectedList] = useState(false)
  const [selectedEvidence,setSelectedEvidence] = useState<any>([])
  const [evidenceList,setEvidenceList] = useState<any>([])
  const [activeButtonId, setActiveButtonId] = useState("")

  const fetchData = async() => {
    try {
      const result = await axios.get(`http://localhost:8000/get-char-background/${boardId}/${charId}`);
      setContent(result.data)
      const result2 = await axios.get(`http://localhost:8000/get-evidence-list/${boardId}`);
      setEvidenceList(result2.data)
    } catch (e) {
      console.error("Error updating data:", e);
    }
  }
  useEffect(() => {
    fetchData()
  },[])
  
  document.addEventListener('click', (event:any) => {
    const target = event.target as HTMLElement;
    
    if (target.tagName === 'BUTTON' && target.id) {
      event.preventDefault(); 
      event.stopPropagation();
      
      handleClickEvidence(event);
    }
  })

  const handleClickEvidence = (event: any) => {
    const buttonId = event.currentTarget.id
    setActiveButtonId(buttonId)
    const performQuery = async() => {
      try {
        const result = await axios.get(`http://localhost:8000/get-selected-evidences/${boardId}/${charId}/${buttonId}`);
        setSelectedEvidence(result.data)
      } catch (e) {
        console.error("Error updating data:", e);
    }}
    performQuery()
    setShowSelectedList(true)
  }

  const updateContent = (newContent: string) => {
    setContent(newContent);
    const performQuery = async() => {
      try {
        await axios.post(`http://localhost:8000/set-char-background/${boardId}/${charId}`, { content: newContent });
      } catch (e) {
        console.error("Error updating data:", e);
    }}
    performQuery()
  }

  const insertButton = async () => {
    cursorPos.current = getCursor(contentRef.current)

    const selection = window.getSelection()

    const performQuery = async () => {
      try {
        const result = await axios.post('http://localhost:8000/add-evidence-button/'+boardId+'/'+charId)
        const button = document.createElement("button") 
        button.id = result.data
        button.textContent = "*"
        button.contentEditable = "false"

        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);

          range.insertNode(button)

          updateContent(contentRef.current.innerHTML)

        } else {
          const newContent = `${content}${button}`
          updateContent(newContent)
        }
      } catch (e) {
        console.error("Error fetching data:", e)
    }}
    performQuery()
  }

  const getCursor = (el: any) => {
    const selection = window.getSelection()
    if (!selection || selection.rangeCount == 0) return 0

    const range = selection.getRangeAt(0)
    const preRange = range.cloneRange()
    preRange.selectNodeContents(el)
    preRange.setEnd(range.endContainer,range.endOffset)

    return preRange.toString().length
  }

  const setCursor = (el: any, offset:any) => {
    const selection = window.getSelection()
    const range = document.createRange()
    if (el.childNodes[0]) {
      let i = 0
      while (offset > el.childNodes[i].textContent.length) {
        offset -= el.childNodes[i].textContent.length
        i ++
      }
      range.setStart(el.childNodes[i],offset)
      range.collapse(true)
      selection?.removeAllRanges()
      selection?.addRange(range)
    }
  }

  const handleInput = (event: any) => {
    cursorPos.current = getCursor(contentRef.current)
    
    updateContent(event.target.innerHTML)
  }

  useEffect(() => {
    setCursor(contentRef.current,cursorPos.current)

    contentRef.current.focus()
  },[content]);

  const handleCheckboxChange = (event:any) => {
    const value = event.target.id

    if (event.target.checked) {
      setSelectedEvidence([...selectedEvidence, value]);
    } else {
      setSelectedEvidence(selectedEvidence.filter((item:any) => item !== value));
    }
    const performQuery = async() => {
      try {
        await axios.post(`http://localhost:8000/set-selected-evidences/${boardId}/${charId}/${activeButtonId}`, { content: selectedEvidence });
      } catch (e) {
        console.error("Error updating data:", e);
    }}
    performQuery()
  };

  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type == 'childList') {
          mutation.removedNodes.forEach((node)=>{
            if (node.nodeName == "BUTTON"){
              const performQuery = async() => {
                try {
                  await axios.delete('http://localhost:8000/delete-evidence-button/'+boardId+'/'+charId+'/'+(node as HTMLButtonElement).id)
                } catch (e) {
                  console.log(e)
                }
              }
              performQuery()
            }
          })
        }
      }
    })
    if (contentRef.current)
      observer.observe(contentRef.current, {childList:true})
  })

  return (
    <div id="char-background-div" style={{margin:"10px"}}>
      <button onClick={insertButton} style={{ marginBottom: '10px' }}>
        ➕ Evidence
      </button>
      <div id="char-background-description" 
      ref={contentRef}
      suppressContentEditableWarning={true}
      contentEditable="true"
      onInput={handleInput}
      dangerouslySetInnerHTML={{__html:content}}
      style={{"border":"black solid 1px","textAlign":"left"}}>
      </div>
      
      {(showEvidenceList || showSelectedList) &&
      <div style={{width:"calc(100% - 10px)",height:"300px",border:"black solid 1px",position:"fixed",backgroundColor:"white"}}>
        {showEvidenceList && <>
        <button onClick={() =>setShowEvidenceList(false)}
          style={{position:"absolute",right:"1px"}}>X</button>
        <button onClick={() =>{setShowEvidenceList(false);setShowSelectedList(true);}}
          style={{position:"absolute",right:"40px"}}>Back</button>
        <div style={{width:"100%",position:"absolute",top:"40px"}}>
          {evidenceList.map((item:any) => (
            <label key={item.id}>
              <input id={item.id} type="checkbox" checked={selectedEvidence.includes(item.id)} onChange={handleCheckboxChange}/>
              {item.description}
            </label>
          ))}
        </div>
        </>}
        {showSelectedList && <>
        <button onClick={() =>setShowSelectedList(false)}
          style={{position:"absolute",right:"1px"}}>X</button>
        <button onClick={() =>{setShowEvidenceList(true);setShowSelectedList(false)}}
          style={{position:"absolute",right:"40px"}}>Edit</button>
        <div style={{width:"100%",position:"absolute",top:"40px"}}>
          {evidenceList.map((item:any) => selectedEvidence.includes(item.id) ? (
            <label key={item.id}>
              <input id={item.id} type="checkbox" checked={selectedEvidence.includes(item.id)} onChange={handleCheckboxChange}/>
              {item.description}
            </label>
          ): <></>)}
        </div>
        </>}
      </div>}
    </div>
  )
}

export default EditCharacterBackground