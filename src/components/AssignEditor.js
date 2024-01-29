import React, { useState } from "react";
import { EditorState, RichUtils, convertToRaw, convertFromRaw } from "draft-js";
import { Editor } from "draft-js";

function AssignEditor() {
  const [editorState, setEditorState] = useState(() => {
    // Load content from local storage if available
    const savedContent = localStorage.getItem("editorContent");
    if (savedContent) {
      const contentState = convertFromRaw(JSON.parse(savedContent));
      return EditorState.createWithContent(contentState);
    }
    return EditorState.createEmpty();
  });

  const handleEditorChange = (nextEditorState) => {
    const selection = nextEditorState.getSelection();
    const currentContent = nextEditorState.getCurrentContent();
    const currentBlock = currentContent.getBlockForKey(selection.getStartKey());

    // Create a new variable to store the updated state
    let updatedEditorState = nextEditorState;
    let element = document.getElementById("edit");

    if (currentBlock.getText().startsWith("#")) {
      updatedEditorState =  RichUtils.toggleBlockType(nextEditorState, 'unstyled');
      element.classList.remove('red');
      updatedEditorState = RichUtils.toggleBlockType(
        updatedEditorState,
        "header-one"
      );
    }
    if (currentBlock.getText().startsWith("*")) {
      updatedEditorState =  RichUtils.toggleBlockType(nextEditorState, 'unstyled');
      element.classList.remove('red');
      updatedEditorState = RichUtils.toggleInlineStyle(
        updatedEditorState,
        "BOLD"
      );
    }
    if (currentBlock.getText().startsWith("** ")) {
      updatedEditorState =  RichUtils.toggleBlockType(nextEditorState, 'unstyled');
      element.className = "editor red";
    }
    if (currentBlock.getText().startsWith("*** ")) {
      updatedEditorState =  RichUtils.toggleBlockType(nextEditorState, 'unstyled');
      element.classList.remove('red');
      updatedEditorState = RichUtils.toggleInlineStyle(
        updatedEditorState,
        "UNDERLINE"
      );
    }
    setEditorState(updatedEditorState);
  };

  const handleSave = () => {
    // Save content to local storage
    const contentState = editorState.getCurrentContent();
    const rawContentState = convertToRaw(contentState);
    localStorage.setItem("editorContent", JSON.stringify(rawContentState));
  };
  const handleRemove = () => {
    localStorage.removeItem("editorContent");
  };

  return (
    <div className="container">
      <h1>Demo Editor by Bobby Tripathi</h1>
      <button onClick={handleSave}>Save</button>
      <button onClick={handleRemove}>Remove</button>
      <div className="editor" id="edit">
        <Editor
          editorState={editorState}
          onChange={handleEditorChange}
          placeholder="Type your text here..."
          autoFocus
        />
      </div>
    </div>
  );
}

export default AssignEditor;
