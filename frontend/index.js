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
  const testId = document.getElementById('testId').value.trim();
  const studentName = document.getElementById('studentName').value.trim();

  if (!testId || !studentName) {
    alert("Please enter both name and test ID.");
    return;
  }

  try {
    const res = await fetch(`https://your-backend.onrender.com/api/questions/${testId}`);
    questions = await res.json();

    if (!questions.length) {
      alert("No questions found for this test.");
      return;
    }

    responses = [];
    currentIndex = 0;
    quizSection.style.display = 'block';
    startBtn.style.display = 'none';
    showQuestion();

  } catch (err) {
    console.error("Failed to load questions:", err);
    alert("Error loading quiz.");
  }
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
      <label><input type="radio" name="option" value="${opt}"> ${opt}</label><br/>
    `;
  });
}

async function submitAnswers() {
  const studentName = document.getElementById('studentName').value;
  const testId = document.getElementById('testId').value;

  try {
    await fetch('https://your-backend.onrender.com/api/responses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentName, testId, answers: responses })
    });

    quizSection.style.display = 'none';
    thankYou.style.display = 'block';
  } catch (err) {
    console.error("Error submitting responses:", err);
    alert("Submission failed.");
  }
}
