const startBtn = document.getElementById('startBtn');
const nextBtn = document.getElementById('nextBtn');
const quizSection = document.getElementById('quizSection');
const questionBox = document.getElementById('questionBox');
const optionsBox = document.getElementById('optionsBox');
const thankYou = document.getElementById('thankYou');

let questions = [];
let currentIndex = 0;
let responses = [];

startBtn.onclick = async () => {
  const testId = document.getElementById('testId').value;
  const studentName = document.getElementById('studentName').value;

  if (!testId || !studentName) {
    alert("Please fill in both fields.");
    return;
  }

  const res = await fetch(`https://quiz-app-4087.onrender.com/api/questions/${testId}`);
  questions = await res.json();

  if (questions.length === 0) {
    alert("No questions found.");
    return;
  }

  responses = [];
  currentIndex = 0;
  quizSection.style.display = 'block';
  startBtn.style.display = 'none';
  showQuestion();
};

nextBtn.onclick = () => {
  const selected = document.querySelector('input[name="option"]:checked');
  if (!selected) {
    alert("Please select an option.");
    return;
  }

  responses.push({
    questionId: questions[currentIndex]._id,
    selectedOption: selected.value
  });

  currentIndex++;

  if (currentIndex >= questions.length) {
    submitAnswers();
  } else {
    showQuestion();
  }
};

function showQuestion() {
  const q = questions[currentIndex];
  questionBox.innerHTML = `<h3>${q.question}</h3>`;

  optionsBox.innerHTML = "";
  q.options.forEach((opt, i) => {
    optionsBox.innerHTML += `
      <label><input type="radio" name="option" value="${opt}"/> ${opt}</label><br/>
    `;
  });
}

async function submitAnswers() {
  const studentName = document.getElementById('studentName').value;
  const testId = document.getElementById('testId').value;

  await fetch('https://your-backend-url.onrender.com/api/responses', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ studentName, testId, answers: responses })
  });

  quizSection.style.display = 'none';
  thankYou.style.display = 'block';
}
