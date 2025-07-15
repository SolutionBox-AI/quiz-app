const express = require('express');
const router = express.Router();
const Response = require('../models/Response');

// POST: Save student response
router.post('/', async (req, res) => {
  try {
    const response = new Response(req.body);
    await response.save();
    res.json({ message: 'Response saved successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save response' });
  }
});

// GET: Fetch all responses (admin use)
router.get('/', async (req, res) => {
  try {
    const responses = await Response.find();
    res.json(responses);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch responses' });
  }
});

module.exports = router;

