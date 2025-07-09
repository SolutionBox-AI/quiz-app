const BASE_URL = `https://quiz-app-4087.onrender.com`; // replace with yours

function createTest() {
  const testId = document.getElementById('testId').value.trim();
  if (!testId) return alert("Please enter a test ID.");

  fetch(`${BASE_URL}/api/quiz/test/${testId}/create`, {
    method: 'POST'
  })
    .then(res => res.json())
    .then(data => {
      document.getElementById('message').textContent = data.message || "Test created.";
    })
    .catch(err => {
      console.error("Error creating test:", err);
      alert("Error creating test");
    });
}

function downloadResponses() {
  const testId = document.getElementById('testId').value.trim();
  if (!testId) return alert("Enter test ID first");

  window.open(`${BASE_URL}/api/quiz/test/${testId}/responses`, '_blank');
}
