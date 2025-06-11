import { z } from 'zod';

/////////////////////////////////////////////////

const ZReviewableKnowledgeBaseSection = z.object({
	title: z.string(),
	subtitle: z.string(),
	excerpt: z.string(),
});
export const ZReviewableKnowledgeBaseSections = z.object({
	sections: z.array(ZReviewableKnowledgeBaseSection),
});

export type ReviewableKnowledgeBaseSections = z.infer<typeof ZReviewableKnowledgeBaseSections>;

export interface State {
	/////// step 1
	// input
	inputFormTextsConcatenatedNormalized: undefined | string;

	/////// step 2
	ↆsectionsExtractionPromise: undefined | Promise<void>; // if present, the query is in progress
	extractedSectionsForReview: undefined | ReviewableKnowledgeBaseSections;
	inputTextCleanedByAI: undefined | string; // intermediate output (will be needed in step 3)

	/////// step 3
	// TODO coming soon

	/////// meta
	activeTab: 'step1' | 'step2' | 'step3';
}
