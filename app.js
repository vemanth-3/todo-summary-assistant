const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Supabase setup
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// GET all todos
app.get('/todos', async (req, res) => {
  try {
    const { data, error } = await supabase.from('todos').select('*');
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST create a new todo
app.post('/todos', async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'Text is required' });

  try {
    const { data, error } = await supabase
      .from('todos')
      .insert([{ text }])
      .select(); // return inserted rows
    if (error) throw error;
    res.status(201).json(data[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT update todo by id
app.put('/todos/:id', async (req, res) => {
  const { id } = req.params;
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'Text is required' });

  try {
    const { data, error } = await supabase
      .from('todos')
      .update({ text })
      .eq('id', id)
      .single();
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE todo by id
app.delete('/todos/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const { error } = await supabase.from('todos').delete().eq('id', id);
    if (error) throw error;
    res.json({ message: 'Todo deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /summarize - summarize todos and send to Slack using OpenAI or fallback mock
app.post('/summarize', async (req, res) => {
  try {
    // 1. Fetch todos
    const { data: todos, error } = await supabase.from('todos').select('*');
    if (error) throw error;

    if (!todos || todos.length === 0) {
      return res.status(400).json({ message: 'No todos to summarize.' });
    }

    // 2. Build text to summarize
    const todoText = todos.map(todo => `- ${todo.text}`).join('\n');

    let summary;

    try {
      // 3. Call OpenAI to summarize
      const openaiResponse = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are a helpful assistant that summarizes a to-do list.',
            },
            {
              role: 'user',
              content: `Summarize this to-do list:\n${todoText}`,
            },
          ],
          temperature: 0.7,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          },
        }
      );

      summary = openaiResponse.data.choices[0].message.content;
    } catch (openAiError) {
      console.error('OpenAI API error, falling back to mock summary:', openAiError.response?.data || openAiError.message);

      // Fallback mock summary text if quota exceeded or API fails
      summary = `You have ${todos.length} todos:\n${todoText}`;
    }

    // 4. Send to Slack
    await axios.post(process.env.SLACK_WEBHOOK_URL, {
      text: `📝 *Todo Summary:*\n${summary}`,
    });

    res.json({ message: 'Summary sent to Slack successfully.', summary });
  } catch (err) {
    console.error('Error summarizing todos or sending to Slack:', err.response?.data || err.message || err);
    res.status(500).json({ message: 'Failed to summarize todos or send to Slack.' });
  }
});

// Start the server
app.listen(4000, () => {
  console.log('Server running on http://localhost:4000');
});
