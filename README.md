# ✨ AI Quiz Generator ✨

A vibrant, fully responsive web application built with Python (Flask) and Vanilla web technologies. It uses the Gemini 2.5 Flash API (via the `google-genai` library and Pydantic) to generate structured multiple-choice quizzes on any topic!

## Features

- **Topic of your Choice**: Type anything, and Gemini creates a quiz for it.
- **Configurable Size & Difficulty**: Choose from 10, 20, or 30 questions, and Easy, Normal, or Hard difficulties.
- **Structured AI output**: Guaranteed valid quiz formats by enforcing JSON schemas with the Gemini API.
- **Immediate Feedback**: Reveals correct answers and provides a detailed explanation for each after submitting.
- **Beautiful UI**: Colorful, modern interface, powered by standard CSS variables, CSS grid/flexbox, and Google Fonts. No thick frontend frameworks required.

## Getting Started

### 1. Requirements

- Python 3.9+
- A Google Gemini API Key

### 2. Setup

Clone the repository or navigate to the project directory:

```bash
cd quiz-generator-project
```

Install the required Python dependencies:

```bash
pip install -r requirements.txt
```

### 3. Environment Variables

Create a file named `.env` in the root directory and add your Google Gemini API Key:

```env
GEMINI_API_KEY=your_api_key_here
```

### 4. Run the Application

Start the Flask server:

```bash
python app.py
```

Open your browser and navigate to: [http://127.0.0.1:5000](http://127.0.0.1:5000)

Enjoy generating endless quizzes! 🚀
