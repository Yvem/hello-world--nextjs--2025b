import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownRendererProps {
	content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
	return (
		<div className='prose max-w-none' id='markdown-renderer-escape-tailwind'>
			{content ? <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown> : <p className='py-8 text-center text-red-500'>No markdown content to display.</p>}
		</div>
	);
}
