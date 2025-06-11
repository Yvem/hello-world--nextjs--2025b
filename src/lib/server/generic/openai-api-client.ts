'use server';

import { once } from 'limit-once';
import OpenAI from 'openai';
import { type ClientOptions } from 'openai';

/////////////////////////////////////////////////

const _getOpenAIClient = once(function _getOpenAIClient(config?: ClientOptions) {
	return new OpenAI({
		apiKey: process.env.OAIAK,
		logLevel: 'debug',
		...config,
	});
});

export async function getOpenAIClient(config?: ClientOptions): Promise<OpenAI> {
	return _getOpenAIClient(config);
}
