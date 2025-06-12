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

export function getExtractedStructureAsMarkdown(state: State): string {
	assert(isStep1Complete(state));

	return state
		.extractedSectionsForReview!.map(
			section => `
## ${section.title}

> ${section.subtitle}

${section.excerpt}

	`
		)
		.join('\n');
}

export function isStep2Available(state: State): boolean {
	if (state.ↆsectionsExtractionPromise) {
		return true;
	}

	if (state.extractedSectionsForReview) {
		assert(!state.ↆsectionsExtractionPromise && state.inputTextCleanedByAI && state.extractedSectionsForReview, `Step2 state should be coherent!`);
		return true;
	}

	return false;
}

export function isStep3Available(state: State): boolean {
	return false; // not implemented
}

export function getRawInputText(state: State): string {
	assert(state.inputFormTextsConcatenatedNormalized);

	return state.inputFormTextsConcatenatedNormalized;
}
