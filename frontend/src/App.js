// src/App.js
import React from 'react';
import { useEffect } from 'react';
import MapView from './pages/MapView';
import Login from './pages/login';
import Signup from './pages/signup';
import { Routes, Route } from 'react-router-dom';
import { WebSocketProvider } from './context/websocket';
function App() {
  // useEffect(() => {//service worker no use for now
  //   if ('serviceWorker' in navigator && 'PushManager' in window) { //check if serviceWorker and PushManager are allowed in the browser
  //     navigator.serviceWorker.register('/sw.js').then(registration => { //register the service worker
  //       console.log('Service Worker registered:', registration);

  //       Notification.requestPermission().then(permission => {
  //         if (permission === 'granted') {
  //           registration.pushManager.subscribe({ //user subscribe to the notification
  //             userVisibleOnly: true,
  //             applicationServerKey: '<YOUR_VAPID_PUBLIC_KEY>',
  //           }).then(subscription => {
  //             console.log('Subscription:', subscription);
  //             fetch('http://localhost:3001/subscribe', { //sends the subscription to the backend
  //               method: 'POST',
  //               headers: { 'Content-Type': 'application/json' },
  //               body: JSON.stringify({userId: '<current_user_id>',subscription: subscription})
  //             });
  //           });
  //         }
  //       });
  //     });
  //   }
  // }, []);
  return (
    <WebSocketProvider>
   <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/mapView" element={<MapView />} />
    </Routes>
    </WebSocketProvider>
  );
}

export default App;
