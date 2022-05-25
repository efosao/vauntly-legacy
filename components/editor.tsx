import "@toast-ui/editor/dist/toastui-editor.css";
import { Editor } from "@toast-ui/react-editor";
import { useRef } from "react";

export default function FormEditor({ initialValue, onChange }) {
  const editorRef = useRef<Editor>(null);

  function handleChange() {
    const md = editorRef?.current
      ? editorRef?.current.getInstance().getMarkdown()
      : "";
    onChange(md);
  }

  const DEFAULT_TEXT_TO_FIX_BUG = " ";

  return (
    <Editor
      height="600px"
      initialEditType="wysiwyg"
      initialValue={initialValue || DEFAULT_TEXT_TO_FIX_BUG}
      onChange={handleChange}
      previewStyle="vertical"
      ref={editorRef}
      usageStatistics={false}
      useCommandShortcut={true}
      placeholder="Tell the job-seeker about the role"
    />
  );
}
