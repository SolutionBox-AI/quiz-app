// admin.js
async function uploadQuiz() {
  const testId = document.getElementById('testId').value.trim();
  const questionData = document.getElementById('questionData').value.trim();

  if (!testId || !questionData) {
    alert("Test ID and question data required");
    return;
  }

  try {
    const res = await fetch('https://YOUR_BACKEND_URL/api/questions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        testId: testId,
        questions: JSON.parse(questionData)
      })
    });

    const data = await res.json();
    alert(data.message || 'Uploaded');
  } catch (err) {
    alert("Error uploading quiz");
    console.error(err);
  }
}
