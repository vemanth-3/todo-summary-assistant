# Todo Summary Assistant

## Project Overview

This project is a full-stack Todo app where users can create, update, delete todos, and generate a summary of all pending todos using OpenAI's GPT-3.5 Turbo model. The summary is then posted to a Slack channel using Slack Incoming Webhooks.

---

## Tech Stack

- Frontend: React (Create React App)
- Backend: Node.js with Express
- Database: Supabase (PostgreSQL)
- LLM Integration: OpenAI GPT-3.5 Turbo API
- Slack Integration: Slack Incoming Webhooks

---

## Features

- Add, edit, delete, and view todos.
- Generate a meaningful summary of todos via OpenAI.
- Send the summary directly to a Slack channel.
- Shows success/failure messages for Slack operations.

---

## Setup Instructions

### Backend

1. Go to the `backend` folder:  
   ```bash
   cd backend
Create .env file with these variables:

ini
Copy
Edit
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
OPENAI_API_KEY=your_openai_api_key
SLACK_WEBHOOK_URL=your_slack_webhook_url
Install dependencies:

bash
Copy
Edit
npm install
Start the server:

bash
Copy
Edit
node app.js
Backend runs at: http://localhost:4000

Frontend
Go to the frontend folder:

bash
Copy
Edit
cd frontend
Install dependencies:

bash
Copy
Edit
npm install
Start the frontend app:

bash
Copy
Edit
npm start
Open the app in your browser: http://localhost:3000

How to Use
Manage your todos in the UI.

Click "Summarize and Send to Slack" to generate a summary.

Check your configured Slack channel for the summary message.

Configuration
Slack Webhook: Set up Incoming Webhook in Slack and add URL to .env.

OpenAI API: Get API key from https://platform.openai.com and add to .env.

Supabase: Create a project and todos table with columns id (int, PK) and text (string).

Design Decisions
Supabase used for easy DB management and hosting.

OpenAI for real LLM summarization.

Slack Webhooks for simple Slack integration.

React + Node.js for frontend/backend separation.

Contact
For questions, contact: vemanthkumar76@gmail.com
