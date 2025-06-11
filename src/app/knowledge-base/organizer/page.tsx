'use client';

import { useState } from 'react';

import { Card, CardContent } from '@/ui/common/card';
import * as State from '@/lib/isomorphic/business/knowledge-base/organizer/index';
import InputForm from '@/ui/knowledge-base/organizer/1-form/index';
import { extractStructure } from '@/ui/knowledge-base/organizer/server-functions';
import { getActiveTab, getRawInputText } from '@/lib/isomorphic/business/knowledge-base/organizer/index';

function ArrowSeparator() {
	return (
		<div className='px-4'>
			<svg width='24' height='24' viewBox='0 0 24 24' fill='none' className='text-gray-300'>
				<path d='M9 18L15 12L9 6' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
			</svg>
		</div>
	);
}

export default function Page() {
	const [state, setState] = useState(State.create());

	const activeTab = State.getActiveTab(state);

	const markdownContent = '';
	const diffData = [];

	const onInputFormSubmit = async (texts: Array<string>) => {

		try {
			setState(state => {
				state = State.onInputFormSubmit(state, texts);

				const result = extractStructure(State.getRawInputText(state));
				state = State.onExtractionInitiated(state, result.then());

				result.then(
					result => {
						setState(state => State.onExtractionSuccess(state, result));
					},
					err => {
						console.error(`XXX `, err);
					}
				);

				return state;
			});
		} catch (error) {
			// TODO error handling
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
								<div className={`flex flex-1 cursor-pointer items-center space-x-4 p-4 transition-all ${activeTab === 'step1' || State.isStep1Complete(state) ? 'text-teal-600' : 'text-gray-600'}`} onClick={() => setState(state => State.setActiveTab(state, 'step1'))}>
									<div className={`flex h-12 w-12 items-center justify-center rounded-full font-semibold text-white ${activeTab === 'step1' || State.isStep1Complete(state) ? 'bg-teal-600' : 'bg-gray-600'}`}>{State.isStep2Available(state) && activeTab !== 'step1' ? '✓' : '01'}</div>
									<div className='flex-1'>
										<h3 className='text-lg font-semibold'>Data Input</h3>
										<p className='text-sm text-gray-500'>Provide your KB raw data</p>
									</div>
								</div>

								<ArrowSeparator />

								{/* Tab 2 - Markdown Preview */}
								<div className={`flex flex-1 cursor-pointer items-center space-x-4 transition-all ${activeTab === 'step2' ? 'text-teal-600' : 'text-gray-400'}`} onClick={() => State.isStep2Available(state) && setState(state => State.setActiveTab(state, 'step2'))}>
									<div className={`flex h-12 w-12 items-center justify-center rounded-full font-semibold text-white ${activeTab === 'step2' ? 'bg-teal-600' : 'bg-gray-400'}`}>{State.isStep3Available(state) && activeTab === 'step3' ? '✓' : '02'}</div>
									<div className='flex-1'>
										<h3 className='text-lg font-semibold'>Review</h3>
										<p className='text-sm text-gray-500'>Review the extracted structure</p>
									</div>
								</div>

								<ArrowSeparator />

								{/* Tab 3 - Review Changes */}
								<div className={`flex flex-1 cursor-pointer items-center space-x-4 transition-all ${activeTab === 'step3' ? 'text-teal-600' : diffData.length > 0 ? 'text-gray-700' : 'text-gray-400'}`} onClick={() => State.isStep3Available(state) && setState(state => State.setActiveTab(state, 'step3'))}>
									<div className={`flex h-12 w-12 items-center justify-center rounded-full font-semibold text-white ${activeTab === 'step3' ? 'bg-teal-600' : diffData.length > 0 ? 'bg-gray-600' : 'bg-gray-400'}`}>03</div>
									<div className='flex-1'>
										<h3 className='text-lg font-semibold'>Improve</h3>
										<p className='text-sm text-gray-500'>Approve your improved content</p>
									</div>
								</div>

								{/* Active tab indicator line TODO FIX */}
								<div className='absolute right-0 bottom-0 left-0 h-0.5 bg-gray-200'>
									<div className={`h-full bg-teal-600 transition-all duration-300 ${activeTab === 'step1' ? 'w-1/3 translate-x-0' : activeTab === 'step2' ? 'w-1/3 translate-x-full' : 'w-1/3 translate-x-[200%]'}`} />
								</div>
							</div>

							{/* Tab Content */}
							<div className='mt-8'>
								<div className={activeTab === 'step1' ? '' : 'hidden'}>
									<InputForm onSubmit={onInputFormSubmit} />
								</div>
								{activeTab === 'step2' && <div content={markdownContent}>Loading…</div>}
								{activeTab === 'step3' && <div diffs={diffData} />}
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
