
import './style.css'

const API_URL = 'https://ug6p5yxoqqfxspswdaoo6h2yv40kewcc.lambda-url.eu-north-1.on.aws/'

const questions = [
  { id: 'q1', topic: 'Cloud Concepts', question: 'Which AWS service provides resizable virtual servers?', options: ['Amazon S3', 'Amazon EC2', 'Amazon Route 53', 'AWS IAM'] },
  { id: 'q2', topic: 'Storage', question: 'Which AWS service is designed for object storage?', options: ['Amazon RDS', 'AWS Lambda', 'Amazon S3', 'Amazon VPC'] },
  { id: 'q3', topic: 'Security', question: 'Which service manages AWS users and permissions?', options: ['Amazon CloudFront', 'AWS IAM', 'Amazon Route 53', 'Amazon SQS'] },
  { id: 'q4', topic: 'Monitoring', question: 'Which service collects AWS metrics and creates alarms?', options: ['Amazon CloudWatch', 'Amazon S3', 'AWS Artifact', 'Amazon EBS'] },
  { id: 'q5', topic: 'Cloud Concepts', question: 'What is an AWS Availability Zone?', options: ['A billing account', 'An isolated location within an AWS Region', 'A DNS record', 'A storage bucket'] },
  { id: 'q6', topic: 'Cloud Concepts', question: 'Which cloud principle allows resources to increase or decrease with demand?', options: ['Fault tolerance', 'Elasticity', 'Encryption', 'Authentication'] },
  { id: 'q7', topic: 'Cloud Concepts', question: 'Under the shared responsibility model, who is responsible for security in the cloud?', options: ['AWS only', 'The customer only for every task', 'AWS and the customer, depending on the service', 'The internet service provider'] },
  { id: 'q8', topic: 'Cloud Concepts', question: 'Which cloud benefit helps avoid large upfront hardware investments?', options: ['Pay-as-you-go pricing', 'Manual scaling', 'Hardware purchases', 'Fixed capacity'] },
  { id: 'q9', topic: 'Storage', question: 'Which AWS service provides persistent block storage volumes for EC2?', options: ['Amazon S3', 'Amazon EBS', 'Amazon Route 53', 'AWS CloudTrail'] },
  { id: 'q10', topic: 'Storage', question: 'Which AWS service provides a managed relational database?', options: ['Amazon DynamoDB', 'Amazon S3', 'Amazon RDS', 'Amazon CloudFront'] },
  { id: 'q11', topic: 'Storage', question: 'Which service provides a shared file system that multiple Linux EC2 instances can access?', options: ['Amazon EFS', 'Amazon EBS', 'Amazon SQS', 'Amazon SNS'] },
  { id: 'q12', topic: 'Security', question: 'What is the primary purpose of multi-factor authentication (MFA)?', options: ['Increase storage capacity', 'Add another layer of identity verification', 'Reduce network latency', 'Automatically create backups'] },
  { id: 'q13', topic: 'Security', question: 'What does the principle of least privilege mean?', options: ['Give every user administrator access', 'Give users only the permissions they need', 'Disable all user accounts', 'Share one IAM user across an organization'] },
  { id: 'q14', topic: 'Security', question: 'Which AWS service helps create and manage encryption keys?', options: ['AWS KMS', 'Amazon Route 53', 'Amazon EC2', 'AWS CloudFormation'] },
  { id: 'q15', topic: 'Monitoring', question: 'Which AWS service collects metrics and can trigger alarms?', options: ['AWS CloudTrail', 'Amazon CloudWatch', 'Amazon EFS', 'AWS IAM'] },
  { id: 'q16', topic: 'Monitoring', question: 'Which AWS service records account activity and API events for auditing?', options: ['AWS CloudTrail', 'Amazon RDS', 'Amazon EBS', 'Amazon S3 Glacier'] },
  { id: 'q17', topic: 'Monitoring', question: 'Which AWS service helps manage operational tasks across AWS resources?', options: ['AWS Systems Manager', 'Amazon Route 53', 'Amazon CloudFront', 'Amazon EFS'] },
  { id: 'q18', topic: 'Networking', question: 'What is an Amazon VPC?', options: ['A logically isolated virtual network in AWS', 'A relational database', 'An identity provider only', 'A file storage service'] },
  { id: 'q19', topic: 'Networking', question: 'What do EC2 security groups primarily control?', options: ['Billing invoices', 'Inbound and outbound traffic for associated resources', 'Database backups', 'IAM password policies'] },
  { id: 'q20', topic: 'Networking', question: 'Which AWS service provides DNS domain name resolution and domain registration?', options: ['Amazon CloudWatch', 'Amazon Route 53', 'Amazon EBS', 'AWS KMS'] }
]

let selected = 0
let answers = {}
let submitted = false
let submitting = false
let backendResult = null

