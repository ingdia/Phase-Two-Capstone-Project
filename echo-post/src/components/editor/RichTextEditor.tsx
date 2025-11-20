"use client";

import { useState, useRef, useEffect } from "react";
import { Bold, Italic, List, Heading2, Quote, Code } from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({ value, onChange, placeholder = "Tell your story..." }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    // Set initial value
    if (editorRef.current && !isFocused) {
      const currentContent = editorRef.current.innerHTML;
      if (currentContent !== value) {
        editorRef.current.innerHTML = value || "";
      }
    }
  }, [value, isFocused]);

  // Initialize editor content on mount
  useEffect(() => {
    if (editorRef.current && value) {
      editorRef.current.innerHTML = value;
    }
  }, []);

  const handleInput = () => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      onChange(html);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      document.execCommand("insertParagraph", false);
    }
  };

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    handleInput();
  };

  const ToolbarButton = ({ icon: Icon, onClick, title, isActive }: { icon: any; onClick: () => void; title: string; isActive?: boolean }) => (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`p-2 rounded hover:bg-gray-100 transition ${isActive ? "bg-gray-200" : ""}`}
    >
      <Icon size={18} />
    </button>
  );

  return (
    <div className="border rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-pink-900 focus-within:border-pink-900 transition">
      {/* Toolbar */}
      <div className="border-b p-2 flex gap-1 flex-wrap bg-gray-50">
        <ToolbarButton
          icon={Bold}
          onClick={() => execCommand("bold")}
          title="Bold (Ctrl+B)"
        />
        <ToolbarButton
          icon={Italic}
          onClick={() => execCommand("italic")}
          title="Italic (Ctrl+I)"
        />
        <ToolbarButton
          icon={Heading2}
          onClick={() => execCommand("formatBlock", "<h2>")}
          title="Heading"
        />
        <ToolbarButton
          icon={List}
          onClick={() => execCommand("insertUnorderedList")}
          title="Bullet List"
        />
        <ToolbarButton
          icon={Quote}
          onClick={() => execCommand("formatBlock", "<blockquote>")}
          title="Quote"
        />
        <ToolbarButton
          icon={Code}
          onClick={() => execCommand("formatBlock", "<pre>")}
          title="Code Block"
        />
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="min-h-[400px] p-6 text-lg leading-relaxed outline-none prose prose-lg max-w-none focus:outline-none"
        style={{
          whiteSpace: "pre-wrap",
          wordWrap: "break-word",
        }}
        data-placeholder={value ? "" : placeholder}
      />

      <style jsx>{`
        div[contenteditable][data-placeholder]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          pointer-events: none;
          display: block;
        }
        [contenteditable] h2 {
          font-size: 1.5rem;
          font-weight: bold;
          margin: 1rem 0;
        }
        [contenteditable] blockquote {
          border-left: 4px solid #e5e7eb;
          padding-left: 1rem;
          margin: 1rem 0;
          font-style: italic;
          color: #6b7280;
        }
        [contenteditable] pre {
          background: #f3f4f6;
          padding: 1rem;
          border-radius: 0.5rem;
          overflow-x: auto;
          margin: 1rem 0;
          font-family: monospace;
        }
        [contenteditable] ul,
        [contenteditable] ol {
          margin: 1rem 0;
          padding-left: 2rem;
        }
        [contenteditable] p {
          margin: 0.5rem 0;
        }
      `}</style>
    </div>
  );
}
