# app.py

from flask import Flask, request, jsonify
from pymongo import MongoClient
import datetime
from twilio.rest import Client

app = Flask(__name__)

# Connect to MongoDB (use local or Atlas)
client = MongoClient("mongodb://localhost:27017/")
db = client['WomenSafetyDB']
sos_collection = db['sos_events']

@app.route('/sos', methods=['POST'])
def sos_trigger():
    data = request.get_json()
    user = data.get('user')
    lat = data.get('latitude')
    lng = data.get('longitude')
    timestamp = datetime.datetime.now()

    sos_collection.insert_one({
        "user": user,
        "latitude": lat,
        "longitude": lng,
        "timestamp": timestamp
    })

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