document.querySelector('#app').innerHTML = `
  <header class="topbar">
    <div class="brand"><span class="brand-icon">A</span> CloudReady</div>
    <span class="local-tag">LOCAL DEMO</span>
  </header>

  <main class="container">
    <section class="hero">
      <p class="eyebrow">YOUR AWS LEARNING JOURNEY</p>
      <h1>Are you ready for your<br><span>next AWS exam?</span></h1>
      <p class="subtitle">Test your knowledge, discover weak topics, and plan your next revision.</p>
    </section>

    <section class="stats">
      <article class="stat-card"><span>Questions</span><strong id="total">20</strong></article>
      <article class="stat-card"><span>Answered</span><strong id="answered">0</strong></article>
      <article class="stat-card"><span>Score</span><strong id="score">—</strong></article>
    </section>

    <section class="quiz-layout">
      <aside class="panel topics">
        <h2>Exam topics</h2>
        <p class="muted">Practice by topic</p>
        <div id="topic-list"></div>
        <p class="note">Sample questions for learning purposes; not official exam questions.</p>
      </aside>

      <section class="panel quiz">
        <div class="quiz-heading">
          <span id="question-topic" class="topic-pill"></span>
          <span id="progress" class="muted"></span>
        </div>
        <div class="progress-track"><div id="progress-fill"></div></div>
        <h2 id="question"></h2>
        <div id="options" class="options"></div>
        <div id="feedback" aria-live="polite"></div>
        <div class="actions">
          <button id="previous" class="secondary">Previous</button>
          <button id="next" class="primary">Next question →</button>
        </div>
        <button id="submit" class="primary submit-button">Check my readiness</button>
        <button id="restart" class="secondary restart-button">Try again</button>
        <div id="results" aria-live="polite"></div>
      </section>
    </section>
  </main>
`

const $ = selector => document.querySelector(selector)

function renderTopics() {
  const topics = [...new Set(questions.map(q => q.topic))]

  $('#topic-list').innerHTML = topics.map(topic => {
    const total = questions.filter(q => q.topic === topic).length
    const done = questions.filter((q, i) =>
      q.topic === topic && answers[i] !== undefined
    ).length

    return `<div class="topic-row"><span>${topic}</span><span class="muted">${done}/${total}</span></div>`
  }).join('')
}

function renderQuestion() {
  const q = questions[selected]

  $('#question-topic').textContent = q.topic
  $('#progress').textContent = `Question ${selected + 1} of ${questions.length}`
  $('#progress-fill').style.width = `${((selected + 1) / questions.length) * 100}%`
  $('#question').textContent = q.question

  $('#options').innerHTML = q.options.map((option, i) => `
    <button class="option ${answers[selected] === i ? 'selected' : ''}"
      data-option="${i}" ${submitted || submitting ? 'disabled' : ''}>
      <span class="option-letter">${String.fromCharCode(65 + i)}</span>
      <span>${option}</span>
    </button>
  `).join('')

  $('#options').querySelectorAll('[data-option]').forEach(button => {
    button.addEventListener('click', () => {
      if (submitted || submitting) return
      answers[selected] = Number(button.dataset.option)
      $('#feedback').textContent = ''
      render()
    })
  })

  $('#previous').disabled = selected === 0 || submitting
  $('#next').disabled = selected === questions.length - 1 || submitting
  $('#submit').hidden = submitted
  $('#submit').disabled = submitting
  $('#submit').textContent = submitting ? 'Checking answers...' : 'Check my readiness'
  $('#restart').hidden = !submitted
  $('#restart').disabled = submitting

  if (submitted && backendResult) {
    $('#feedback').textContent = 'Your answers have been evaluated by the backend.'
    renderResults()
  } else if (!submitting) {
    $('#results').innerHTML = ''
  }
}

function renderResults() {
  if (!backendResult) return

  const topics = [...new Set(questions.map(q => q.topic))]

  $('#results').innerHTML = `
    <h3>${backendResult.correctAnswers} / ${backendResult.totalQuestions} correct</h3>
    <p>Accuracy: ${backendResult.score}%</p>
    <p>Practice threshold: ${backendResult.passedPracticeThreshold ? 'Reached' : 'Not reached'}</p>
    <p class="muted">This practice quiz cannot predict your official exam result.</p>
    <h3>Topic breakdown</h3>
    ${topics.map(topic => {
      const topicQuestions = questions
        .map((q, index) => ({ ...q, index }))
        .filter(q => q.topic === topic)

      const topicAnswered = topicQuestions.filter(
        q => answers[q.index] !== undefined
      ).length

      return `<p>${topic}: ${topicAnswered} answered out of ${topicQuestions.length}</p>`
    }).join('')}
  `
}

function render() {
  renderQuestion()
  renderTopics()
  $('#total').textContent = questions.length
  $('#answered').textContent = Object.keys(answers).length
  $('#score').textContent = submitted && backendResult ? `${backendResult.score}%` : '—'
}

async function submitAnswers() {
  if (submitting || submitted) return

  if (Object.keys(answers).length !== questions.length) {
    $('#feedback').textContent = 'Answer all questions before checking your readiness.'
    return
  }

  submitting = true
  $('#feedback').textContent = 'Checking your answers...'
  render()

  try {
    const payloadAnswers = Object.fromEntries(
      questions.map((question, index) => [question.id, answers[index]])
    )

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers: payloadAnswers })
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.message || 'The backend could not evaluate the quiz.')
    }

    backendResult = result
    submitted = true
  } catch (error) {
    $('#feedback').textContent =
      `Could not connect to the backend. Check that the local server is running. Details: ${error.message}`
  } finally {
    submitting = false
    render()
  }
}

$('#previous').addEventListener('click', () => {
  if (selected > 0 && !submitting) {
    selected--
    render()
  }
})

$('#next').addEventListener('click', () => {
  if (selected < questions.length - 1 && !submitting) {
    selected++
    render()
  }
})

$('#submit').addEventListener('click', submitAnswers)

$('#restart').addEventListener('click', () => {
  selected = 0
  answers = {}
  submitted = false
  submitting = false
  backendResult = null
  $('#feedback').textContent = ''
  render()
})

render()
