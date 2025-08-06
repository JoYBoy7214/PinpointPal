// src/context/WebSocketContext.jsx
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

const WebSocketContext = createContext();

export const WebSocketProvider = ({ children }) => {
  const socketRef = useRef(null);
  const [location, setLocation] = useState({ lat: null, lng: null });
  const [watchId, setWatchId] = useState(null);
  const [requestedId, setRequestedId] = useState([]);
  const [friendsLocation, setFriendsLocation] = useState([]);

  // 1. Geolocation tracking
  useEffect(() => {
    if (!navigator.geolocation) return;

    const id = navigator.geolocation.watchPosition(
      (pos) => {
        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      (err) => console.error("Geolocation error:", err.message),
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
    setWatchId(id);

    return () => navigator.geolocation.clearWatch(id);
  }, []);

  // 2. Setup WebSocket
  useEffect(() => {
    socketRef.current = new WebSocket("ws://localhost:8080/ws");

    socketRef.current.onopen = () => console.log("🟢 Socket connected");

    socketRef.current.onmessage = (e) => {
      const msg = JSON.parse(e.data);

      if (msg.type === "request") {
        setRequestedId((prev) => [...prev, msg.userId]);
      } else if (msg.type === "response") {
        const newLoc = {
          lat: msg.lat,
          lon: msg.lon,
          id: msg.id,
        };

        setFriendsLocation((prev) => {
          const exists = prev.some((f) => f.id === newLoc.id);
          return exists
            ? prev.map((f) => (f.id === newLoc.id ? newLoc : f))
            : [...prev, newLoc];
        });
      }
    };

    return () => socketRef.current?.close();
  }, []);

  // 3. Respond to requests
  useEffect(() => {
    if (
      socketRef.current?.readyState === WebSocket.OPEN &&
      requestedId.length > 0
    ) {
      requestedId.forEach((id) => {
        socketRef.current.send(
          JSON.stringify({
            Type: "response",
            lat: location.lat,
            lon: location.lng,
            userId: id,
          })
        );
      });
      // Clear after responding
    }
  }, [location, requestedId]);

  const requestLocation = (userId) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(
        JSON.stringify({
          Type: "request",
          userId:userId,
        })
      );
    } else {
      console.warn("Socket not open");
    }
  };

  return (
    <WebSocketContext.Provider
      value={{ requestLocation, friendsLocation, location }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => useContext(WebSocketContext);
