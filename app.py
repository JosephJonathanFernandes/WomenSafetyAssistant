"""
Women Safety Assistant Flask Backend
------------------------------------
This file contains the backend logic for storing SOS events and sending SMS alerts using Twilio.
It uses SQLite via SQLAlchemy for data storage.
"""

# Import necessary libraries
from flask import Flask, request, jsonify  # Flask web framework
from flask_sqlalchemy import SQLAlchemy    # ORM for SQLite
import datetime                           # For timestamps
from twilio.rest import Client            # Twilio SMS API

# Initialize Flask app and configure database
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///sos_events.db'  # SQLite DB file
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize SQLAlchemy
db = SQLAlchemy(app)

# Database model for SOS events
class SOSEvent(db.Model):
    """
    Represents an SOS event triggered by a user.
    Fields:
        - user: Name of the user
        - latitude: Latitude of the user's location
        - longitude: Longitude of the user's location
        - timestamp: Time when the SOS was triggered
    """
    id = db.Column(db.Integer, primary_key=True)
    user = db.Column(db.String(100), nullable=False)
    latitude = db.Column(db.String(50), nullable=False)
    longitude = db.Column(db.String(50), nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.datetime.utcnow)

# API endpoint to receive SOS events from frontend
@app.route('/sos', methods=['POST'])
def sos_trigger():
    """
    Receives SOS event from frontend, stores in database, and sends SMS alert.
    Expects JSON: {"user": str, "latitude": str, "longitude": str}
    """
    data = request.get_json()
    user = data.get('user')
    lat = data.get('latitude')
    lng = data.get('longitude')

    # Store SOS event in SQLite database
    sos_event = SOSEvent(user=user, latitude=lat, longitude=lng)
    db.session.add(sos_event)
    db.session.commit()

    # Send SMS alert using Twilio
    to_number = '+11234567890'  # Replace with recipient's phone number
    message = f'SOS Alert! User: {user}, Location: ({lat}, {lng})'
    try:
        send_sms_alert(to_number, message)
    except Exception as e:
        # Return error if SMS fails
        return jsonify({"status": "SOS saved, but SMS failed", "error": str(e)})

    # Return success response
    return jsonify({"status": "SOS sent successfully!"})

# Helper function to send SMS alerts using Twilio

def send_sms_alert(to_number, message):
    """
    Sends an SMS alert using Twilio API.
    Args:
        to_number (str): Recipient phone number
        message (str): Message body
    """
    account_sid = 'YOUR_TWILIO_SID'  # Replace with your Twilio Account SID
    auth_token = 'YOUR_TWILIO_AUTH_TOKEN'  # Replace with your Twilio Auth Token
    client = Client(account_sid, auth_token)
    client.messages.create(
        body=message,
        from_='+1234567890',  # Replace with your Twilio phone number
        to=to_number
    )

# Main entry point: create tables and run the app
if __name__ == "__main__":
    with app.app_context():
        db.create_all()  # Create tables if not exist
    app.run(debug=True)
