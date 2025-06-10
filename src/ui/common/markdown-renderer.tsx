'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownRendererProps {
	content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
	if (!content) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>Markdown Preview</CardTitle>
				</CardHeader>
				<CardContent>
					<p className='py-8 text-center text-gray-500'>No markdown content to display. Submit the form in the first tab to generate content.</p>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Markdown Preview</CardTitle>
			</CardHeader>
			<CardContent>
				<div className='prose prose-gray max-w-none'>
					<ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
				</div>
			</CardContent>
		</Card>
	);
}
