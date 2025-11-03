# ---------------- IMPORTS ----------------
import os
import uuid
import time
import threading
import json
import datetime
from functools import wraps

import bcrypt
import fitz  # PyMuPDF for PDF
import google.generativeai as genai
import jwt
from dotenv import load_dotenv
from flask import Flask, request, jsonify, Response
from flask_cors import CORS
from flask_mongoengine import MongoEngine
from pptx import Presentation  # python-pptx for PowerPoint

# ---------------- INITIALIZATION & CONFIG ----------------
load_dotenv()

app = Flask(__name__)

CORS(app,
     origins=["http://localhost:3000", "http://127.0.0.1:3000"],
     allow_headers=["Content-Type", "x-auth-token", "Authorization"],
     supports_credentials=True,
     methods=["GET", "POST", "PATCH", "DELETE", "OPTIONS"])

app.config['MONGODB_SETTINGS'] = {
    'db': 'mindvault_db',
    'host': os.getenv('MONGO_URI')
}
app.config['JWT_SECRET'] = os.getenv('JWT_SECRET')
db = MongoEngine(app)

TEMP_UPLOAD_FOLDER = 'temp_uploads'
os.makedirs(TEMP_UPLOAD_FOLDER, exist_ok=True)

gemini_api_key = os.getenv("GEMINI_API_KEY")
if not gemini_api_key:
    print("⚠️ WARNING: GEMINI_API_KEY environment variable not set.")
genai.configure(api_key=gemini_api_key)

# ---------------- TOKEN REQUIRED (Moved Up) ----------------
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('x-auth-token')
        if not token:
            return jsonify({'error': 'Token is missing!'}), 401
        try:
            data = jwt.decode(token, app.config['JWT_SECRET'], algorithms=["HS256"])
            current_user = User.objects.get(id=data['user_id'])
        except Exception as e:
            return jsonify({'error': 'Token is invalid or expired!', 'details': str(e)}), 401
        return f(current_user, *args, **kwargs)
    return decorated

# ---------------- DATABASE MODELS ----------------
class User(db.Document):
    firstName = db.StringField(required=True)
    email = db.StringField(required=True, unique=True)
    password = db.StringField(required=True)
    meta = {'collection': 'users'}

class PlannerTask(db.Document):
    user_id = db.ReferenceField(User, required=True)
    title = db.StringField(required=True)
    details = db.StringField()
    done = db.BooleanField(default=False)
    created_at = db.DateTimeField(default=datetime.datetime.utcnow)
    updated_at = db.DateTimeField(default=datetime.datetime.utcnow)
    meta = {'collection': 'planner_tasks'}

class PlannerEvent(db.Document):
    user_id = db.ReferenceField(User, required=True)
    title = db.StringField(required=True)
    description = db.StringField()
    deadline = db.DateTimeField(required=True)
    created_at = db.DateTimeField(default=datetime.datetime.utcnow)
    updated_at = db.DateTimeField(default=datetime.datetime.utcnow)
    meta = {'collection': 'planner_events'}

class Alert(db.Document):
    user_id = db.ReferenceField(User, required=True)
    message = db.StringField(required=True)
    related_event = db.ReferenceField(PlannerEvent, null=True)
    created_at = db.DateTimeField(default=datetime.datetime.utcnow)
    read = db.BooleanField(default=False)
    meta = {'collection': 'planner_alerts'}

class AIPlan(db.Document):
    user_id = db.ReferenceField(User, required=True)
    prompt = db.StringField()
    plan_text = db.StringField()
    created_at = db.DateTimeField(default=datetime.datetime.utcnow)
    meta = {'collection': 'ai_plans'}

# ---------------- HELPERS ----------------
def parse_iso(dt_str):
    try:
        return datetime.datetime.fromisoformat(dt_str.replace('Z', ''))
    except Exception:
        return None

# ---------------- PLANNER ROUTES ----------------
@app.route('/api/planner/generate-plan', methods=['POST'])
@token_required
def generate_plan(current_user):
    body = request.get_json() or {}
    goals = body.get('goals', '').strip()
    subjects = body.get('subjects', '').strip()
    timeframe = body.get('timeframe', '').strip()

    if not (goals or subjects or timeframe):
        return jsonify({"error": "Provide at least one of goals/subjects/timeframe"}), 400

    prompt = f"You are an expert study planner. Create a clear, actionable plan.\n\nGoals: {goals}\nSubjects: {subjects}\nTimeframe: {timeframe}"

    try:
        plan_text = None
        try:
            model = genai.GenerativeModel('gemini-2.5')
            resp = model.generate_content(prompt)
            plan_text = getattr(resp, 'text', None) or (resp.candidates[0].content.parts[0].text if hasattr(resp, 'candidates') else None)
        except Exception:
            plan_text = None

        if not plan_text:
            plan_text = f"### Study Plan (auto-created)\n\n**Focus:** {subjects or goals}\n\n- Day 1: Read core concepts\n- Day 2: Practice problems\n- Day 3: Revise and summarize"

        AIPlan(user_id=current_user, prompt=prompt, plan_text=plan_text).save()
        return jsonify({"plan": plan_text})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/planner/tasks', methods=['POST'])
