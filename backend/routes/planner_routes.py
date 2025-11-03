# backend/routes/planner_routes.py

from flask import Blueprint, request, jsonify
from datetime import datetime, timedelta
import threading, time
from ..backend_app import db, genai, User, token_required

# -----------------------------------
# BLUEPRINT INITIALIZATION
# -----------------------------------
planner_bp = Blueprint("planner_bp", __name__)

# -----------------------------------
# DATABASE MODELS
# -----------------------------------
class PlannerTask(db.Document):
    user_id = db.ReferenceField(User, required=True)
    title = db.StringField(required=True)
    details = db.StringField()
    done = db.BooleanField(default=False)
    created_at = db.DateTimeField(default=datetime.utcnow)
    updated_at = db.DateTimeField(default=datetime.utcnow)
    meta = {"collection": "planner_tasks"}


class PlannerEvent(db.Document):
    user_id = db.ReferenceField(User, required=True)
    title = db.StringField(required=True)
    description = db.StringField()
    deadline = db.DateTimeField(required=True)
    created_at = db.DateTimeField(default=datetime.utcnow)
    updated_at = db.DateTimeField(default=datetime.utcnow)
    meta = {"collection": "planner_events"}


class Alert(db.Document):
    user_id = db.ReferenceField(User, required=True)
    message = db.StringField(required=True)
    related_event = db.ReferenceField(PlannerEvent, null=True)
    created_at = db.DateTimeField(default=datetime.utcnow)
    read = db.BooleanField(default=False)
    meta = {"collection": "planner_alerts"}


class AIPlan(db.Document):
    user_id = db.ReferenceField(User, required=True)
    prompt = db.StringField()
    plan_text = db.StringField()
    created_at = db.DateTimeField(default=datetime.utcnow)
    meta = {"collection": "ai_plans"}


# -----------------------------------
# HELPER FUNCTIONS
# -----------------------------------
def parse_iso(dt_str):
    """Safely parse ISO datetime strings."""
    try:
        return datetime.fromisoformat(dt_str.replace("Z", ""))
    except Exception:
        return None


# -----------------------------------
# AI PLAN GENERATION
# -----------------------------------
@planner_bp.route("/generate-plan", methods=["POST"])
@token_required
def generate_plan(current_user):
    body = request.get_json() or {}
    goals = body.get("goals", "").strip()
    subjects = body.get("subjects", "").strip()
    timeframe = body.get("timeframe", "").strip()

    if not (goals or subjects or timeframe):
        return jsonify({"error": "Provide at least one of goals/subjects/timeframe"}), 400

    prompt = f"""You are an expert study planner. Create a clear, actionable study plan.

Goals: {goals}
Subjects: {subjects}
Timeframe: {timeframe}

Return the plan in markdown format with day-wise bullets.
"""

    try:
        plan_text = None
        try:
            model = genai.GenerativeModel("gemini-2.5")
            resp = model.generate_content(prompt)
            plan_text = (
                resp.text.strip()
                if hasattr(resp, "text")
                else resp.candidates[0].content.parts[0].text
            )
        except Exception:
            plan_text = None

        if not plan_text:
            plan_text = (
                f"### Study Plan (auto-created)\n\n**Focus:** {subjects or goals}\n\n"
                "- Day 1: Read core concepts\n- Day 2: Solve practice problems\n"
                "- Day 3: Review and summarize\n\n"
                "_This is a placeholder plan. Connect Gemini for richer plans._"
            )

        ai_rec = AIPlan(user_id=current_user, prompt=prompt, plan_text=plan_text)
        ai_rec.save()
        return jsonify({"plan": plan_text, "planId": str(ai_rec.id)})
    except Exception as exc:
        return jsonify({"error": str(exc)}), 500


# -----------------------------------
# TASKS CRUD
# -----------------------------------
@planner_bp.route("/tasks", methods=["POST"])
@token_required
def create_task(current_user):
    body = request.get_json() or {}
    title = (body.get("title") or "").strip()
    details = body.get("details", "").strip()
    if not title:
        return jsonify({"error": "Missing title"}), 400
    task = PlannerTask(user_id=current_user, title=title, details=details)
    task.save()
    return jsonify({"taskId": str(task.id), "title": task.title}), 201


@planner_bp.route("/tasks", methods=["GET"])
@token_required
def get_tasks(current_user):
    tasks = PlannerTask.objects(user_id=current_user).order_by("-created_at")
    data = [
        {
            "id": str(t.id),
            "title": t.title,
            "details": t.details or "",
            "done": t.done,
        }
        for t in tasks
    ]
    return jsonify(data)


@planner_bp.route("/tasks/<task_id>", methods=["PATCH"])
@token_required
def update_task(current_user, task_id):
    body = request.get_json() or {}
    task = PlannerTask.objects(id=task_id, user_id=current_user).first()
    if not task:
        return jsonify({"error": "Not found"}), 404
    if "title" in body:
        task.title = body["title"]
    if "details" in body:
        task.details = body["details"]
    if "done" in body:
        task.done = bool(body["done"])
    task.updated_at = datetime.utcnow()
    task.save()
    return jsonify({"ok": True})


