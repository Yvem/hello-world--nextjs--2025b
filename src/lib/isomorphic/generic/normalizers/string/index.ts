/////////////////////////////////////////////////

const RECOMMENDED_UNICODE_NORMALIZATION = 'NFC'; // https://www.win.tue.nl/~aeb/linux/uc/nfc_vs_nfd.html

// https://stackoverflow.com/a/1981366/587407
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_expressions/Character_classes#types
const ANY_BLANK_REGEXP = /\s+/g;
function coerceBlanksToSingleSpaces(s: string): string {
	return s.replace(ANY_BLANK_REGEXP, ' ');
}

const MANY_LINE_SEPS = Array.from({ length: 7 }, () => '\n').join('');
function normalizeMultiLinesText(raw: string): string {
	let result = raw || '';
	result = result.normalize(RECOMMENDED_UNICODE_NORMALIZATION);
	result = result.trim();

	for (let i = MANY_LINE_SEPS.length; i > 1; --i) {
		result = result.split(MANY_LINE_SEPS.slice(-i)).join(MANY_LINE_SEPS.slice(-2));
	}

	result = result
		.split(MANY_LINE_SEPS.slice(-2))
		.map(p =>
			p
				.split(MANY_LINE_SEPS.slice(-1))
				.map(coerceBlanksToSingleSpaces)
				.map(fragment => fragment.trim())
				.join(' ')
		)
		.join(MANY_LINE_SEPS.slice(-2));

	return result;
}

/////////////////////////////////////////////////

export { RECOMMENDED_UNICODE_NORMALIZATION, coerceBlanksToSingleSpaces, normalizeMultiLinesText };
