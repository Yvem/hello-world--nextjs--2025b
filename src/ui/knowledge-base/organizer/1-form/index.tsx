'use client';

import type React from 'react';

import { useState, useRef } from 'react';
import { Button } from '@/ui/common/button';
import { Textarea } from '@/ui/common/textarea';
import { Card } from '@/ui/common/card';
import { Upload, X, FileText } from 'lucide-react';

interface KnowledgeBaseFormProps {
	onSubmit: (texts: Array<string>) => Promise<any>;
}

export default function KnowledgeBaseUploadForm({ onSubmit }: KnowledgeBaseFormProps) {
	// TODO error display

	const [textAreaContent, setTextAreaContent] = useState('');
	const [files, setFiles] = useState<File[]>([]);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const _onFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const selectedFiles = Array.from(event.target.files || []);
		const textFiles = selectedFiles.filter(file => file.type === 'text/plain' || file.name.endsWith('.txt') || file.name.endsWith('.md'));

		if (textFiles.length !== selectedFiles.length) {
			console.error({
				title: 'Invalid file type',
				description: 'Only text files (.txt, .md) are allowed',
				variant: 'destructive',
			});
		}

		// TODO duplicate file detection

		setFiles(prev => [...prev, ...textFiles]);
	};

	const removeFile = (index: number) => {
		setFiles(prev => prev.filter((_, i) => i !== index));
	};

	const _onSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		try {
			const filesContent = await Promise.all(files.map(file => file.text()));

			const texts = [textAreaContent, ...filesContent];

			console.log(`XXX `, texts);
			onSubmit(texts);
		} catch (error) {
			console.error({
				title: 'Error',
				description: 'Failed to process knowledge base data',
				variant: 'destructive',
			});
		}
	};

	return (
		<div className='space-y-6'>
			<form onSubmit={_onSubmit} className='space-y-6'>
				<div>
					<h3 className='mb-4 text-lg font-semibold text-gray-900'>Provide your KB raw data</h3>

					<Textarea value={textAreaContent} onChange={e => setTextAreaContent(e.target.value)} placeholder='Enter your knowledge base content here...' className='min-h-[300px] resize-none' />
				</div>

				<div>
					<input ref={fileInputRef} type='file' multiple accept='.txt,.md,text/plain' onChange={_onFileInputChange} className='hidden' />

					<Button type='button' variant='outline' onClick={() => fileInputRef.current?.click()} className='mb-4'>
						<Upload className='mr-2 h-4 w-4' />
						Upload file
					</Button>

					{files.length > 0 && (
						<div className='space-y-2'>
							<h4 className='text-sm font-medium text-gray-700'>Uploaded files:</h4>
							{files.map((file, index) => (
								<Card key={index} className='p-3'>
									<div className='flex items-center justify-between'>
										<div className='flex items-center space-x-2'>
											<FileText className='h-4 w-4 text-gray-500' />
											<span className='text-sm text-gray-700'>{file.name}</span>
											<span className='text-xs text-gray-500'>({(file.size / 1024).toFixed(1)} KB)</span>
										</div>
										<Button type='button' variant='ghost' size='sm' onClick={() => removeFile(index)}>
											<X className='h-4 w-4' />
										</Button>
									</div>
								</Card>
							))}
						</div>
					)}
				</div>

				<Button type='submit' className='bg-teal-600 hover:bg-teal-700' disabled={!textAreaContent && files.reduce((acc, file) => acc + file.size, 0) === 0}>
					Next
				</Button>
			</form>

			<Button className='bg-teal-600 hover:bg-teal-700' disabled={!textAreaContent && files.reduce((acc, file) => acc + file.size, 0) === 0}>
				Reset
			</Button>
		</div>
	);
}
