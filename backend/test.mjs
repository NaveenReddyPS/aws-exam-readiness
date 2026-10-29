
import assert from 'node:assert/strict';
import { handler } from './index.mjs';

const correctAnswers = {
  q1: 1, q2: 2, q3: 1, q4: 0, q5: 1,
  q6: 1, q7: 2, q8: 0, q9: 1, q10: 2,
  q11: 0, q12: 1, q13: 1, q14: 0, q15: 1,
  q16: 0, q17: 0, q18: 0, q19: 1, q20: 1
};

function bodyOf(result) {
  return JSON.parse(result.body);
}

const perfect = await handler({
  body: JSON.stringify({ answers: correctAnswers })
});

assert.equal(perfect.statusCode, 200);
assert.equal(bodyOf(perfect).totalQuestions, 20);
assert.equal(bodyOf(perfect).correctAnswers, 20);
assert.equal(bodyOf(perfect).score, 100);
console.log('PASS: All 20 correct answers');

const partialAnswers = { ...correctAnswers, q1: 0 };
const partial = await handler({
  body: JSON.stringify({ answers: partialAnswers })
});

assert.equal(partial.statusCode, 200);
assert.equal(bodyOf(partial).correctAnswers, 19);
assert.equal(bodyOf(partial).score, 95);
console.log('PASS: One incorrect answer');

const missing = await handler({
  body: JSON.stringify({})
});

assert.equal(missing.statusCode, 400);
console.log('PASS: Missing answers rejected');

const invalid = await handler({
  body: JSON.stringify({
    answers: { ...correctAnswers, q1: 9 }
  })
});

assert.equal(invalid.statusCode, 400);
console.log('PASS: Invalid answer choice rejected');

const unknown = await handler({
  body: JSON.stringify({
    answers: { ...correctAnswers, q99: 1 }
  })
});

assert.equal(unknown.statusCode, 400);
console.log('PASS: Unknown question ID rejected');

const malformed = await handler({
  body: '{invalid json'
});

assert.equal(malformed.statusCode, 400);
console.log('PASS: Malformed JSON rejected');

console.log('\nAll 6 backend tests passed!');

