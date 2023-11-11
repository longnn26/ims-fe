"use client";
import React from "react";

import dynamic from "next/dynamic";
import "suneditor/dist/css/suneditor.min.css"; // Import Sun Editor's CSS File
import SunEditorCore from "suneditor/src/lib/core";
import { buttonListEditor } from "@utils/constants";
const SunEditor = dynamic(() => import("suneditor-react"), {
  ssr: false,
});

interface Props {
  title: string;
  editor: React.MutableRefObject<SunEditorCore | undefined>;
  content: string;
}

const TextEditorComponent: React.FC<Props> = (props) => {
  const { title, editor, content } = props;

  // The sunEditor parameter will be set to the core suneditor instance when this function is called
  const getSunEditorInstance = (sunEditor: SunEditorCore) => {
    editor.current = sunEditor;
  };
  return (
    <div className="mb-4">
      <p> {title} </p>
      <SunEditor
        defaultValue={content}
        setOptions={{
          buttonList: buttonListEditor,
        }}
        getSunEditorInstance={getSunEditorInstance}
      />
    </div>
  );
};

export default TextEditorComponent;
