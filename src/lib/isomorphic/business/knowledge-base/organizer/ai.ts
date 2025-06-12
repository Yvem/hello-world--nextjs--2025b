import OpenAI from 'openai';

import { normalizeMultiLinesText } from '@/lib/isomorphic/generic/normalizers/string/index';

import { promptToTextOutput, promptToStructuredJsonOutput, MARKER_BEGIN, MARKER_END } from '@/lib/isomorphic/generic/llm/index';

import { ZReviewableKnowledgeBaseSections, type ReviewableKnowledgeBaseSections } from './types';

/////////////////////////////////////////////////

interface ExtractedStructure {
	raw_cleaned: string;
	sections: ReviewableKnowledgeBaseSections;
}

async function extractStructure(client: OpenAI, input: string, _fake_responses_chain: Array<any> = []): Promise<ExtractedStructure> {
	const improved_concatenated_input_2_improved = await promptToTextOutput(
		client,
		[
			{
				role: 'system',
				content: `
You are a genius content writer, proofreader and grammarian. You can easily fix typos, formatting mistakes and minor grammatical errors.
			`,
			},
			{
				role: 'developer',
				content: `
Proofread the texts that you're given by the user:
1. fix misformatted words, for example cut in half with a space: "he llo" -> "hello".
1. fix typos.
1. fix misspelled words.
1. fix small grammatical mistakes.
1. remove spurious numbers appearing at the beginning or end of a line when you're sure they're not part of the surrounding sentences.
1. collate split sentences when you're sure words on different lines are from the same sentence.

Return a text as close as possible to the original. Only fix what you're very confident is an error. Do NOT add content. Do NOT delete content, unless you replace it with fixed content.
			`,
			},
			{
				role: 'developer',
				content: `
Example: This text:

${MARKER_BEGIN}
42 Repor ting Work-Related
Grievances
Atlassian™s should report
03
${MARKER_END}

Should be fixed into:

${MARKER_BEGIN}
## Reporting Work-Related Grievances
Atlassians should report
${MARKER_END}
			`,
			},
			{
				role: 'developer',
				content: `
Reminder:
1. fix misformatted words, for example cut in half with a space: "he llo" -> "hello".
1. fix typos.
1. fix misspelled words.
1. fix small grammatical mistakes.
1. remove spurious numbers appearing at the beginning or end of a line when you're sure they're not part of the surrounding sentences.
1. collate split sentences when you're sure words on different lines are from the same sentence.

Return a text as close as possible to the original. Only fix what you're very confident is an error. Do NOT add content. Do NOT delete content, unless you replace it with fixed content.

Proofread this text and return only the improved text without any other message:
			`,
			},
			{
				role: 'user',
				content: [MARKER_BEGIN, input, MARKER_END].join('\n'),
			},
		],
		_fake_responses_chain.shift()
	);

	const improved_concatenated_input_3_improved = normalizeMultiLinesText(improved_concatenated_input_2_improved);

	const { sections } = await promptToStructuredJsonOutput(
		client,
		[
			{
				role: 'system',
				content: `
You are a genius knowledge worker specialized in writing clear and structured documentation.
			`,
			},
			{
				role: 'developer',
				content: `
Read the raw text below and group the knowledge it contains into specific sections.

Those sections must NOT be too generic. All the knowledge should belong to a sections. Add a sections if needed.

Output an ordered list of those sections with, for each section:
- a title
- a subtitle
- an excerpt

The subtitle MUST hint at the content and MUST NOT paraphrase the title.

The excerpt MUST contain the most critical and relevant 1 or 2 paragraphs of text that correspond to this category.

Order the sections in logical order AND importance order.
			`,
			},
			{
				role: 'developer',
				content: `
Example: This text:

${MARKER_BEGIN}
work hours
Employees are expected to work 9 to 5.

recruitment process
Employees will have to provide 2 references and an ID.

flexible working hours
Employees can move their work hours flexibly by agreement with their team.
${MARKER_END}

Should yield:

${MARKER_BEGIN}
{
  "sections": [
    { "title": "Recruitment process", "subtitle": "More details about your obligations during the recruitment process.", "excerpt: "Employees will have to provide 2 references and an ID." },
    { "title": "Work hours", "subtitle": "Everything you need to know about normal and flexible work hours.", "excerpt: "Employees are expected to work 9 to 5. Employees can move their work hours flexibly by agreement with their team." },
  ]
}
${MARKER_END}
			`,
			},
			{
				role: 'developer',
				content: `
Read the raw text below and extract ordered sections as instructed:
			`,
			},
			{
				role: 'user',
				content: [MARKER_BEGIN, improved_concatenated_input_3_improved, MARKER_END].join('\n'),
			},
		],
		ZReviewableKnowledgeBaseSections,
		_fake_responses_chain.shift()
	);

	const result: ExtractedStructure = {
		raw_cleaned: improved_concatenated_input_3_improved,
		sections,
	};

	return result;
}

