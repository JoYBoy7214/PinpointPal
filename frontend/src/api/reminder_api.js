
import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api'; 

export const instance = axios.create({
  baseURL: BASE_URL,
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); 
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


export const getAllReminder=async (setReminder,setPosition)=>{
  try {
     const res =await instance.get("/reminder")
      const reminders = res.data.reminder;
     
 setReminder(res.data.reminder);
 //console.log(reminders)
  setPosition(
     reminders
    .filter(rem => rem.lat!=null && rem.lon!=null)
    .map(rem => ({lat:rem.lat, lon:rem.lon}))
    );
     
  } catch (error) {
      console.error("Failed to fetch reminders:", error);
  }
};

