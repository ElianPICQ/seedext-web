import { useEffect, useState } from "react"

import { query, where, getDocs, doc, getDoc } from "firebase/firestore"
import { getStorage, ref, getDownloadURL } from "firebase/storage";

import { usersCollectionRef } from "./../firebase/firebase_collections"
import { questionsCollectionRef } from "./../firebase/firebase_collections"
import { db } from "./../firebase/init_firebase"



import "./styles/response_card.css"


function ResponseCard({response}) {

  const [vidUrl, setVidUrl] = useState("");
  const [user, setUser] = useState([])
  const [username, setUsername] = useState("");
  const uid = response.user

// Get the video from storage
  useEffect(() => {
    const storage = getStorage()

  // Link to the video in firestore
  getDownloadURL(ref(storage, "responses/video/" + response.videoResponseUrl))
    .then((url) => {
      setVidUrl(url)
    })
    .catch((err) => {
      console.log(err.message)
    })
  }, [vidUrl])


// Fetch the user who responded
  useEffect(() => {
    const getUser = async () => {
      const q = query(usersCollectionRef, where("uid", "==", uid));
      const querySnapshot = await getDocs(q);

      setUser(querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      setUsername(user[0].username)
    }
    getUser();
  }) 


  return (
    <div className="response-card">
      <div className="response-video-aside">
        <p>{response.textResponse}</p>
        <span>{username}</span>
      </div>

      <video key={vidUrl} controls>
        <source src={vidUrl} />
      </video>
    </div>
  );
}

export default ResponseCard;