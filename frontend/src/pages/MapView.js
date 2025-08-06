// src/MapView.js
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import React, { useEffect, useState } from 'react';
import ReminderButton from '../components/ReminderButton.js';
import DistanceDisplay from '../components/getDistanceFromLatAndLon.js';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import Navbar from '../navbar/navbar.js';
import { instance } from '../api/reminder_api.js';
import { getAllReminder } from '../api/reminder_api.js';
import { Geolocation } from '@capacitor/geolocation';
import { haversine } from '../Geolocation/distance.js';
import { triggerNotification } from '../Geolocation/notification.js';
import { useWebSocket } from '../context/websocket.js';
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});
const customIconRestaurant = L.icon({
  iconUrl: require("../icons/restaurant.png"),
  iconSize: [30, 30], // width and height of the icon
  iconAnchor: [20, 40], // point of the icon which will correspond to marker's location
  popupAnchor: [0, -40], // point from which the popup should open relative to the iconAnchor
});
const customIconHospital = L.icon({
  iconUrl: require("../icons/hospital-buildings.png"),
  iconSize: [30, 30], // width and height of the icon
  iconAnchor: [20, 40], // point of the icon which will correspond to marker's location
  popupAnchor: [0, -40], // point from which the popup should open relative to the iconAnchor
});
const customIconSuperMarket = L.icon({
  iconUrl: require("../icons/shopping-cart.png"),
  iconSize: [30, 30], // width and height of the icon
  iconAnchor: [20, 40], // point of the icon which will correspond to marker's location
  popupAnchor: [0, -40], // point from which the popup should open relative to the iconAnchor
});
const customIconMall = L.icon({
  iconUrl: require("../icons/shopping-center.png"),
  iconSize: [30, 30], // width and height of the icon
  iconAnchor: [20, 50], // point of the icon which will correspond to marker's location
  popupAnchor: [0, -40], // point from which the popup should open relative to the iconAnchor
});
const customIconReminder = L.icon({
  iconUrl: require("../icons/pin.png"),
  iconSize: [30, 30], // width and height of the icon
  iconAnchor: [20, 50], // point of the icon which will correspond to marker's location
  popupAnchor: [0, -40], // point from which the popup should open relative to the iconAnchor
});
const pos = [10.7589, 78.8132]; // Latitude, Longitude

