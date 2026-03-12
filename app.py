import os
import json
from flask import Flask, render_template, request, jsonify
from google import genai
from pydantic import BaseModel, Field
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)

# Initialize the Gemini client
# It will automatically pick up GEMINI_API_KEY from the environment
try:
    client = genai.Client()
except Exception as e:
    print(f"Warning: Failed to initialize Gemini client. Is GEMINI_API_KEY set? Error: {e}")
    client = None

class Question(BaseModel):
    text: str = Field(description="The question text")
    options: list[str] = Field(description="A list of 4 possible answers")
    correct_answer: str = Field(description="The exact string of the correct answer from the options")
    explanation: str = Field(description="Brief explanation of why the answer is correct")

class Quiz(BaseModel):
    topic: str = Field(description="The topic of the quiz")
    difficulty: str = Field(description="The difficulty of the quiz (easy, normal, hard)")
    questions: list[Question] = Field(description="The list of quiz questions")

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/generate', methods=['POST'])
def generate_quiz():
    if not client:
        return jsonify({"error": "Gemini API client is not initialized. Check server logs and API key."}), 500

    data = request.json
    topic = data.get('topic')
    size = data.get('size', 10)
    difficulty = data.get('difficulty', 'normal')
    language = data.get('language', 'en')
    lang_str = 'Spanish' if language == 'es' else 'English'
    
    if not topic:
        return jsonify({"error": "Topic is required"}), 400
        
    try:
        size = int(size)
    except ValueError:
        return jsonify({"error": "Invalid size parameter"}), 400

    prompt = f"Create a quiz with exactly {size} questions about '{topic}'. The difficulty level should be '{difficulty}'. The requested language for the quiz is '{lang_str}'. All questions, options, and explanations must be in '{lang_str}'."
    
    try:
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
            config={
                'response_mime_type': 'application/json',
                'response_schema': Quiz,
                'temperature': 0.7,
            },
        )
        # The response.text is already a JSON string conforming to the Quiz schema
        return jsonify(json.loads(response.text))
        
    except Exception as e:
        print(f"Error generating quiz: {e}")
        return jsonify({"error": f"Failed to generate quiz: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
