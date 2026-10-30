
const questions = {
  q1: { answer: 1, explanation: 'Amazon EC2 provides resizable virtual computing capacity.' },
  q2: { answer: 2, explanation: 'Amazon S3 is an object storage service.' },
  q3: { answer: 1, explanation: 'AWS IAM manages identities and access permissions.' },
  q4: { answer: 0, explanation: 'Amazon CloudWatch monitors metrics, logs and alarms.' },
  q5: { answer: 1, explanation: 'Availability Zones are distinct locations within an AWS Region.' },
  q6: { answer: 1, explanation: 'Elasticity allows resources to adjust to changing demand.' },
  q7: { answer: 2, explanation: 'AWS and customers share security responsibilities depending on the service.' },
  q8: { answer: 0, explanation: 'Pay-as-you-go pricing reduces the need for large upfront hardware investments.' },
  q9: { answer: 1, explanation: 'Amazon EBS provides block storage volumes for EC2.' },
  q10: { answer: 2, explanation: 'Amazon RDS manages relational databases.' },
  q11: { answer: 0, explanation: 'Amazon EFS provides a shared file system.' },
  q12: { answer: 1, explanation: 'MFA adds another layer of identity verification.' },
  q13: { answer: 1, explanation: 'Least privilege grants only the permissions required.' },
  q14: { answer: 0, explanation: 'AWS KMS helps create and manage cryptographic keys.' },
  q15: { answer: 1, explanation: 'Amazon CloudWatch collects monitoring data and supports alarms.' },
  q16: { answer: 0, explanation: 'AWS CloudTrail records account activity and supported API events.' },
  q17: { answer: 0, explanation: 'AWS Systems Manager helps manage and operate AWS resources.' },
  q18: { answer: 0, explanation: 'Amazon VPC provides a logically isolated virtual network in AWS.' },
  q19: { answer: 1, explanation: 'Security groups control inbound and outbound traffic for associated resources.' },
  q20: { answer: 1, explanation: 'Amazon Route 53 provides DNS and domain registration services.' }
};

export const handler = async (event) => {
  try {
    const body = typeof event.body === 'string'
      ? JSON.parse(event.body)
      : event.body ?? event;

    const { answers } = body ?? {};
    const ids = Object.keys(questions);

    if (!answers || typeof answers !== 'object' || Array.isArray(answers)) {
      return response(400, { message: 'Valid answers object is required' });
    }

    if (
      Object.keys(answers).length !== ids.length ||
      ids.some(id => !Object.hasOwn(answers, id)) ||
      Object.keys(answers).some(id => !Object.hasOwn(questions, id))
    ) {
      return response(400, { message: 'Answers for all 20 questions are required' });
    }

    for (const id of ids) {
      if (!Number.isInteger(answers[id]) || answers[id] < 0 || answers[id] > 3) {
        return response(400, { message: `Invalid answer choice for ${id}` });
      }
    }

    const correct = ids.filter(id => answers[id] === questions[id].answer).length;
    const score = Math.round((correct / ids.length) * 100);

    return response(200, {
      message: 'Quiz evaluated successfully',
      totalQuestions: ids.length,
      correctAnswers: correct,
      score,
      passedPracticeThreshold: score >= 70
    });
  } catch {
    return response(400, { message: 'Invalid request' });
  }
};

function response(statusCode, body) {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  };
}



