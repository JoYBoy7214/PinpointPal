import { instance } from "../api/reminder_api";

export const getPeople=async(setPeople,search)=>{
        try{
          const res=await instance.get("/people",{
            params:{
                type:search,
            }
          });
           setPeople(res.data.people);// message for backend response should contains Id also
        }
        catch(error){
            console.error("error in searching",error)
        }
}
export const addFriends=async(id)=>{
    try {
       const res = await instance.post("/friends", {
      recipient_id: id,
      status: "accepted" // optional: add default status
    });
    console.log("Friend request sent:", res.data);
    } catch (error) {
        console.error("error in adding friends",error);
    }
}
export const getFriends=async(setFriends)=>{
       try {
        const res=await instance.get("/friends");
        setFriends(res.data.friends)
       } catch (error) {
         console.error("error in fetching friends",error)
       }
}

