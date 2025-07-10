const BASE_URL = "https://quiz-app-4087.onrender.com";

let questions = [], current = 0, answers = [], selectedTest = "";

// Load test names from backend on page load
    window.onload = () => {
      fetch(`${BASE_URL}/api/quiz/tests`)
        .then(res => res.json())
        .then(tests => {
          const sel = document.getElementById('testSelect');
          sel.innerHTML = '<option value="">--Select Test--</option>';
          tests.forEach(t => {
            const opt = document.createElement('option');
            opt.value = t;
            opt.textContent = t;
            sel.appendChild(opt);
          });
        })
        .catch(err => alert("Failed to load test list."));
    };

function onTestChange(sel) {
  selectedTest = sel.value;
}

function startQuiz() {
  if (!selectedTest) return alert("Please select a test.");

  console.log("Selected test:", selectedTest);


  fetch(`${BASE_URL}/api/quiz/test/${selectedTest}/questions`)
    .then(res => res.json())
    .then(data => {
      questions = data;
      current = 0;
      answers = [];
      document.getElementById('intro').style.display = 'none';
      document.getElementById('quiz').style.display = 'block';
      showQuestion();
    })
    .catch(err => {
      console.error("Error loading questions", err);
      alert("Error loading questions");
    });
}

function showQuestion() {
  const q = questions[current];
  if (!q || !q.question) {
    alert("Invalid question data. Please try another test.");
    goToStart(); // Reset the form
    return;
  }

  const container = document.getElementById('questionContainer');
  container.innerHTML = `
    <div class="question-box active">
      <p><b>Q${current + 1}:</b> ${q.question}</p>
      ${q.options.map(opt => `
        <label>
          <input type="radio" name="opt" value="${opt.label}" ${answers[current] === opt.label ? 'checked' : ''}/>
          ${opt.text}
        </label><br>
      `).join('')}
    </div>
  `;

  document.getElementById('submitBtn').style.display = current === questions.length - 1 ? 'inline' : 'none';
}


function next() {
  saveAnswer();
  if (current < questions.length - 1) {
    current++;
    showQuestion();
  }
}

function prev() {
  saveAnswer();
  if (current > 0) {
    current--;
    showQuestion();
  }
}

function saveAnswer() {
  const selected = document.querySelector('input[name="opt"]:checked');
  if (selected) {
    answers[current] = selected.value;
  }
}

function submitQuiz() {
  saveAnswer();

  const payload = {
    name: document.getElementById('name').value.trim(),
    town: document.getElementById('town').value.trim(),
    code: document.getElementById('code').value.trim(),
    answers
  };

  if (!payload.name || !payload.town || !payload.code || answers.length !== questions.length) {
    alert("Please fill all fields and answer all questions.");
    return;
  }

  fetch(`${BASE_URL}/api/quiz/test/${selectedTest}/submit`, {
    console.log(selectedTest);
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
    .then(response => {
      if (!response.ok) throw new Error("Failed to submit");
      document.getElementById('quiz').style.display = 'none';
      document.getElementById('thankyou').style.display = 'block';
    })
    .catch(err => {
      console.error("Error submitting quiz", err);
      alert("Error submitting quiz");
    });
}

function goToStart() {
  current = 0;
  answers = [];
  questions = [];
  selectedTest = "";

  document.getElementById('quiz').style.display = 'none';
  document.getElementById('intro').style.display = 'block';
  document.getElementById('thankyou').style.display = 'none';

  document.getElementById('name').value = '';
  document.getElementById('town').value = '';
  document.getElementById('code').value = '';
  document.getElementById('testSelect').value = '';
}

window.onload = loadTests;
