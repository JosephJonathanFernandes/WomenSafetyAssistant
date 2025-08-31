


"""
streamlit_app.py
------------------------------------
Frontend UI for Women Safety Assistant
Collects user info, sends SOS to backend, and displays location on map.
"""

import streamlit as st
import requests
from streamlit_extras.add_vertical_space import add_vertical_space

# Sidebar for branding and instructions
st.sidebar.image("https://img.icons8.com/color/96/000000/woman-shield.png", width=80)
st.sidebar.title("Women Safety Assistant")
st.sidebar.markdown("""
**Instructions:**
- Enter your name and location.
- Click the SOS button in case of emergency.
- Your contacts will be alerted instantly.
""")

# Main title
st.markdown("<h1 style='text-align: center; color: #d7263d;'>🚨 Women Safety Assistant 🚨</h1>", unsafe_allow_html=True)
add_vertical_space(1)

# Layout: input fields and emergency tips
col1, col2 = st.columns([2,2])
with col1:
    # User input fields
    user_name = st.text_input("👤 Your Name", placeholder="Enter your name")
    lat = st.text_input("📍 Latitude", placeholder="e.g. 19.0760")
    lng = st.text_input("📍 Longitude", placeholder="e.g. 72.8777")

with col2:
    # Emergency tips box
    st.markdown("""
    <div style='background-color: #f8d7da; padding: 20px; border-radius: 10px;'>
        <b>Emergency Tips:</b><br>
        - Stay calm<br>
        - Share your location<br>
        - Use voice or audio if possible
    </div>
    """, unsafe_allow_html=True)
    add_vertical_space(2)

add_vertical_space(2)

# SOS button logic
if st.button("🔴 Send SOS", use_container_width=True):
    if user_name and lat and lng:
        data = {"user": user_name, "latitude": lat, "longitude": lng}
        try:
            # Send SOS to backend
            response = requests.post("http://127.0.0.1:5000/sos", json=data)
            if response.status_code == 200:
                st.success("SOS sent! Your contacts have been alerted.")
            else:
                st.error(f"Error: {response.text}")
        except Exception as e:
            st.error(f"Failed to send SOS: {e}")
    else:
        st.warning("Please enter all fields!")

# Map preview for entered location
if lat and lng:
    try:
        st.map({"lat": [float(lat)], "lon": [float(lng)]})
    except:
        st.info("Enter valid latitude and longitude to preview your location on the map.")
