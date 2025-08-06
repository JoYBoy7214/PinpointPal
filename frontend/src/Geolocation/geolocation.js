import { Geolocation } from '@capacitor/geolocation';
import { triggerNotification } from './notification';
import { haversine } from './distance';
export const watchId=Geolocation.watchPosition({}, async (position, err) => {
  if (err) return console.error(err);

  const { latitude, longitude } = position.coords;

  (reminders||[]).forEach(rem => {
    const distance = haversine(latitude, longitude, rem.lat, rem.lon);
    if (distance < 0.1) { // less than 100 meters
      triggerNotification(rem.title);
    }
  });
});
