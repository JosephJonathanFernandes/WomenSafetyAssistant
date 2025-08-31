"""
streamlit_app.py
Streamlit frontend for Women Safety Assistant
"""
import streamlit as st
import requests

st.title("Women Safety Assistant")

user_name = st.text_input("Your Name")
lat = st.text_input("Latitude")
lng = st.text_input("Longitude")

if st.button("Send SOS"):
    if user_name and lat and lng:
        data = {"user": user_name, "latitude": lat, "longitude": lng}
        try:
            response = requests.post("http://127.0.0.1:5000/sos", json=data)
            if response.status_code == 200:
                st.success(response.json().get('status', 'SOS sent!'))
            else:
                st.error(f"Error: {response.text}")
        except Exception as e:
            st.error(f"Failed to send SOS: {e}")
    else:
        st.error("Please enter all fields!")
