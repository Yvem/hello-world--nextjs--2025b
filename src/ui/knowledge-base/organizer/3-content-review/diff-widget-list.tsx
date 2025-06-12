'use client';

import React, { useState, use, Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/common/card';
import { Button } from '@/ui/common/button';
import { Check, ChevronDown, ChevronRight, RefreshCw } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/ui/common/collapsible';

interface DiffItem {
	id: string;
	title: string;
	ↆdiff: Promise<{
		oldText: string;
		newText: string;
	}>;
}

interface DiffWidgetListProps {
	diffs: DiffItem[];
}

export default function DiffWidgetList({ diffs }: DiffWidgetListProps) {
	const [acceptedDiffs, setAcceptedDiffs] = useState<Set<string>>(new Set());
	const [collapsedDiffs, setCollapsedDiffs] = useState<Set<string>>(new Set());

	const handleAccept = (id: string) => {
		setAcceptedDiffs(prev => new Set([...prev, id]));
		setCollapsedDiffs(prev => new Set([...prev, id]));
	};

	const handleRetry = (id: string) => {
		setAcceptedDiffs(prev => {
			const newSet = new Set(prev);
			newSet.delete(id);
			return newSet;
		});
	};

	const toggleCollapse = (id: string) => {
		setCollapsedDiffs(prev => {
			const newSet = new Set(prev);
			if (newSet.has(id)) {
				newSet.delete(id);
			} else {
				newSet.add(id);
			}
			return newSet;
		});
	};

	if (!diffs || diffs.length === 0) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>Review Changes</CardTitle>
				</CardHeader>
				<CardContent>
					<p className='py-8 text-center text-gray-500'>No changes to review. Submit the form in the first tab to generate diffs.</p>
				</CardContent>
			</Card>
		);
	}

	return (
		<div className='space-y-4'>
			<div className='flex items-center justify-between'>
				<h3 className='text-lg font-semibold'>Review Changes</h3>
				<div className='text-sm text-gray-500'>
					{acceptedDiffs.size} accepted of {diffs.length} total
				</div>
			</div>

			<div className='space-y-4'>
				{diffs.map(diff => {
					const isAccepted = acceptedDiffs.has(diff.id);
					const isCollapsed = collapsedDiffs.has(diff.id);

					return (
						<Collapsible key={diff.id} open={!isCollapsed} onOpenChange={() => toggleCollapse(diff.id)} className={`rounded-lg border transition-all ${isAccepted ? 'border-green-200 bg-green-50' : 'border border-gray-200'}`}>
							<div className='flex items-center justify-between px-4 py-3'>
								<CollapsibleTrigger className='flex w-full items-center space-x-2 text-left transition-colors hover:text-gray-700'>
									<div className='flex items-center space-x-2'>
										{isCollapsed ? <ChevronRight className='h-4 w-4 text-gray-500' /> : <ChevronDown className='h-4 w-4 text-gray-500' />}
										<span className='font-medium'>{diff.title}</span>
										{/*isAccepted && <Badge className='bg-green-100 text-green-800'>Accepted</Badge>*/}
									</div>
								</CollapsibleTrigger>
								<div className='flex space-x-2'>
									{!isCollapsed && (
										<Button size='sm' variant='outline' onClick={() => handleRetry(diff.id)} disabled={!isAccepted}>
											<RefreshCw className='h-4 w-4' />
											Retry
										</Button>
									)}
									<Button size='sm' variant={isAccepted ? 'default' : 'outline'} onClick={() => handleAccept(diff.id)} disabled={isAccepted} className={isAccepted ? 'bg-green-600 hover:bg-green-700' : ''}>
										<Check className='h-4 w-4' />
										Accept
									</Button>
								</div>
							</div>
							<CollapsibleContent>
								<Suspense fallback={<p>⌛ Improving… (this can take a few minutes, do not refresh this page)</p>}>
									<ReviewableContent item={diff} />
								</Suspense>
							</CollapsibleContent>
						</Collapsible>
					);
				})}
			</div>
		</div>
	);
}

function ReviewableContent({ item }: { item: DiffItem }) {
	const { oldText, newText } = use(item.ↆdiff);

	return (
		<CardContent>
			<div className='grid grid-cols-2 gap-4'>
				<div>
					<div className='mb-2 text-sm font-medium text-gray-700'>Original</div>
					<div className='min-h-[100px] rounded border border-gray-200 bg-gray-50 p-3 text-sm whitespace-pre-wrap'>{oldText}</div>
				</div>
				<div>
					<div className='mb-2 text-sm font-medium text-gray-700'>Improved</div>
					<div className='min-h-[100px] rounded border border-gray-200 bg-gray-50 p-3 text-sm whitespace-pre-wrap'>{newText}</div>
				</div>
			</div>
		</CardContent>
	);
}
