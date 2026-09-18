import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

/** Render del markdown de las lecciones (article_content). */
export default function MarkdownLite({ content }: { content: string }) {
  return (
    <div className="prose-fm">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  );
}
