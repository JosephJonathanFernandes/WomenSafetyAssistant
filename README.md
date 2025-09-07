
# Women Safety Assistant

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Quick Start](#quick-start)
- [Installation & Setup](#installation--setup)
  - [Frontend Setup](#frontend-setup)
  - [Backend Setup](#backend-setup)
- [Feature Details](#feature-details)
  - [SMS Notifications](#sms-notifications)
  - [Maps Integration](#maps-integration)
- [Project Structure](#project-structure)
  - [Frontend Structure](#frontend-structure)
  - [Backend Structure](#backend-structure)
- [Features in Detail](#features-in-detail)
- [Design System](#design-system)
- [Future Enhancements](#future-enhancements)
- [Team](#team)
- [License](#license)

## Overview

Women Safety Assistant is a modern, real-time SOS and risk alert platform designed to enhance personal safety in public spaces. The system features a beautiful React-based frontend with instant emergency alerts, location tracking, AI-powered safety guidance, and comprehensive contact management.

## Key Features

- 🚨 **SOS Button**: Prominent emergency alert system with glowing animation
- 📍 **Location Tracking**: Real-time location sharing with emergency contacts
- 👥 **Contact Management**: CRUD functionality for emergency contacts
- 🗺️ **Interactive Maps**: View your current location on OpenStreetMap via Leaflet
- 📱 **SMS Notifications**: Automatic SMS alerts to trusted contacts via Twilio
- 🤖 **AI Safety Assistant**: Chatbot for instant safety advice and guidance
- 🌙 **Dark Mode**: Beautiful dark/light theme toggle
- 📱 **Responsive Design**: Modern UI optimized for all devices
- 🛡️ **Privacy Controls**: Granular privacy and notification settings

## Technology Stack

- **Frontend**: React 18 + TailwindCSS
- **Backend**: Go (Golang) with Fiber framework + Supabase (Database, Authentication, Real-time)
- **Styling**: TailwindCSS with custom components
- **Routing**: React Router v6
- **State Management**: React Hooks
- **Maps**: Leaflet with OpenStreetMap integration
- **SMS Notifications**: Twilio API integration
- **Icons**: Emoji-based icons for universal compatibility

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Go (v1.18 or higher)
- Supabase account
- Twilio account (for SMS notifications)

### Quick Start

```bash
# Clone the repository
git clone https://github.com/JosephJonathanFernandes/WomenSafetyAssistant.git
cd WomenSafetyAssistant

# Start frontend
cd src
npm install
npm start

# In a new terminal, start backend
cd backend
go mod download
go run cmd/main.go
```

## Installation & Setup

### Frontend Setup

1. **Clone the repository:**
  ```bash
  git clone https://github.com/JosephJonathanFernandes/WomenSafetyAssistant.git
  cd WomenSafetyAssistant
  ```

2. **Install dependencies:**
  ```bash
  cd src
  npm install
  ```

3. **Configure environment variables:**
   Create a `.env` file in the `src` directory based on `.env.example`
   ```
   REACT_APP_SUPABASE_URL=your_supabase_url
   REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
   REACT_APP_API_URL=http://localhost:3001
   
   ```

4. **Start the development server:**
  ```bash
  npm start
  ```

5. **Open your browser:**
   Navigate to `http://localhost:3000`

### Backend Setup

1. **Navigate to the backend directory:**
  ```bash
  cd backend
  ```

2. **Install Go dependencies:**
  ```bash
  go mod download
  ```

3. **Configure environment variables:**
   Create a `.env` file in the backend directory based on `.env.example`
   ```
   SUPABASE_URL=your_supabase_url
   SUPABASE_KEY=your_supabase_service_key
   SUPABASE_JWT_SECRET=your_supabase_jwt_secret
   TWILIO_ACCOUNT_SID=your_twilio_account_sid
   TWILIO_AUTH_TOKEN=your_twilio_auth_token
   TWILIO_PHONE_NUMBER=your_twilio_phone_number
   ```

4. **Start the backend server:**
  ```bash
  go run cmd/main.go
  ```
   The server will start on port 3001 by default.

## Feature Details

### SMS Notifications

The application uses Twilio to send SMS notifications to trusted contacts during emergencies. When a user triggers an SOS alert, the system automatically:

1. Retrieves the user's trusted contacts from the database
2. Sends SMS messages with the user's location information
3. Tracks notification delivery status

To use this feature, you need to:
- Set up a Twilio account and obtain API credentials
- Configure the environment variables in the backend `.env` file
- Add trusted contacts to your profile

### Maps Integration

The application integrates Leaflet with OpenStreetMap to display the user's current location. This feature:

1. Shows the user's real-time location on an interactive map
2. Includes the location coordinates in SOS alerts
3. Provides visual confirmation of the location being shared

To use this feature, you need to:
- No API key required as OpenStreetMap is freely available
- Allow location access in your browser

## Project Structure

### Frontend Structure

```
src/
├── components/          # Reusable UI components
│   ├── Auth.jsx        # Authentication component
│   ├── ErrorBoundary.jsx # Error handling component
│   ├── LoadingSpinner.jsx # Loading indicator
│   ├── MapComponent.jsx # Leaflet map integration
│   ├── Navbar.jsx      # Navigation bar with dark mode toggle
│   └── Sidebar.jsx     # Side navigation with quick actions
├── contexts/           # React contexts
│   └── AuthContext.jsx # Authentication state management
├── pages/              # Main application pages
│   ├── Dashboard.jsx   # Hero section and feature overview
│   ├── PanicButton.jsx # SOS alert system
│   ├── Contacts.jsx    # Emergency contact management
│   ├── Insights.jsx    # User activity insights
│   ├── SafeRoutes.jsx  # Map and route planning
│   ├── SafetyTips.jsx  # AI chatbot interface
│   └── Profile.jsx     # User settings and preferences
├── services/           # API and external service integrations
│   ├── api.js          # Backend API client
│   └── wolfram.js      # Wolfram Alpha integration
├── App.jsx             # Main application component
├── index.jsx           # Application entry point
├── index.css           # TailwindCSS and custom styles
└── supabaseClient.js   # Supabase configuration
```

### Backend Structure

```
backend/
├── cmd/                # Application entry points
│   └── main.go         # Main application entry point
├── config/             # Configuration management
│   └── config.go       # Environment configuration
├── internal/           # Internal packages
│   ├── db/             # Database connections and queries
│   ├── handlers/       # HTTP request handlers
│   │   ├── auth.go     # Authentication handlers
│   │   ├── contacts.go # Contact management handlers
│   │   ├── sos.go      # SOS alert handlers
│   │   └── users.go    # User management handlers
│   ├── models/         # Data models
│   │   ├── contact.go  # Contact data model
│   │   ├── sos.go      # SOS alert data model
│   │   └── user.go     # User data model
│   └── services/       # Business logic services
│       └── sms.go      # Twilio SMS service
├── router/             # HTTP routing
│   └── router.go       # API route definitions
├── go.mod              # Go module definition
└── go.sum              # Go module checksums
```

## Features in Detail

### 🏠 Dashboard
- Hero section with bold tagline
- Feature highlights with gradient icons
- Quick statistics overview
- Recent activity feed

### 🚨 SOS Alert System
- Large, prominent emergency button
- Glowing animation for attention
- Quick action options (location sharing, messaging, calling)
- Emergency information and safety tips

### 👥 Contact Management
- Add, edit, and delete emergency contacts
- Categorize contacts (emergency vs. regular)
- Quick call and message actions
- Contact relationship tracking

### 🗺️ Safe Routes & Zones
- Interactive map interface (placeholder for now)
- Safe zone information and ratings
- Route planning with safety considerations
- Location sharing capabilities

### 🤖 AI Safety Assistant
- Chatbot interface for safety advice
- Quick question suggestions
- Contextual responses based on keywords
- Safety tips and emergency resources

### 👤 Profile & Settings
- User information management
- Notification preferences
- Privacy settings
- Account security options

## Design System

### Color Palette
- **Primary Purple**: #6A0DAD
- **Primary Pink**: #FF69B4
- **White**: #FFFFFF
- **Dark Mode Support**: Full dark theme implementation

### Typography
- Clean, bold headlines
- Legible body text
- Consistent spacing and hierarchy

### Components
- Modern card-based layouts
- Smooth hover animations
- Responsive grid systems
- Accessible form controls

## Future Enhancements

- [ ] Push notifications
- [ ] Voice-activated SOS
- [ ] Audio recording during emergencies
- [ ] Integration with wearable devices
- [ ] Advanced AI risk prediction
- [ ] Community safety features
- [ ] Multi-language support



## Team

- Giselle
- Pratik
- Akaash
- Ahmed
- Nihaal

## License

MIT License - see [LICENSE](LICENSE) file for details.

---

**Stay Safe, Stay Connected** 🛡️💜

