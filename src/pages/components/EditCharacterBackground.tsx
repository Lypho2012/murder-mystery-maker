import { useState, useRef } from "react";
import "./EditCharacterBackground.css"
function EditCharacterBackground() {
  const contentRef = useRef<any>(null);

  const insertButton = () => {
    if (!contentRef.current) return;
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    
    const range = selection.getRangeAt(0);
    const newButton = document.createElement('button');
    newButton.textContent = '!';
    newButton.style.cssText = 'margin:5px;cursor: pointer;';
    newButton.onclick = () => {
        alert('Button inside the editable div was clicked!');
    };newButton.setAttribute('contentEditable', 'false');
    
    range.deleteContents();
    range.insertNode(newButton);
    range.setStartAfter(newButton);
    range.collapse(true); 
    selection.removeAllRanges();
    selection.addRange(range);
  };

  return (
    <div id="char-background-div">
      <button onClick={insertButton} style={{ marginBottom: '10px' }}>
        ➕ Evidence
      </button>
      <div id="char-background-description" 
      ref={contentRef}
      contentEditable="true">
      </div>
    </div>
  )
}

export default EditCharacterBackground