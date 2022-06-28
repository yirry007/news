import React, { useEffect, useState } from 'react';
import { Editor } from "react-draft-wysiwyg";
import { ContentState, convertToRaw, EditorState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import htmlToDraft from 'html-to-draftjs';

function NewsEditor(props) {
    const [editorState, setEditorState] = useState('');

    useEffect(()=>{
        const html = props.content;
        if (!html) return;
        const contentBlock = htmlToDraft(html);
        if (contentBlock) {
            const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
            setEditorState(EditorState.createWithContent(contentState));
        }
    }, [props.content]);

    return (
        <div>
            <Editor
                editorState={editorState}
                toolbarClassName="toolbarClassName"
                wrapperClassName="wrapperClassName"
                editorClassName="editorClassName"
                onEditorStateChange={(editorState)=>setEditorState(editorState)}

                onBlur={()=>{props.getContent( draftToHtml(convertToRaw(editorState.getCurrentContent())) )}}
            />
        </div>
    );
}

export default NewsEditor;