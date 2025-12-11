import { ReactNode } from "react";

// Simple markdown renderer
export function renderMarkdown(text: string): ReactNode {
  if (!text) return null;
  
  // Split by double newlines to get paragraphs
  const paragraphs = text.split(/\n\n+/);
  
  return (
    <div className="markdown-content space-y-2">
      {paragraphs.map((paragraph, pIndex) => {
        // Check for bullet lists
        if (paragraph.match(/^[\s]*[-*]\s/m)) {
          const items = paragraph.split(/\n/).filter(line => line.trim());
          return (
            <ul key={pIndex} className="list-disc list-inside space-y-1">
              {items.map((item, iIndex) => (
                <li key={iIndex}>{renderInline(item.replace(/^[\s]*[-*]\s/, ''))}</li>
              ))}
            </ul>
          );
        }
        
        // Check for numbered lists
        if (paragraph.match(/^[\s]*\d+\.\s/m)) {
          const items = paragraph.split(/\n/).filter(line => line.trim());
          return (
            <ol key={pIndex} className="list-decimal list-inside space-y-1">
              {items.map((item, iIndex) => (
                <li key={iIndex}>{renderInline(item.replace(/^[\s]*\d+\.\s/, ''))}</li>
              ))}
            </ol>
          );
        }
        
        // Regular paragraph with line breaks
        const lines = paragraph.split(/\n/);
        return (
          <p key={pIndex}>
            {lines.map((line, lIndex) => (
              <span key={lIndex}>
                {renderInline(line)}
                {lIndex < lines.length - 1 && <br />}
              </span>
            ))}
          </p>
        );
      })}
    </div>
  );
}

// Render inline markdown (bold, italic, links, code)
function renderInline(text: string): ReactNode {
  if (!text) return null;
  
  const parts: ReactNode[] = [];
  let remaining = text;
  let key = 0;
  
  while (remaining.length > 0) {
    // Bold: **text** or __text__
    let match = remaining.match(/^(.*?)(\*\*|__)(.+?)\2(.*)$/s);
    if (match) {
      if (match[1]) parts.push(<span key={key++}>{match[1]}</span>);
      parts.push(<strong key={key++} className="font-semibold">{renderInline(match[3])}</strong>);
      remaining = match[4];
      continue;
    }
    
    // Italic: *text* or _text_
    match = remaining.match(/^(.*?)(\*|_)(.+?)\2(.*)$/s);
    if (match && !match[1].endsWith('*') && !match[1].endsWith('_')) {
      if (match[1]) parts.push(<span key={key++}>{match[1]}</span>);
      parts.push(<em key={key++} className="italic">{renderInline(match[3])}</em>);
      remaining = match[4];
      continue;
    }
    
    // Inline code: `code`
    match = remaining.match(/^(.*?)`(.+?)`(.*)$/s);
    if (match) {
      if (match[1]) parts.push(<span key={key++}>{match[1]}</span>);
      parts.push(
        <code key={key++} className="px-1.5 py-0.5 bg-neutral-100 text-neutral-800 rounded text-sm font-mono">
          {match[2]}
        </code>
      );
      remaining = match[3];
      continue;
    }
    
    // Links: [text](url)
    match = remaining.match(/^(.*?)\[(.+?)\]\((.+?)\)(.*)$/s);
    if (match) {
      if (match[1]) parts.push(<span key={key++}>{match[1]}</span>);
      parts.push(
        <a 
          key={key++} 
          href={match[3]} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-teal-600 hover:text-teal-700 underline"
        >
          {match[2]}
        </a>
      );
      remaining = match[4];
      continue;
    }
    
    // No more matches, add remaining text
    parts.push(<span key={key++}>{remaining}</span>);
    break;
  }
  
  return <>{parts}</>;
}

// Insert markdown syntax at cursor position
export function insertMarkdown(
  textarea: HTMLTextAreaElement,
  before: string,
  after: string = before,
  placeholder: string = ""
): string {
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const text = textarea.value;
  const selectedText = text.substring(start, end);
  
  const insertion = selectedText || placeholder;
  const newText = text.substring(0, start) + before + insertion + after + text.substring(end);
  
  // Return the new text - the component will handle updating state
  return newText;
}

// Format button configs
export interface FormatButton {
  icon: string;
  label: string;
  before: string;
  after: string;
  placeholder: string;
}

export const formatButtons: FormatButton[] = [
  { icon: "B", label: "Fett", before: "**", after: "**", placeholder: "fetter Text" },
  { icon: "I", label: "Kursiv", before: "*", after: "*", placeholder: "kursiver Text" },
  { icon: "—", label: "Liste", before: "- ", after: "", placeholder: "Listenpunkt" },
  { icon: "1.", label: "Nummerierte Liste", before: "1. ", after: "", placeholder: "Listenpunkt" },
  { icon: "</>", label: "Code", before: "`", after: "`", placeholder: "code" },
  { icon: "🔗", label: "Link", before: "[", after: "](url)", placeholder: "Linktext" },
];