/////////////////////////////////////////////////

interface ImprovedKnowledgeBaseSection {
	title: string;
	subtitle: string;
	content: string;
	_originalContent: string;
}

interface FilterAndImproveSectionInput {
	rawContent: string;

	topic: string;
	topicDetails: string;
}
async function filterAndImproveSection(client: OpenAI, input: FilterAndImproveSectionInput, _fake_responses_chain: Array<any> = []): Promise<ImprovedKnowledgeBaseSection> {
	const relevant_kb_content = await promptToTextOutput(
		client,
		[
			{
				role: 'system',
				content: `
You are a genius knowledge worker specialized in writing clear and structured documentation.
			`,
			},
			{
				role: 'developer',
				content: `
Select from the given text the parts related to the given topic. Filter out the parts NOT related to the given topic.

Do NOT add content. Only REMOVE irrelevant content.
			`,
			},
			{
				role: 'developer',
				content: `
Example: Starting from this text:

${MARKER_BEGIN}
work hours
Employees are expected to work 9 to 5.

recruitment process
Employees will have to provide 2 references and an ID.

flexible working hours
Employees can move their work hours flexibly by agreement with their team.
${MARKER_END}

When asked to keep only parts related to "work hours", should yield:

${MARKER_BEGIN}
work hours
Employees are expected to work 9 to 5.

flexible working hours
Employees can move their work hours flexibly by agreement with their team.
${MARKER_END}
			`,
			},
			{
				role: 'developer',
				content: `
Now select from the given text the parts related to the given topic "${input.topic}". Filter out the parts NOT related to the given topic "${input.topicDetails}":
			`,
			},
			{
				role: 'user',
				content: [MARKER_BEGIN, input.rawContent, MARKER_END].join('\n'),
			},
		],
		_fake_responses_chain.shift()
	);

	const improved_kb_content_1 = normalizeMultiLinesText(relevant_kb_content);

	let improved_kb_content_2 = await promptToTextOutput(
		client,
		[
			{
				role: 'system',
				content: `
You are a genius knowledge worker specialized in writing clear and structured documentation.
			`,
			},
			{
				role: 'developer',
				content: `
Improve the given text:
1. remove duplicated content.
1. sort the content in logical order: introduce base concepts first and in order of criticity.
1. make the content clear and readable using the best writing practices: keep things simple; get rid of extra words; Write short sentences; Avoid putting multiple thoughts in one sentence; Use active voice.
1. if a concept is unclear or not previously introduced, you MAY add an introduction of the concept or expend it a little.
1. make the content engaging but stay professional.
1. turn the content into well-formatted markdown.

Do NOT add any new content, only reformat/reword/improve the existing content.
			`,
			},
			{
				role: 'developer',
				content: `
Now turn this text into a well structured, clear, engaging improved markdown version:
			`,
			},
			{
				role: 'user',
				content: [MARKER_BEGIN, improved_kb_content_1, MARKER_END].join('\n'),
			},
		],
		_fake_responses_chain.shift()
	);

	improved_kb_content_2 = improved_kb_content_2.trim();
	if (improved_kb_content_2.startsWith('```markdown')) improved_kb_content_2 = improved_kb_content_2.slice('```markdown'.length).trim();
	if (improved_kb_content_2.startsWith('```md')) improved_kb_content_2 = improved_kb_content_2.slice('```md'.length).trim();
	if (improved_kb_content_2.startsWith('```')) improved_kb_content_2 = improved_kb_content_2.slice('```'.length).trim();
	if (improved_kb_content_2.endsWith('```')) improved_kb_content_2 = improved_kb_content_2.slice(0, -'```'.length).trim();

	const result: ImprovedKnowledgeBaseSection = {
		title: input.topic,
		subtitle: input.topicDetails,
		content: improved_kb_content_2,
		_originalContent: relevant_kb_content,
	};

	return result;
}

/////////////////////////////////////////////////

export { extractStructure, type ExtractedStructure, filterAndImproveSection, type FilterAndImproveSectionInput, type ImprovedKnowledgeBaseSection };
