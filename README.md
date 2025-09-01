
# Women Safety Assistant

## Overview

Women Safety Assistant is a modern, real-time SOS and risk alert platform designed to enhance personal safety in public spaces. The system features a beautiful React-based frontend with instant emergency alerts, location tracking, AI-powered safety guidance, and comprehensive contact management.

## Key Features

- 🚨 **SOS Button**: Prominent emergency alert system with glowing animation
- 📍 **Location Tracking**: Real-time location sharing with emergency contacts
- 👥 **Contact Management**: CRUD functionality for emergency contacts
- 🗺️ **Safe Routes**: Interactive map with safe zones and route planning
- 🤖 **AI Safety Assistant**: Chatbot for instant safety advice and guidance
- 🌙 **Dark Mode**: Beautiful dark/light theme toggle
- 📱 **Responsive Design**: Modern UI optimized for all devices
- 🛡️ **Privacy Controls**: Granular privacy and notification settings

## Technology Stack

- **Frontend**: React 18 + TailwindCSS
- **Backend**: Supabase (Database, Authentication, Real-time)
- **Styling**: TailwindCSS with custom components
- **Routing**: React Router v6
- **State Management**: React Hooks
- **Icons**: Emoji-based icons for universal compatibility

## Installation & Setup

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

3. **Start the development server:**
  ```bash
  npm start
  ```

4. **Open your browser:**
   Navigate to `http://localhost:3000`

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Navbar.jsx      # Navigation bar with dark mode toggle
│   └── Sidebar.jsx     # Side navigation with quick actions
├── pages/              # Main application pages
│   ├── Dashboard.jsx   # Hero section and feature overview
│   ├── PanicButton.jsx # SOS alert system
│   ├── Contacts.jsx    # Emergency contact management
│   ├── SafeRoutes.jsx  # Map and route planning
│   ├── SafetyTips.jsx  # AI chatbot interface
│   └── Profile.jsx     # User settings and preferences
├── App.jsx             # Main application component
├── index.jsx           # Application entry point
├── index.css           # TailwindCSS and custom styles
└── supabaseClient.js   # Supabase configuration
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

- [ ] Real-time map integration (Leaflet/Mapbox)
- [ ] Push notifications
- [ ] Voice-activated SOS
- [ ] Audio recording during emergencies
- [ ] Integration with wearable devices
- [ ] Advanced AI risk prediction
- [ ] Community safety features
- [ ] Multi-language support

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

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

