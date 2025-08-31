
# Women Safety Assistant

## Overview

Women Safety Assistant is a real-time SOS and risk alert platform designed to enhance personal safety in public spaces. The system enables users to send emergency alerts, notifies contacts instantly, tracks location, and provides a community-driven safety map with AI-based risk assessment.

## Key Features

- SOS button for immediate emergency alerts
- Instant SMS/Email notifications to emergency contacts (Twilio/SMTP)
- Streamlit-based dashboard with user-friendly interface
- Location tracking and Google Maps integration
- Community safety map highlighting reported unsafe areas
- AI-powered risk score based on location and time
- Optional: Voice activation, audio recording, gamification

---


## Technology Stack

- Frontend: Streamlit
- Backend: Flask
- Database: Firebase or MongoDB
- APIs: Google Maps, Twilio
- AI: Scikit-learn, rule-based safety scoring

---


## Installation & Setup

1. **Clone the repository:**
  ```bash
  git clone 
  cd WomenSafetyAssistant
  ```
2. **Create and activate a virtual environment:**
  ```bash
  python -m venv venv
  venv\Scripts\activate  # Windows
  # source venv/bin/activate  # Linux/Mac
  ```
3. **Install dependencies:**
  ```bash
  pip install -r requirements.txt
  ```
4. **Run the backend:**
  ```bash
  python app.py
  ```
5. **Run the frontend:**
  ```bash
  streamlit run streamlit_app.py
  ```

---


## Usage

1. Launch the Streamlit application.
2. Enter your name and current location (latitude & longitude).
3. Click "Send SOS" to trigger an alert.
4. Emergency contacts will receive an SMS/Email with your location.
5. View unsafe spots and risk scores on the map.

---



## Future Enhancements

- Voice-activated SOS
- Audio recording during emergencies
- Integration with wearable devices
- Advanced AI risk prediction using live crime data

---


## Team
-Giselle
-Pratik
-Akaash
-Ahmed
-Nihaal


---


## License

MIT License (or hackathon-specific license if required)

---