function DoubleClickHandler({ position, setPosition, reminder }) {
  useMapEvents({
    dblclick(e) {
      const { lat, lng } = e.latlng;

      const newPosition = { lat, lon: lng };
      setPosition((prev) => [...prev, newPosition]);
      console.log(position);
      //console.log('Double click at:', e.latlng);
    },
  });
  return null;
}
function FindCurrlocation({ setcurrLocation, setPosition }) {
  const map = useMapEvents({
    click() {
      map.locate();
    },
    locationfound(e) {
      setcurrLocation([e.latlng.lat, e.latlng.lng]);
    }
  })
  return null;
}
const MapView = () => {
  const [currLocation, setcurrLocation] = useState(pos)
  const [position, setposition] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [hospital, setHospital] = useState([]);
  const [supermarket, setSuperMarket] = useState([]);
  const [mall, setMall] = useState([]);
  const set = [setRestaurants, setHospital, setSuperMarket, setMall];
  const [reminder, setReminder] = useState([]);
  const highlights = ["restaurant", "hospital", "superMarket", "mall"];
  const [radius, setRadius] = useState(3000);
  const {friendsLocation}=useWebSocket();
  const highlightTags = [
    { key: "amenity", value: "restaurant" },
    { key: "amenity", value: "hospital" },
    { key: "shop", value: "supermarket" },
    { key: "shop", value: "mall" },
  ];
  useEffect(() => {
    const fetchRestaurants = async () => {
      for (let i = 0; i < highlightTags.length; i++) {
        const { key, value } = highlightTags[i];
        const query = `[out:json];
      node["${key}"="${value}"](around:${radius},${currLocation[0]},${currLocation[1]});
     out; `;
        const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;
        try {
          const res = await fetch(url);
          const data = await res.json();
          if (data.elements.length > 0) {
            set[i](data.elements);//data.element constains elements of each node(restaurants,hospital) 
            // console.log(data.elements)
            // console.log(data.elements.lat)
          } else {
            console.log(`no near ${highlights[i]}`);
          }
        } catch (err) {
          console.error("Failed to fetch from Overpass API:", err);
        }
      }
    };
    fetchRestaurants();
  }, [currLocation]);
  useEffect(() => {
    getAllReminder(setReminder, setposition)
    // console.log(position);
  }, [])
  useEffect(() => {
    const notified = new Set(); // prevent repeated notifications
    const watchId = Geolocation.watchPosition({}, async (position, err) => {
      if (err) return console.error(err);

      const { latitude, longitude } = position.coords;

      (reminder || []).forEach(rem => {
        const distance = haversine(latitude, longitude, rem.lat, rem.lon);
        if (distance < 0.1 && !notified.has(rem.id)) {
          triggerNotification(rem.title || 'Reminder');
          notified.add(rem.id);
        }
      });
    });
    return () => {
      Geolocation.clearWatch({ id: watchId });
    };
  }, [reminder]);
  return (
    <>
      <Navbar />
      <MapContainer center={currLocation} zoom={13} style={{ height: '100vh', width: '100%' }} doubleClickZoom={false} zoomControl={false} >
        <TileLayer
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {friendsLocation.map((friends,index)=>{
          <marker key={index} position={[friends.lat,friends.lon]} icon={customIconReminder}>
            <Popup>
              <DistanceDisplay
                lat1={currLocation[0]}
                lon1={currLocation[1]}
                lat2={friends.lat}
                lon2={friends.lon}
              /><br />
            </Popup>
          </marker>
        })}
        {position.filter(place => place.lat !== undefined && place.lat !== undefined).map((place, index) => (
          <Marker key={index} position={[place.lat, place.lon]} icon={customIconReminder}>
            <Popup>
              <DistanceDisplay
                lat1={currLocation[0]}
                lon1={currLocation[1]}
                lat2={place.lat}
                lon2={place.lon}
              /><br />
              <ReminderButton location={[place.lat, place.lon]} setReminder={setReminder} reminder={reminder} />
              <br />

            </Popup>
          </Marker>
        ))}
        {restaurants.map((place, index) => (
          <Marker key={index} position={[place.lat, place.lon]} icon={customIconRestaurant}>
            <Popup>
              <strong>Restaurant</strong><br />
              <strong> {place.tags.name}</strong><br />
              <DistanceDisplay
                lat1={currLocation[0]}
                lon1={currLocation[1]}
                lat2={place.lat}
                lon2={place.lon}
              /> <br />

              <ReminderButton location={[place.lat, place.lon]} setReminder={setReminder} />
            </Popup>
          </Marker>
        ))}

        {hospital.map((place, index) => (
          <Marker key={index} position={[place.lat, place.lon]} icon={customIconHospital}>
            <Popup>
              <strong>Hospital</strong><br />
              <strong> {place.tags.name}</strong><br />
              <DistanceDisplay
                lat1={currLocation[0]}
                lon1={currLocation[1]}
                lat2={place.lat}
                lon2={place.lon}
              /><br />
              <ReminderButton location={[place.lat, place.lon]} setReminder={setReminder} />
            </Popup>
          </Marker>
        ))}
        {supermarket.map((place, index) => (
          <Marker key={index} position={[place.lat, place.lon]} icon={customIconSuperMarket}>
            <Popup>

              <strong> {place.tags.name}</strong><br />
              <DistanceDisplay
                lat1={currLocation[0]}
                lon1={currLocation[1]}
                lat2={place.lat}
                lon2={place.lon}
              /><br />
              <ReminderButton location={[place.lat, place.lon]} setReminder={setReminder} />

            </Popup>
          </Marker>
        ))}
        {mall.map((place, index) => (
          <Marker key={index} position={[place.lat, place.lon]} icon={customIconMall}>
            <Popup>
              <strong>Hospital</strong><br />
              <strong> {place.tags.name}</strong><br />
              <DistanceDisplay
                lat1={currLocation[0]}
                lon1={currLocation[1]}
                lat2={place.lat}
                lon2={place.lon}
              /><br />
              <ReminderButton location={[place.lat, place.lon]} setReminder={setReminder} />
            </Popup>
          </Marker>
        ))}
        <FindCurrlocation setcurrLocation={setcurrLocation} setPosition={setposition} />
        <DoubleClickHandler position={position} setPosition={setposition} currLocation={currLocation} reminder={reminder} />
      </MapContainer>
    </>
  );
};

export default MapView;
