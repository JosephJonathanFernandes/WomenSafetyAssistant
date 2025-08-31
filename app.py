
# app.py

from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
import datetime
from twilio.rest import Client

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///sos_events.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# SOS Event Model
class SOSEvent(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user = db.Column(db.String(100), nullable=False)
    latitude = db.Column(db.String(50), nullable=False)
    longitude = db.Column(db.String(50), nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.datetime.utcnow)

@app.route('/sos', methods=['POST'])
def sos_trigger():
    data = request.get_json()
    user = data.get('user')
    lat = data.get('latitude')
    lng = data.get('longitude')
    timestamp = datetime.datetime.now()


    # Store SOS event in SQLite
    sos_event = SOSEvent(user=user, latitude=lat, longitude=lng)
    db.session.add(sos_event)
    db.session.commit()

    # Send SMS alert using Twilio
    to_number = '+11234567890'  # Replace with recipient's phone number
    message = f'SOS Alert! User: {user}, Location: ({lat}, {lng})'
    try:
        send_sms_alert(to_number, message)
    except Exception as e:
        return jsonify({"status": "SOS saved, but SMS failed", "error": str(e)})

    return jsonify({"status": "SOS sent successfully!"})

# Twilio SMS alert integration
def send_sms_alert(to_number, message):
    account_sid = 'YOUR_TWILIO_SID'  # Replace with your Twilio Account SID
    auth_token = 'YOUR_TWILIO_AUTH_TOKEN'  # Replace with your Twilio Auth Token
    client = Client(account_sid, auth_token)
    client.messages.create(
        body=message,
        from_='+1234567890',  # Replace with your Twilio phone number
        to=to_number
    )

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True)
