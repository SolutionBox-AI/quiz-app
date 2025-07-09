
const fs = require('fs');
const path = require('path');
const mammoth = require('mammoth');

exports.uploadQuiz = async (req, res) => {
  if (!req.files || !req.files.docx) {
    return res.status(400).send('No file uploaded');
  }

  const docFile = req.files.docx;
  const filePath = path.join(__dirname, '..', 'uploads', docFile.name);

  await docFile.mv(filePath);

  try {
    const result = await mammoth.convertToHtml({ path: filePath });
    res.json({ html: result.value });
  } catch (error) {
    res.status(500).json({ error: 'Failed to parse .docx file' });
  }
};
