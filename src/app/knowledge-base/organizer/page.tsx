'use client';

import { useState } from 'react';

import { Card, CardContent } from '@/ui/common/card';

import Form from '@/ui/knowledge-base/organizer/1-form/index';

export default function Page() {
	const [activeTab, setActiveTab] = useState('form');

	const markdownContent = '';
	const diffData = [];

	const handleFormSubmit = async (formData: FormData) => {
		try {
			const response = await fetch('/api/process-knowledge', {
				method: 'POST',
				body: formData,
			});

			const result = await response.json();

			throw new Error(`Not implemented!`);

			return result;
		} catch (error) {
			console.error('Error submitting form:', error);
			throw error;
		}
	};

	return (
		<div className='min-h-screen bg-gray-50 p-4'>
			<div className='mx-auto max-w-6xl'>
				<div className='mb-8'>
					<h1 className='mb-2 text-3xl font-bold text-gray-900'>Knowledge Base</h1>
					<p className='text-gray-600'>Manage what your AI assistant knows about your clinic</p>
				</div>

				<Card>
					<CardContent className='p-6'>
						<div className='w-full'>
							{/* Custom Tab Navigation */}
							<div className='relative mb-8 flex items-center justify-between'>
								{/* Tab 1 - Data Input */}
								<div className={`flex flex-1 cursor-pointer items-center space-x-4 p-4 transition-all ${activeTab === 'form' ? 'text-teal-600' : 'text-gray-600'}`} onClick={() => setActiveTab('form')}>
									<div className={`flex h-12 w-12 items-center justify-center rounded-full font-semibold text-white ${activeTab === 'form' ? 'bg-teal-600' : markdownContent ? 'bg-teal-600' : 'bg-gray-400'}`}>{markdownContent ? '✓' : '01'}</div>
									<div className='flex-1'>
										<h3 className='text-lg font-semibold'>Data Input</h3>
										<p className='text-sm text-gray-500'>Provide your KB raw data</p>
									</div>
								</div>

								{/* Separating Arrow 1 */}
								<div className='px-4'>
									<svg width='24' height='24' viewBox='0 0 24 24' fill='none' className='text-gray-300'>
										<path d='M9 18L15 12L9 6' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
									</svg>
								</div>

								{/* Tab 2 - Markdown Preview */}
								<div className={`flex flex-1 cursor-pointer items-center space-x-4 transition-all ${activeTab === 'markdown' ? 'text-teal-600' : markdownContent ? 'text-gray-700' : 'text-gray-400'}`} onClick={() => markdownContent && setActiveTab('markdown')}>
									<div className={`flex h-12 w-12 items-center justify-center rounded-full font-semibold text-white ${activeTab === 'markdown' ? 'bg-teal-600' : markdownContent ? 'bg-gray-600' : 'bg-gray-400'}`}>02</div>
									<div className='flex-1'>
										<h3 className='text-lg font-semibold'>Markdown Preview</h3>
										<p className='text-sm text-gray-500'>Review processed content</p>
									</div>
								</div>

								{/* Separating Arrow 2 */}
								<div className='px-4'>
									<svg width='24' height='24' viewBox='0 0 24 24' fill='none' className='text-gray-300'>
										<path d='M9 18L15 12L9 6' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
									</svg>
								</div>

								{/* Tab 3 - Review Changes */}
								<div className={`flex flex-1 cursor-pointer items-center space-x-4 transition-all ${activeTab === 'diffs' ? 'text-teal-600' : diffData.length > 0 ? 'text-gray-700' : 'text-gray-400'}`} onClick={() => diffData.length > 0 && setActiveTab('diffs')}>
									<div className={`flex h-12 w-12 items-center justify-center rounded-full font-semibold text-white ${activeTab === 'diffs' ? 'bg-teal-600' : diffData.length > 0 ? 'bg-gray-600' : 'bg-gray-400'}`}>03</div>
									<div className='flex-1'>
										<h3 className='text-lg font-semibold'>Review Changes</h3>
										<p className='text-sm text-gray-500'>Accept or retry modifications</p>
									</div>
								</div>

								{/* Active tab indicator line */}
								<div className='absolute right-0 bottom-0 left-0 h-0.5 bg-gray-200'>
									<div className={`h-full bg-teal-600 transition-all duration-300 ${activeTab === 'form' ? 'w-1/3 translate-x-0' : activeTab === 'markdown' ? 'w-1/3 translate-x-full' : 'w-1/3 translate-x-[200%]'}`} />
								</div>
							</div>

							{/* Tab Content */}
							<div className='mt-8'>
								{activeTab === 'form' && <Form onSubmit={handleFormSubmit} />}
								{activeTab === 'markdown' && <div content={markdownContent} />}
								{activeTab === 'diffs' && <div diffs={diffData} />}
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
