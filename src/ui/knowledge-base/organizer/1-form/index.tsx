'use client';

import type React from 'react';

import { useState, useRef } from 'react';
import { Button } from '@/ui/common/button';
import { Textarea } from '@/ui/common/textarea';
import { Card } from '@/ui/common/card';
import { Upload, X, FileText } from 'lucide-react';

interface KnowledgeBaseFormProps {
	onSubmit: (texts: Array<string>) => void;
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
			onSubmit(texts);
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<div className='space-y-6'>
			<form onSubmit={_onSubmit} className='space-y-6'>
				<div>
					<h3 className='mb-4 text-lg font-semibold text-gray-900'>Provide your KB raw data</h3>

					<Button className='bg-teal-600 hover:bg-teal-700' onClick={() => setTextAreaContent(`Our new employee onboarding process starts the first Monday of every month, beginning with a mandatory virtual orientation session from 9 AM to 12 PM AEST. New hires will receive an email with their login credentials for the HR portal and our internal collaboration tool, Slack, 48 hours prior to their start date. It's crucial they complete their tax forms and set up direct deposit in the HR portal within the first three days. After orientation, each new hire will be introduced to their team lead who will guide them through specific departmental training and project assignments. We also offer a mentorship program where new employees are paired with experienced colleagues for the first six months to help them settle in and understand our company culture. Benefits enrollment, including health insurance and 401k, must be completed by the end of their first week. For IT support, new employees should contact helpdesk@ourcompany.com or call extension 5555. They will be provisioned with a laptop and necessary software by the end of their first day, provided they have completed the pre-onboarding IT survey.`)}>
						Insert Demo Data
					</Button>

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
