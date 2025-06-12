import { normalizeMultiLinesText } from '@/lib/isomorphic/generic/normalizers/string/index';
import { type State } from './types';
import assert from 'tiny-invariant';

import { isStep1Complete } from './selectors';

import { type ExtractedStructure } from './ai';

/////////////////////////////////////////////////

export function create(): State {
	return {
		inputFormTextsConcatenatedNormalized: undefined,

		ↆsectionsExtractionPromise: undefined,
		extractedSectionsForReview: undefined,
		inputTextCleanedByAI: undefined,

		activeTab: 'step1',
	};
}

function _resetStep3(state: State): State {
	return state; // step 3 not implemented
}

function _resetStep2(state: State): State {
	if (state.ↆsectionsExtractionPromise || state.extractedSectionsForReview || state.inputTextCleanedByAI) {
		state = {
			...state,
			ↆsectionsExtractionPromise: undefined,
			extractedSectionsForReview: undefined,
			inputTextCleanedByAI: undefined,
		};
	}

	return _resetStep3(state);
}

export function onInputFormSubmit(state: State, texts: Array<string>): State {

	const inputFormTextsConcatenatedNormalized = texts
		.map(normalizeMultiLinesText)
		.filter(t => !!t)
		.join('\n\n\n');

	if (state.inputFormTextsConcatenatedNormalized !== inputFormTextsConcatenatedNormalized) {
		state = _resetStep2({
			...state,
			inputFormTextsConcatenatedNormalized,
		});
	}

	return state;
}

export function onExtractionInitiated(state: State, request: Promise<ExtractedStructure>): State {
	assert(isStep1Complete(state));

	return {
		...state,
		ↆsectionsExtractionPromise: request.then(res => res.sections),
		activeTab: 'step2',
	};
}

export function onExtractionSuccess(state: State, result: ExtractedStructure): State {
	state = {
		...state,
		//ↆsectionsExtractionPromise: undefined,
		extractedSectionsForReview: result.sections,
		inputTextCleanedByAI: result.raw_cleaned,
	};

	return _resetStep3(state);
}

export function setActiveTab(state: State, targetTab: State['activeTab']): State {

	if (state.activeTab === targetTab) return state;

	return {
		...state,
		activeTab: targetTab,
	};
}
