import assert from 'tiny-invariant';

import { type State } from './types';

/////////////////////////////////////////////////

export function getActiveTab(state: State): State['activeTab'] {
	return state.activeTab;
}

export function isStep1Complete(state: State): boolean {
	if (state.inputFormTextsConcatenatedNormalized) {
		return true;
	}

	return false;
}

export function isStep2Complete(state: State): boolean {
	return !!state.extractedSectionsForReview;
}

export function isStep2Displayable(state: State): boolean {
	if (state.ↆsectionsExtractionPromise) {
		return true;
	}

	if (state.extractedSectionsForReview) {
		assert(!state.ↆsectionsExtractionPromise && state.inputTextCleanedByAI && state.extractedSectionsForReview, `Step2 state should be coherent!`);
		return true;
	}

	return false;
}

export function isStep3Displayable(state: State): boolean {
	return isStep2Complete(state);
}

export function getRawInputText(state: State): string {
	assert(state.inputFormTextsConcatenatedNormalized);

	return state.inputFormTextsConcatenatedNormalized;
}

export function getSectionsForReview(state: State) {
	assert(state.extractedSectionsForReview, `getSectionsForReview(): Step2 state should be coherent!`);
	assert(state.improvedContentForReview, `getSectionsForReview(): Step3 state should be coherent!`);

	return state.extractedSectionsForReview;
}
