import React, { useEffect, useState } from 'react';
import './Navbar.css';
import { getPeople } from '../components/getFriends';
import { getFriends } from '../components/getFriends';
import { addFriends } from '../components/getFriends';
import { useWebSocket } from '../context/websocket';

const Navbar = () => {
  const [people,setPeople]=useState([]);
  const [friends,setFriends]=useState([]);
  const [searching,setSearching]=useState();
  const [locatingfriend,setLocatingFriends]=useState();
  const {requestLocation}=useWebSocket(); 
  
  useEffect(()=>{
   getPeople(setPeople,searching);
  },[searching])
  useEffect(()=>{
    getFriends(setFriends)
  },[])

  
  return (
    <div className="navbar-container">
      <div className="nav-box">
        <input
          className="nav-input"
          type="text"
          value={searching}
          onChange={(e) => setSearching(e.target.value)}
          placeholder="Looking for New Friends"
        />
        {(people||[]).map((person,index)=>(
          <div className='person' key={index}>
            <p>{person.name}</p>
            <button onClick={()=>addFriends(person.id)}>ADD AS  FRIEND</button>
          </div>
      ))}
      </div>
      <div className="nav-box">
        <input
          className="nav-input"
          type="text"
          value={locatingfriend}
          onChange={(e) => setLocatingFriends(e.target.value)}
          placeholder="Find Your Friends"
        />
       {(friends||[]).filter(friend=>friend.name.toLowerCase().includes((locatingfriend || '').toLowerCase())).map((friend,index)=>(
        <div className='friends' key={index}>
            <p>{friend.name}</p>
            <button onClick={()=>requestLocation(friend.id)}>Click to Locate</button> 
          </div>
       ))}
      </div>
    </div>
  );
};

export default Navbar;
