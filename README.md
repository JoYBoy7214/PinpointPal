# PinpointPal

![GitHub Repo Size](https://img.shields.io/github/repo-size/JoYBoy7214/PinpointPal) 
![GitHub last commit](https://img.shields.io/github/last-commit/JoYBoy7214/PinpointPal)
![GitHub issues](https://img.shields.io/github/issues/JoYBoy7214/PinpointPal)
![GitHub license](https://img.shields.io/github/license/JoYBoy7214/PinpointPal)

**Location-Based Social Navigation App**  
A full-stack social navigation platform for real-time location sharing and location-based reminders.

---

## Features

- Real-time location sharing with friends  
- Pin locations and set geofenced reminders  
- View friends’ shared locations on an interactive map  
- Place-type detection using Nominatim API  
- Geo-triggered notifications based on proximity  
- Secure authentication with JWT  
- Live updates powered by WebSockets

---

## Tech Stack

- Frontend: React.js, Leaflet.js, Capacitor  
- Backend: Go (Gin framework), MongoDB Atlas  
- APIs & Tools: Nominatim API, WebSockets, JWT

---

## Installation

### Frontend

```bash
# Clone the repository
git clone https://github.com/JoYBoy7214/PinpointPal.git
cd <frontend_folder>
npm install
npm start
```

### Backend

```bash
cd <backend_folder>
go run main.go
```

> Make sure MongoDB Atlas is configured and connected before running the backend.

---

## Usage

1. Register or log in with your account  
2. Pin a location on the map  
3. Set a location-based reminder with a custom message  
4. Share your location with friends and view their shared locations in real-time  
5. Receive notifications when you approach pinned locations

---

## Future Enhancements

- Group reminders for multiple friends  
- Mobile push notifications  
- Location history and analytics

---

## Author

Gowtham Balaji  

---

## License

This project is licensed under the MIT License.
