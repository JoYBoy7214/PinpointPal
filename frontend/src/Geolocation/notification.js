import { LocalNotifications } from '@capacitor/local-notifications';
export const triggerNotification = async (title) => {
  await LocalNotifications.schedule({
    notifications: [
      {
        title: "Reminder Nearby!",
        body: title,
        id: Date.now(),
        schedule: { at: new Date(Date.now() + 100) },
      },
    ],
  });
};