@token_required
def create_task(current_user):
    body = request.get_json() or {}
    title = (body.get('title') or '').strip()
    details = body.get('details', '').strip()
    if not title:
        return jsonify({"error": "Missing title"}), 400
    task = PlannerTask(user_id=current_user, title=title, details=details)
    task.save()
    return jsonify({"taskId": str(task.id), "title": task.title}), 201

@app.route('/api/planner/tasks', methods=['GET'])
@token_required
def get_tasks(current_user):
    tasks = PlannerTask.objects(user_id=current_user).order_by('-created_at')
    data = [{"id": str(t.id), "title": t.title, "details": t.details, "done": t.done} for t in tasks]
    return jsonify({"tasks": data})

@app.route('/api/planner/tasks/<task_id>', methods=['PATCH'])
@token_required
def update_task(current_user, task_id):
    body = request.get_json() or {}
    task = PlannerTask.objects(id=task_id, user_id=current_user).first()
    if not task:
        return jsonify({"error": "Not found"}), 404
    for key in ['title', 'details']:
        if key in body:
            setattr(task, key, body[key])
    if 'done' in body:
        task.done = bool(body['done'])
    task.updated_at = datetime.datetime.utcnow()
    task.save()
    return jsonify({"ok": True})

@app.route('/api/planner/events', methods=['POST'])
@token_required
def create_event(current_user):
    body = request.get_json() or {}
    title = (body.get('title') or '').strip()
    deadline = body.get('deadline')
    description = body.get('description', '').strip()
    if not title or not deadline:
        return jsonify({"error": "Missing fields"}), 400
    dt = parse_iso(deadline)
    if not dt:
        return jsonify({"error": "Invalid date format"}), 400
    ev = PlannerEvent(user_id=current_user, title=title, description=description, deadline=dt)
    ev.save()
    return jsonify({"eventId": str(ev.id)}), 201

@app.route('/api/planner/events', methods=['GET'])
@token_required
def get_events(current_user):
    q = PlannerEvent.objects(user_id=current_user)
    events = [{"id": str(e.id), "title": e.title, "description": e.description, "deadline": e.deadline.isoformat()} for e in q]
    return jsonify({"events": events})

@app.route('/api/planner/upcoming-deadlines', methods=['GET'])
@token_required
def get_upcoming_deadlines(current_user):
    now = datetime.datetime.utcnow()
    evs = PlannerEvent.objects(user_id=current_user, deadline__gt=now).order_by('deadline')
    out = [{"id": str(e.id), "title": e.title, "deadline": e.deadline.isoformat()} for e in evs]
    return jsonify({"deadlines": out})

@app.route('/api/planner/alerts', methods=['GET'])
@token_required
def get_alerts(current_user):
    now = datetime.datetime.utcnow()
    in_one_hour = now + datetime.timedelta(hours=1)
    expired = PlannerEvent.objects(user_id=current_user, deadline__lte=now)
    soon = PlannerEvent.objects(user_id=current_user, deadline__gt=now, deadline__lte=in_one_hour)
    alerts = [{"id": str(e.id), "type": "expired", "message": f"Deadline expired: {e.title}", "deadline": e.deadline.isoformat()} for e in expired]
    alerts += [{"id": str(e.id), "type": "upcoming", "message": f"Upcoming soon: {e.title}", "deadline": e.deadline.isoformat()} for e in soon]
    return jsonify({"alerts": alerts})

# ---------------- BACKGROUND CHECKER ----------------
def planner_background_checker(interval=30):
    def run():
        while True:
            try:
                now = datetime.datetime.utcnow()
                expired_events = PlannerEvent.objects(deadline__lte=now)
                for ev in expired_events:
                    if not Alert.objects(related_event=ev).first():
                        Alert(user_id=ev.user_id, message=f"Deadline expired: {ev.title}", related_event=ev).save()
            except Exception as e:
                print("Planner background checker error:", e)
            time.sleep(interval)
    threading.Thread(target=run, daemon=True).start()

planner_background_checker(30)

# ---------------- AUTH ENDPOINTS ----------------
@app.route('/api/auth/register', methods=['POST'])
def register_user():
    body = request.get_json()
    if not body or not body.get('email') or not body.get('password'):
        return jsonify({"error": "Missing required fields"}), 400
    if User.objects(email=body.get('email')).first():
        return jsonify({"error": "User exists"}), 409
    hashed = bcrypt.hashpw(body['password'].encode('utf-8'), bcrypt.gensalt())
    user = User(firstName=body.get('firstName'), email=body['email'], password=hashed.decode('utf-8')).save()
    return jsonify({"message": f"User '{user.email}' registered successfully"}), 201

@app.route('/api/auth/login', methods=['POST'])
def login_user():
    body = request.get_json()
    user = User.objects(email=body.get('email')).first()
    if not user or not bcrypt.checkpw(body['password'].encode('utf-8'), user.password.encode('utf-8')):
        return jsonify({"error": "Invalid credentials"}), 401
    token = jwt.encode({'user_id': str(user.id), 'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=5)}, app.config['JWT_SECRET'], algorithm="HS256")
    return jsonify({"token": token})

@app.route('/api/auth/me', methods=['GET'])
@token_required
def get_current_user(current_user):
    return jsonify(id=str(current_user.id), firstName=current_user.firstName, email=current_user.email)

# ---------------- RUN APP ----------------
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
