'use client';

import React, { Suspense, useState, use } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/ui/common/card';
import * as State from '@/lib/isomorphic/business/knowledge-base/organizer/index';
import InputForm from '@/ui/knowledge-base/organizer/1-form/index';
import { extractStructure } from '@/ui/knowledge-base/organizer/server-functions';
import MarkdownRenderer from '@/ui/common/markdown-renderer';
import { Button } from '@/ui/common/button';
import assert from 'tiny-invariant';

export default function Page() {
	const [state, setState] = useState(State.create());

	const activeTab = State.getActiveTab(state);

	const diffData = [];

	function onTabClick(targetTab: State.State['activeTab']) {
		switch (targetTab) {
			case 'step1':
				// always allowed
				break;
			case 'step2':
				if (!State.isStep2Displayable(state)) return;
				break;
			case 'step3':
				if (!State.isStep3Displayable(state)) return;
				break;
			default:
				throw new Error('Wrong target tab!');
		}

		setState(state => State.setActiveTab(state, targetTab));
	}

	const onInputFormSubmit = async (texts: Array<string>) => {

		try {
			setState(state => {
				state = State.onInputFormSubmit(state, texts);

				const result = extractStructure(State.getRawInputText(state));
				state = State.onExtractionInitiated(state, result.then());

				result.then(
					result => {
						setTimeout(() => setState(state => State.onExtractionSuccess(state, result)), 100);
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
							<TabSelector state={state} onTabClick={onTabClick} />

							{/* Tab Content */}
							<div className='mt-8'>
								<div className={activeTab === 'step1' ? '' : 'hidden' /* hide it instead of unmounting it to not lose its state */}>
									<InputForm onSubmit={onInputFormSubmit} />
								</div>
								{activeTab === 'step2' && <Step2 state={state} onButtonClick={(b: 'next' | 'retry') => (b === 'next' ? onTabClick('step3') : onInputFormSubmit([state.inputFormTextsConcatenatedNormalized!]))} />}
								{activeTab === 'step3' && <div diffs={diffData} />}
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}

function Step2({ state, onButtonClick }: { state: State.State; onButtonClick: (type: 'next' | 'retry') => void }) {
	return (
		<div>
			<div className='mb-4'>
				<h2 className='mb-2 text-2xl font-bold text-gray-900'>Structure preview</h2>
				<p className='text-gray-600'>Review the outline of your knowledge base:</p>
			</div>
			<Suspense fallback={<p>⌛ Extracting… (this can take a few minutes, do not refresh this page)</p>}>
				<Step2StructurePreview state={state} />

				<Button className='bg-teal-600 hover:bg-teal-700' onClick={() => onButtonClick('retry')}>
					Retry
				</Button>

				<Button className='bg-teal-600 hover:bg-teal-700' onClick={() => onButtonClick('next')}>
					Next
				</Button>
			</Suspense>
		</div>
	);
}

function Step2StructurePreview({ state }: { state: State.State }) {
	assert(state.ↆsectionsExtractionPromise, `<Step2> should be called in the right state!`);

	const sections = use(state.ↆsectionsExtractionPromise);

	return (
		<Card>
			<CardContent className='pt-6'>
				<ol>
					{sections.map(section => {
						return (
							<li key={section.title}>
								<strong>{section.title}</strong>
								<br />
								<p className='mb-4'>{section.subtitle}</p>
							</li>
						);
					})}
				</ol>
			</CardContent>
		</Card>
	);
}

function TabSelector({ state, onTabClick }: { state: State.State; onTabClick: (target: State.State['activeTab']) => void }) {
	const activeTab = State.getActiveTab(state);

	return (
		<div className='relative mb-8 flex items-center justify-between'>
			{/* Tab 1 - Data Input */}
			<div className={`flex flex-1 cursor-pointer items-center space-x-4 p-4 transition-all ${activeTab === 'step1' || State.isStep1Complete(state) ? 'text-teal-600' : 'text-gray-600'}`} onClick={() => onTabClick('step1')}>
				<div className={`flex h-12 w-12 items-center justify-center rounded-full font-semibold text-white ${activeTab === 'step1' || State.isStep1Complete(state) ? 'bg-teal-600' : 'bg-gray-600'}`}>{State.isStep2Displayable(state) && activeTab !== 'step1' ? '✓' : '01'}</div>
				<div className='flex-1'>
					<h3 className='text-lg font-semibold'>Data Input</h3>
					<p className='text-sm text-gray-500'>Provide your KB raw data</p>
				</div>
			</div>

			<ArrowSeparator />

			{/* Tab 2 - Markdown Preview */}
			<div className={`flex flex-1 cursor-pointer items-center space-x-4 transition-all ${activeTab === 'step2' || State.isStep2Complete(state) ? 'text-teal-600' : 'text-gray-400'}`} onClick={() => onTabClick('step2')}>
				<div className={`flex h-12 w-12 items-center justify-center rounded-full font-semibold text-white ${activeTab === 'step2' || State.isStep2Complete(state) ? 'bg-teal-600' : 'bg-gray-400'}`}>{State.isStep3Displayable(state) && activeTab === 'step3' ? '✓' : '02'}</div>
				<div className='flex-1'>
					<h3 className='text-lg font-semibold'>Review</h3>
					<p className='text-sm text-gray-500'>Review the extracted structure</p>
				</div>
			</div>

			<ArrowSeparator />

			{/* Tab 3 - Review Changes */}
			<div className={`flex flex-1 cursor-pointer items-center space-x-4 transition-all ${activeTab === 'step3' ? 'text-teal-600' : 'text-gray-400'}`} onClick={() => onTabClick('step3')}>
				<div className={`flex h-12 w-12 items-center justify-center rounded-full font-semibold text-white ${activeTab === 'step3' ? 'bg-teal-600' : 'bg-gray-400'}`}>03</div>
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
	);
}

function ArrowSeparator() {
	return (
		<div className='px-4'>
			<svg width='24' height='24' viewBox='0 0 24 24' fill='none' className='text-gray-300'>
				<path d='M9 18L15 12L9 6' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
			</svg>
		</div>
	);
}