@planner_bp.route("/tasks/<task_id>", methods=["DELETE"])
@token_required
def delete_task(current_user, task_id):
    task = PlannerTask.objects(id=task_id, user_id=current_user).first()
    if not task:
        return jsonify({"error": "Not found"}), 404
    task.delete()
    return jsonify({"ok": True})


# -----------------------------------
# EVENTS / CALENDAR
# -----------------------------------
@planner_bp.route("/events", methods=["POST"])
@token_required
def create_event(current_user):
    body = request.get_json() or {}
    title = (body.get("title") or "").strip()
    deadline = body.get("deadline")
    description = body.get("description", "").strip()
    if not title or not deadline:
        return jsonify({"error": "Missing fields"}), 400
    dt = parse_iso(deadline)
    if not dt:
        return jsonify({"error": "Invalid date format (use ISO)"}), 400
    ev = PlannerEvent(
        user_id=current_user, title=title, description=description, deadline=dt
    )
    ev.save()
    return jsonify({"eventId": str(ev.id)}), 201


@planner_bp.route("/events", methods=["GET"])
@token_required
def get_events(current_user):
    fr = request.args.get("from")
    to = request.args.get("to")
    q = PlannerEvent.objects(user_id=current_user)
    if fr:
        dt_fr = parse_iso(fr)
        if dt_fr:
            q = q.filter(deadline__gte=dt_fr)
    if to:
        dt_to = parse_iso(to)
        if dt_to:
            q = q.filter(deadline__lte=dt_to)
    events = [
        {
            "id": str(e.id),
            "title": e.title,
            "description": e.description or "",
            "deadline": e.deadline.isoformat(),
        }
        for e in q
    ]
    return jsonify(events)


# -----------------------------------
# UPCOMING DEADLINES + ALERTS
# -----------------------------------
@planner_bp.route("/upcoming-deadlines", methods=["GET"])
@token_required
def get_upcoming_deadlines(current_user):
    now = datetime.utcnow()
    evs = (
        PlannerEvent.objects(user_id=current_user, deadline__gt=now)
        .order_by("deadline")
    )
    out = [{"id": str(e.id), "title": e.title, "deadline": e.deadline.isoformat()} for e in evs]
    return jsonify(out)


@planner_bp.route("/alerts", methods=["GET"])
@token_required
def get_alerts(current_user):
    now = datetime.utcnow()
    in_one_hour = now + timedelta(hours=1)
    expired = PlannerEvent.objects(user_id=current_user, deadline__lte=now)
    soon = PlannerEvent.objects(
        user_id=current_user, deadline__gt=now, deadline__lte=in_one_hour
    )

    alerts = []
    for e in expired:
        alerts.append(
            {
                "id": str(e.id),
                "type": "expired",
                "message": f"Deadline expired: {e.title}",
                "deadline": e.deadline.isoformat(),
            }
        )
    for e in soon:
        alerts.append(
            {
                "id": str(e.id),
                "type": "upcoming",
                "message": f"Upcoming soon: {e.title}",
                "deadline": e.deadline.isoformat(),
            }
        )
    extra = Alert.objects(user_id=current_user, read=False)
    for a in extra:
        alerts.append(
            {
                "id": str(a.id),
                "type": "alert",
                "message": a.message,
                "created_at": a.created_at.isoformat(),
            }
        )
    return jsonify(alerts)


@planner_bp.route("/alerts/<alert_id>/read", methods=["POST"])
@token_required
def read_alert(current_user, alert_id):
    a = Alert.objects(id=alert_id, user_id=current_user).first()
    if not a:
        return jsonify({"error": "Not found"}), 404
    a.read = True
    a.save()
    return jsonify({"ok": True})


# -----------------------------------
# BACKGROUND CHECKER FOR EXPIRED DEADLINES
# -----------------------------------
def planner_background_checker(interval=30):
    def run():
        while True:
            try:
                now = datetime.utcnow()

                # 1) expired events -> alert (existing logic)
                expired_events = PlannerEvent.objects(deadline__lte=now)
                for ev in expired_events:
                    if not Alert.objects(related_event=ev).first():
                        Alert(
                            user_id=ev.user_id,
                            message=f"Deadline expired: {ev.title}",
                            related_event=ev,
                        ).save()

                # 2) reminders scheduled for "now ± 1 minute" -> create alerts
                window_start = now - timedelta(minutes=1)
                window_end = now + timedelta(minutes=1)
                reminders_due = PlannerEvent.objects(
                    deadline__gte=window_start, deadline__lte=window_end, description="Reminder"
                )
                for ev in reminders_due:
                    if not Alert.objects(related_event=ev).first():
                        Alert(
                            user_id=ev.user_id,
                            message=f"Reminder: {ev.title}",
                            related_event=ev,
                        ).save()

                # (optional) 3) upcoming soon alerts handled by GET /alerts
            except Exception as e:
                print("Planner background checker error:", e)
            time.sleep(interval)

    t = threading.Thread(target=run, daemon=True)
    t.start()

# Start background checker
try:
    planner_background_checker(30)
except Exception as e:
    print("Planner checker failed to start:", e)
