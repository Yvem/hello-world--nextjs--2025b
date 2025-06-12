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

export type ReviewableKnowledgeBaseSections = Array<z.infer<typeof ZReviewableKnowledgeBaseSection>>;

export interface ReviewableContent {
	originalContent: string;
	improvedContent: string;
}

export interface State {
	/////// step 1
	// input
	inputFormTextsConcatenatedNormalized: undefined | string;

	/////// step 2
	ↆsectionsExtractionPromise: undefined | Promise<ReviewableKnowledgeBaseSections>; // to be used with use()
	extractedSectionsForReview: undefined | ReviewableKnowledgeBaseSections;
	inputTextCleanedByAI: undefined | string; // intermediate output (will be needed in step 3)

	/////// step 3
	improvedContentForReview:
		| undefined
		| Array<{
				ↆcontentImprovementPromise: Promise<ReviewableContent>;
		  }>;

	/////// meta
	activeTab: 'step1' | 'step2' | 'step3';
}
