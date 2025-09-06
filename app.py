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
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

def send_sms_alert(to_number, message):
    """
    Sends an SMS alert using Twilio API.
    Args:
        to_number (str): Recipient phone number
        message (str): Message body
    """
    # Get Twilio credentials from environment variables
    account_sid = os.environ.get('TWILIO_SID')
    auth_token = os.environ.get('TWILIO_AUTH_TOKEN')
    from_number = os.environ.get('TWILIO_PHONE')
    
    # Validate that credentials are available
    if not all([account_sid, auth_token, from_number]):
        raise ValueError("Missing Twilio credentials. Check your .env file.")
        
    # Initialize Twilio client and send message
    client = Client(account_sid, auth_token)
    client.messages.create(
        body=message,
        from_=from_number,
        to=to_number
    )

# Main entry point: create tables and run the app
if __name__ == "__main__":
    with app.app_context():
        db.create_all()  # Create tables if not exist
    app.run(debug=True)
