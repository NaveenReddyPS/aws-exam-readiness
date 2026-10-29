
export const handler = async (event) => {
  try {
    const body =
      typeof event.body === 'string'
        ? JSON.parse(event.body)
        : event.body ?? event

    const { answers } = body ?? {}

    const correctAnswers = {
      q1: 1, q2: 2, q3: 1, q4: 0, q5: 1,
      q6: 1, q7: 2, q8: 0, q9: 1, q10: 2,
      q11: 0, q12: 1, q13: 1, q14: 0, q15: 1,
      q16: 0, q17: 0, q18: 0, q19: 1, q20: 1
    }

    const questionIds = Object.keys(correctAnswers)

    if (
      !answers ||
      typeof answers !== 'object' ||
      Array.isArray(answers)
    ) {
      return response(400, {
        message: 'Valid answers object is required'
      })
    }

    // Require every question and reject unknown IDs.
    if (
      Object.keys(answers).length !== questionIds.length ||
      questionIds.some(id => !Object.hasOwn(answers, id)) ||
      Object.keys(answers).some(id => !questionIds.includes(id))
    ) {
      return response(400, {
        message: 'Answers for all 20 questions are required'
      })
    }

    for (const id of questionIds) {
      if (
        !Number.isInteger(answers[id]) ||
        answers[id] < 0 ||
        answers[id] > 3
      ) {
        return response(400, {
          message: `Invalid answer choice for ${id}`
        })
      }
    }

    const correct = questionIds.filter(
      id => answers[id] === correctAnswers[id]
    ).length

    const score = Math.round(
      (correct / questionIds.length) * 100
    )

    return response(200, {
      message: 'Quiz evaluated successfully',
      totalQuestions: questionIds.length,
      correctAnswers: correct,
      score,
      passedPracticeThreshold: score >= 70
    })
  } catch {
    return response(400, {
      message: 'Invalid request'
    })
  }
}

function response(statusCode, body) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  }
}

