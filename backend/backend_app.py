import os
import uuid
import time
import threading
import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_mongoengine import MongoEngine
import bcrypt
import jwt
import fitz  # PyMuPDF for PDF
from pptx import Presentation  # python-pptx for PowerPoint
import google.generativeai as genai
from dotenv import load_dotenv
from functools import wraps

# --- Load environment variables ---
load_dotenv()
app = Flask(__name__)

# This simpler configuration is often more reliable for handling preflight requests
CORS(app, origins="http://localhost:3000", supports_credentials=True)

# --- Database and JWT Config ---
app.config['MONGODB_SETTINGS'] = {
    'db': 'mindvault_db',
    'host': os.getenv('MONGO_URI')
}
app.config['JWT_SECRET'] = os.getenv('JWT_SECRET')
db = MongoEngine(app)

# --- User Model ---
class User(db.Document):
    firstName = db.StringField(required=True)
    email = db.StringField(required=True, unique=True)
    password = db.StringField(required=True)

# --- Middleware to protect routes ---
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('x-auth-token')
        if not token:
            return jsonify({'error': 'Token is missing!'}), 401
        try:
            data = jwt.decode(token, app.config['JWT_SECRET'], algorithms=["HS256"])
            current_user = User.objects.get(id=data['user_id'])
        except:
            return jsonify({'error': 'Token is invalid!'}), 401
        return f(current_user, *args, **kwargs)
    return decorated

# --- Authentication Routes ---
@app.route('/api/auth/register', methods=['POST'])
def register_user():
    body = request.get_json()
    if User.objects(email=body.get('email')).first():
        return jsonify({"error": "User with this email already exists"}), 400

    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(body.get('password').encode('utf-8'), salt)

    user = User(
        firstName=body.get('firstName'),
        email=body.get('email'),
        password=hashed_password.decode('utf-8')
    ).save()

    return jsonify({"message": "User registered successfully"}), 201


@app.route('/api/auth/login', methods=['POST'])
def login_user():
    body = request.get_json()
    user = User.objects(email=body.get('email')).first()

    if not user or not bcrypt.checkpw(body.get('password').encode('utf-8'), user.password.encode('utf-8')):
        return jsonify({"error": "Invalid credentials"}), 401

    token = jwt.encode({
        'user_id': str(user.id),
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=5)
    }, app.config['JWT_SECRET'], algorithm="HS256")

    return jsonify({"token": token})


# --- Protected route to get user data ---
@app.route('/api/auth/me', methods=['GET'])
@token_required
def get_current_user(current_user):
    return jsonify(firstName=current_user.firstName, email=current_user.email)


# --- Gemini Setup ---
gemini_api_key = os.getenv("GEMINI_API_KEY")
if not gemini_api_key:
    raise ValueError("GEMINI_API_KEY environment variable not set.")
genai.configure(api_key=gemini_api_key)


# --- File Processing Helpers ---
def extract_text_from_pdf(pdf_path):
    doc = fitz.open(pdf_path)
    text = ""
    for page in doc:
        text += page.get_text()
    return text


def extract_text_from_pptx(pptx_path):
    prs = Presentation(pptx_path)
    text = ""
    for slide in prs.slides:
        for shape in slide.shapes:
            if hasattr(shape, "text"):
                text += shape.text + "\n"
    return text


def summarize_text_with_gemini(text_content):
    if not text_content:
        return None
    model = genai.GenerativeModel('gemini-1.5-pro')
    prompt = f"Summarize the following text concisely and clearly:\n\n{text_content}"
    try:
        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        print(f"Error calling Gemini API: {e}")
        return None


def delete_file_after_timeout(file_path, timeout=1800):
    def target():
        time.sleep(timeout)
        if os.path.exists(file_path):
            os.remove(file_path)
            print(f"Deleted temporary file: {file_path}")
    timer_thread = threading.Thread(target=target)
    timer_thread.daemon = True
    timer_thread.start()


# --- File Upload Route ---
@app.route('/api/upload', methods=['POST'])
def upload_file_endpoint():
    if 'file' not in request.files:
        return jsonify({"error": "No file part in the request"}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    unique_id = str(uuid.uuid4())
    file_extension = os.path.splitext(file.filename)[1].lower()
    file_path = os.path.join("temp_uploads", f"{unique_id}{file_extension}")

    try:
        if not os.path.exists("temp_uploads"):
            os.makedirs("temp_uploads")

        file.save(file_path)
        delete_file_after_timeout(file_path)

        return jsonify({"message": "File uploaded successfully", "fileId": unique_id}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# --- Summarize Route ---
@app.route('/api/summarize/<file_id>', methods=['GET'])
def summarize_endpoint(file_id):
    try:
        matching_files = [f for f in os.listdir("temp_uploads") if f.startswith(file_id)]
        if not matching_files:
            return jsonify({"error": "File not found or has expired"}), 404

        file_name = matching_files[0]
        file_path = os.path.join("temp_uploads", file_name)
        file_extension = os.path.splitext(file_name)[1].lower()

        text_content = ""
        if file_extension == '.pdf':
            text_content = extract_text_from_pdf(file_path)
        elif file_extension in ['.pptx', '.ppt']:
            text_content = extract_text_from_pptx(file_path)
        elif file_extension == '.txt':
            with open(file_path, 'r', encoding='utf-8') as f:
                text_content = f.read()
        else:
            return jsonify({"error": "Unsupported file type"}), 415

        if not text_content:
            return jsonify({"error": "Could not extract text from file"}), 500

        summary = summarize_text_with_gemini(text_content)
        if not summary:
            return jsonify({"error": "Could not generate summary"}), 500

        return jsonify({"summary": summary})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# --- Test Route to check if server is responsive ---
@app.route('/api/ping', methods=['GET'])
def ping_pong():
    return jsonify({"message": "pong!"})

# --- Run App ---
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
