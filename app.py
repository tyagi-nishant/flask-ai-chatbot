from flask import Flask, request, jsonify, render_template
from dotenv import load_dotenv
import os
import requests
import base64
load_dotenv()

app = Flask(__name__)

# access the key
OPENAI_API_KEY = os.getenv('openai.api_key')

#Open AI function
def get_openai_response(query):
    headers = {
        'Content-Type': 'application/json',
        'Authorization': f'Bearer {OPENAI_API_KEY}',
    }
    data = {
        'model': 'gpt-4o',  # Specify the GPT-4 model
        'messages': [{'role': 'user', 'content': query}],
    }
    response = requests.post('https://api.openai.com/v1/chat/completions', headers=headers, json=data)
    
    if response.status_code == 200:
        return response.json()['choices'][0]['message']['content']
    else:
        return f"Error: {response.status_code}, {response.text}"

def get_openai_response_img(image_query,text_query):
    headers = {
    "Content-Type": "application/json",
    "Authorization": f"Bearer {OPENAI_API_KEY}"
    }
    payload = {
    "model": "gpt-4o",
    "messages": [
        {
        "role": "user",
        "content": [
            {
            "type": "text",
            "text": f"{text_query}"
            },
            {
            "type": "image_url",
            "image_url": {
                "url": f"data:image/jpeg;base64,{image_query}"
            }
            }
        ]
        }
    ],
    "max_tokens": 4096
    }

    response = requests.post("https://api.openai.com/v1/chat/completions", headers=headers, json=payload)
    
    if response.status_code == 200:
        return response.json()
    else:
        return f"Error: {response.status_code}, {response.text}"    
# Store conversation history
conversation_history = []

def extract_vowels(text):
    response = get_openai_response(text)
    return response
def extract_vowels2(image,text):
    response = get_openai_response_img(image,text)
    return response

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/chat', methods=['POST'])
def chat():
    user_text = request.form.get('text')
    if user_text:
        conversation_history.append({"user": user_text})
    else:
        return jsonify({"response": "No text provided", "history": conversation_history})

    bot_response = extract_vowels(user_text)
    conversation_history.append({"bot": bot_response})

    return jsonify({"response": bot_response, "history": conversation_history})

# def encode_image(image_path):
#   with open(image_path, "rb") as image_file:
#     return base64.b64encode(image_file.read()).decode('utf-8')
def encode_image(file_storage):
    return base64.b64encode(file_storage.read()).decode('utf-8')
@app.route('/chatImage', methods=['POST'])
def chatImage():
    user_text = request.form.get('text')
    user_file = request.files.get('file')
    conversation_history.append({"user": user_text})

    base64_image = encode_image(user_file)
    bot_response = extract_vowels2(base64_image,user_text)['choices'][0]['message']['content']
    conversation_history.append({"bot": bot_response})

    return jsonify({"response": bot_response, "history": conversation_history})

if __name__ == '__main__':
    app.run(debug=True)
