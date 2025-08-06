import React, { useState } from "react"
import {instance} from "../api/reminder_api";
const ReminderButton=({location,setReminder,reminder})=>{
   const handleOnClickRemove=async()=>{
       try {
    const matched = reminder.find(r => r.lat === location[0] && r.lon === location[1]);

    if (!matched) {
      console.error("No matching reminder found");
      return;
    }
    setReminder(prev => prev.filter(r => r.id !== matched.id));

    const res = await instance.delete(`/reminder/${matched.id}`);
    alert("Reminder removed successfully!");
  } catch (err) {
    const errorMessage = 
      err.response?.data?.error || 
      err.response?.data?.message || 
      'Failed to remove reminder';

    console.error(errorMessage);
    alert(errorMessage);
  }
     };
      const handleOnClickAddReminder=async()=>{
      try {
         const newLocation = { lat: location[0], lon: location[1] };
         const res=await instance.post('/reminder',newLocation);
         const newId=res.data.id
         setReminder(prev => [...(prev || []), { ...newLocation, id: newId }]);

          alert('Reminder added successful!');
      } catch (err) {
        const errorMessage = 
    err.response?.data?.error || 
    err.response?.data?.message || 
    'Failed to add reminder';
  
  console.error(errorMessage);
  alert(errorMessage);
      }
    };
   return(
    <>
    <button onClick={ handleOnClickAddReminder }>Add Reminder</button>
    <br/>
    <button onClick={handleOnClickRemove}>To Remove</button>
    </>
   )
}
export default ReminderButton