import OpenAI from 'openai';
import assert from 'tiny-invariant';

import { zodTextFormat } from 'openai/helpers/zod';
import { type ZodType } from 'zod';

import type { Conversation } from './types';
import { RECOMMENDED_UNICODE_NORMALIZATION } from '@/lib/isomorphic/generic/normalizers/string/index';

/////////////////////////////////////////////////

const MARKER_BEGIN = '~#BEGIN#~';
const MARKER_END = '~#END#~';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PRERECORDED_OPENAI_API_RESPONSE_FOR_DEV = any;

/////////////////////////////////////////////////

async function promptToTextOutput(client: OpenAI, input: Conversation, _fake_response?: PRERECORDED_OPENAI_API_RESPONSE_FOR_DEV) {
	const response = await (_fake_response ||
		client.responses.create({
			model: 'gpt-4o-mini', // XXX
			input,
		}));

	if (!_fake_response) {
		console.log('/////// GOT prompt-to-text response', JSON.stringify(response));
	}

	const { error, output } = response;
	if (error) throw error;

	assert(output.length === 1, `unexpected multi output!`);

	const message = output[0]!;
	assert(message.status === 'completed', `unexpected message status!`);
	assert(message.role === 'assistant', `unexpected message role!`);
	assert(message.content.length === 1, `unexpected multi message!`);

	let content = message.content[0]!.text.trim();
	if (content.startsWith(MARKER_BEGIN)) content = content.slice(MARKER_BEGIN.length);
	if (content.endsWith(MARKER_END)) content = content.slice(0, -MARKER_END.length);

	return content.normalize(RECOMMENDED_UNICODE_NORMALIZATION).trim();
}

async function promptToStructuredJsonOutput(client: OpenAI, input: Conversation, zodObject: ZodType, _fake_response?: PRERECORDED_OPENAI_API_RESPONSE_FOR_DEV) {
	// TODO 1D auto wrap + unwrap arrays

	const response = await (_fake_response ||
		client.responses.parse({
			model: 'gpt-4o-mini', // XXX
			input,
			text: {
				format: zodTextFormat(zodObject, 'result'),
			},
		}));

	if (!_fake_response) {
		console.log('/////// GOT prompt-to-JSON response', JSON.stringify(response));
	}

	const { error, output } = response;
	if (error) throw error;

	assert(output.length === 1, `unexpected multi output!`);

	const message = output[0]!;
	assert(message.status === 'completed', `unexpected message status!`);
	assert(message.role === 'assistant', `unexpected message role!`);
	assert(message.content.length === 1, `unexpected multi message!`);

	const parsed = message.content[0]!.parsed;

	return parsed;
}

/////////////////////////////////////////////////

export { MARKER_BEGIN, MARKER_END, promptToTextOutput, promptToStructuredJsonOutput, type PRERECORDED_OPENAI_API_RESPONSE_FOR_DEV };
