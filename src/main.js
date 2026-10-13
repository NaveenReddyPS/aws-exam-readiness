
import './style.css'

const questions = [
  {
    topic: 'Cloud Concepts',
    question: 'Which AWS service provides resizable virtual servers?',
    options: ['Amazon S3', 'Amazon EC2', 'Amazon Route 53', 'AWS IAM'],
    answer: 1,
    explanation: 'Amazon EC2 provides resizable virtual computing capacity.'
  },
  {
    topic: 'Storage',
    question: 'Which AWS service is designed for object storage?',
    options: ['Amazon RDS', 'AWS Lambda', 'Amazon S3', 'Amazon VPC'],
    answer: 2,
    explanation: 'Amazon S3 is AWS object storage.'
  },
  {
    topic: 'Security',
    question: 'Which service manages AWS users and permissions?',
    options: ['Amazon CloudFront', 'AWS IAM', 'Amazon Route 53', 'Amazon SQS'],
    answer: 1,
    explanation: 'AWS IAM manages identities and access permissions.'
  },
  {
    topic: 'Monitoring',
    question: 'Which service collects AWS metrics and creates alarms?',
    options: ['Amazon CloudWatch', 'Amazon S3', 'AWS Artifact', 'Amazon EBS'],
    answer: 0,
    explanation: 'Amazon CloudWatch monitors metrics, logs and alarms.'
  },
  {
    topic: 'Cloud Concepts',
    question: 'What is an AWS Availability Zone?',
    options: [
      'A billing account',
      'An isolated location within an AWS Region',
      'A DNS record',
      'A storage bucket'
    ],
    answer: 1,
    explanation: 'Availability Zones are distinct locations within an AWS Region.'
  }
]

let selected = 0
let answers = {}
let submitted = false

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
      <article class="stat-card">
        <span>Questions</span>
        <strong id="total">5</strong>
      </article>
      <article class="stat-card">
        <span>Answered</span>
        <strong id="answered">0</strong>
      </article>
      <article class="stat-card">
        <span>Score</span>
        <strong id="score">—</strong>
      </article>
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

const $ = (selector) => document.querySelector(selector)

function renderTopics() {
  const topics = [...new Set(questions.map(q => q.topic))]
  $('#topic-list').innerHTML = topics.map(topic => {
    const total = questions.filter(q => q.topic === topic).length
    const done = questions.filter((q, i) =>
      q.topic === topic && answers[i] !== undefined
    ).length
    return `
      <div class="topic-row">
        <span>${topic}</span>
        <span class="muted">${done}/${total}</span>
      </div>
    `
  }).join('')
}

function renderQuestion() {
  const q = questions[selected]
  $('#question-topic').textContent = q.topic
  $('#progress').textContent = `Question ${selected + 1} of ${questions.length}`
  $('#progress-fill').style.width =
    `${((selected + 1) / questions.length) * 100}%`
  $('#question').textContent = q.question
  $('#options').innerHTML = q.options.map((option, i) => `
    <button class="option ${answers[selected] === i ? 'selected' : ''}"
      data-option="${i}" ${submitted ? 'disabled' : ''}>
      <span class="option-letter">${String.fromCharCode(65 + i)}</span>
      <span>${option}</span>
    </button>
  `).join('')

  $('#options').querySelectorAll('[data-option]').forEach(button => {
    button.addEventListener('click', () => {
      if (submitted) return
      answers[selected] = Number(button.dataset.option)
      render()
    })
  })

  $('#previous').disabled = selected === 0
  $('#next').disabled = selected === questions.length - 1
  $('#submit').hidden = submitted
  $('#restart').hidden = !submitted

  $('#feedback').innerHTML = submitted
    ? `<p>${answers[selected] === q.answer
        ? '✓ Correct answer'
        : `Correct answer: ${q.options[q.answer]}`}</p>
       <p class="muted">${q.explanation}</p>`
    : ''

  $('#results').innerHTML = submitted ? `
    <h3>${questions.filter((q, i) => answers[i] === q.answer).length}
      / ${questions.length} correct</h3>
    <p>Accuracy: ${Math.round(
      questions.filter((q, i) => answers[i] === q.answer).length /
      questions.length * 100
    )}%</p>
    <p class="muted">This short demo cannot predict your official exam result.</p>
    <h3>Topic breakdown</h3>
    ${[...new Set(questions.map(q => q.topic))].map(topic => {
      const qs = questions.map((q, i) => ({ ...q, i }))
        .filter(q => q.topic === topic)
      const correct = qs.filter(q => answers[q.i] === q.answer).length
      return `<p>${topic}: ${correct}/${qs.length} correct</p>`
    }).join('')}
  ` : ''
}

function render() {
  renderQuestion()
  renderTopics()
  $('#answered').textContent = Object.keys(answers).length
  $('#score').textContent = submitted
    ? `${Math.round(questions.filter((q, i) =>
        answers[i] === q.answer
      ).length / questions.length * 100)}%`
    : '—'
}

$('#previous').addEventListener('click', () => {
  selected--
  render()
})

$('#next').addEventListener('click', () => {
  selected++
  render()
})

$('#submit').addEventListener('click', () => {
  if (Object.keys(answers).length !== questions.length) {
    $('#feedback').textContent =
      'Answer all questions before checking your readiness.'
    return
  }
  submitted = true
  render()
})

$('#restart').addEventListener('click', () => {
  selected = 0
  answers = {}
  submitted = false
  render()
})

render()

