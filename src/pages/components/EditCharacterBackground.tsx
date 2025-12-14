import { useState, useRef, useEffect, useCallback } from "react";
import "./EditCharacterBackground.css"
import axios from "axios"
import { useParams } from "react-router-dom";

function EditCharacterBackground() {
  const contentRef = useRef<any>(null)
  const cursorPos = useRef<any>(null)
  const [content,setContent] = useState('')
  const {boardId,charId} = useParams()

  const fetchData = async() => {
    try {
      const result = await axios.get(`http://localhost:8000/get-char-background/${boardId}/${charId}`);
      setContent(result.data)
    } catch (e) {
      console.error("Error updating data:", e);
    }
  }
  useEffect(() => {
    fetchData()
  },[])
  
  const handleEditorClick = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    
    if (target.tagName === 'BUTTON' && target.id) {
      event.preventDefault(); 
      event.stopPropagation();
      
      handleClickEvidence(event);
    }
  }, []);

  const handleClickEvidence = (event: any) => {
    const buttonId = event.currentTarget.id
  }
  const updateContent = useCallback(async (newContent: string) => {
    setContent(newContent);
    try {
      await axios.post(`http://localhost:8000/set-char-background/${boardId}/${charId}`, { content: newContent });
    } catch (e) {
      console.error("Error updating data:", e);
    }
  }, [boardId, charId])

  const insertButton = async () => {
    // cursorPos.current = getCursor(contentRef.current)

    // const selection = window.getSelection()

    // let buttonId = null
    // try {
    //   const result = await axios.post('http://localhost:8000/add-evidence-button/'+boardId+'/'+charId)
    //   buttonId = result.data
    // } catch (e) {
    //   console.error("Error fetching data:", e)
    // }

    // const buttonHTML = `<button id="${buttonId}">*</button>`

    // if (selection && selection.rangeCount > 0) {
    //   const range = selection.getRangeAt(0);

    //   const tempDiv = document.createElement('div')
    //   tempDiv.innerHTML = buttonHTML

    //   range.insertNode(tempDiv.firstChild as ChildNode)

    //   updateContent(contentRef.current.innerHTML)

    // } else {
    //   const newContent = `${content}${buttonHTML}`
    //   updateContent(newContent)
    // }
  }

  const getCursor = (el: any) => {
    const selection = window.getSelection()
    if (!selection || selection.rangeCount == 0) return 0

    const range = selection.getRangeAt(0)
    const preRange = range?.cloneRange()
    preRange?.selectNodeContents(el)
    preRange?.setEnd(range.endContainer,range.endOffset)

    return preRange?.toString().length
  }

  const setCursor = (el: any, offset:any) => {
    const selection = window.getSelection()
    const range = document.createRange()
    if (el.childNodes[0]) {
      range.setStart(el.childNodes[0],offset)
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
      style={{"border":"black solid 1px","textAlign":"left"}}>
        {content}
      </div>
    </div>
  )
}

export default EditCharacterBackground