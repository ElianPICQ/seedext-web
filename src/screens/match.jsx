import { useState, useEffect } from "react"
import { getAuth } from "firebase/auth"

import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { getFirestore, doc, getDoc } from "firebase/firestore"
import { db } from "./../firebase/init_firebase"
import { usersCollectionRef } from "./../firebase/firebase_collections";

import { useNavigate } from "react-router-dom"

import { IoArrowBackOutline } from "react-icons/io5"


import "./styles/match.css"


function  Match() {

  const navigate = useNavigate();

  const auth = getAuth();
  const uid = auth.currentUser.uid;

{/* User's data */}
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPhone, setUserphone] = useState("");
  const [userLinkedin, setUserLinkedin] = useState("");
  const [vidUrl, setVidUrl] = useState("");
  const [vidSrc, setVidSrc] = useState("");

  const [picUrl, setPicUrl] = useState("");
  const [picSrc, setPicSrc] = useState("");

{/* User's match data */}
  const [matchUID, setMatchUID] = useState("");
  const [matchName, setMatchName] = useState("");
  const [matchEmail, setMatchEmail] = useState("");
  const [matchPhone, setMatchPhone] = useState("");
  const [matchLinkedin, setMatchLinkedin] = useState("");
  const [matchVidUrl, setMatchVidUrl] = useState("");
  const [matchVidSrc, setMatchVidSrc] = useState("");

  const [matchPicUrl, setMatchPicUrl] = useState("");
  const [matchPicSrc, setMatchPicSrc] = useState("");


// Fetch the user's data
  useEffect(() => {

    const fetchUser = async () => {
      const userDoc = doc(db, "users", uid);
      const docSnapshot = await getDoc(userDoc);

      setUserName(docSnapshot.data().name);
      setUserEmail(docSnapshot.data().email);
      setUserphone(docSnapshot.data().phoneNum);
      setUserLinkedin(docSnapshot.data().linkedin);
      setVidUrl(docSnapshot.data().mentorVidUrl);

      if (!vidUrl) {
        setPicUrl(docSnapshot.data().mentorPicUrl);
      }

      setMatchUID(docSnapshot.data().match_uid);
    }
    fetchUser();
  }, [matchUID])



// Fetch match's data
  useEffect(() => {

    const fetchMatch = async () => {
      const matchDoc = doc(db, "users", matchUID);
      const matchDocSnap = await getDoc(matchDoc);

      setMatchName(matchDocSnap.data().name);
      setMatchEmail(matchDocSnap.data().email);
      setMatchPhone(matchDocSnap.data().phoneNum);
      setMatchLinkedin(matchDocSnap.data().linkedin);
      setMatchVidUrl(matchDocSnap.data().mentorVidUrl);
      console.log("match vid ===", matchVidUrl) 

      if (!matchVidUrl) {
        setMatchPicUrl(matchDocSnap.data().mentorPicUrl);
      }
    }
    fetchMatch();
  }, [matchUID])



// Get the user's video from cloud storage
  useEffect(() => {
    // Prepare to link to DB
    const storage = getStorage();

    if (vidUrl) {
      // Link to DB, and find the correct key: value where the 2nd argument is the key
      getDownloadURL(ref(storage, 'mentorVideos/' + vidUrl))
        .then((url) => {
          // set the src of the video player below to the fetched 'url'.
          setVidSrc(url)
        })
        .catch((error) =>  {
          console.log(error.message)
        })
    }
    else if (picUrl) {
      // Link to DB, and find the correct key: value where the 2nd argument is the key
      getDownloadURL(ref(storage, 'mentorVideos/' + picUrl))
        .then((url) => {
          // set the src of the video player below to the fetched 'url'.
          setPicSrc(url)
        })
        .catch((error) =>  {
          console.log(error.message)
        })
    }

  }, [vidUrl, picUrl]);



// Get the match's video from cloud storage
  useEffect(() => {
    // Prepare to link to DB
    const storage = getStorage();
    console.log("GO METTRE LA VIDEO DU MATCH", matchVidUrl)

    if (matchVidUrl) {
      console.log("LA CA VA TELECHARGER LA VIDEO")
      // Link to DB, and find the correct key: value where the 2nd argument is the key
      getDownloadURL(ref(storage, 'mentorVideos/' + matchVidUrl))
        .then((url) => {
          // set the src of the video player below to the fetched 'url'.
          setMatchVidSrc(url)
        })
        .catch((error) =>  {
          console.log(error.message)
        })
    }
    else if (matchPicUrl) {
      // Link to DB, and find the correct key: value where the 2nd argument is the key
      getDownloadURL(ref(storage, 'mentorVideos/' + matchPicUrl))
        .then((url) => {
          // set the src of the video player below to the fetched 'url'.
          setMatchPicSrc(url)
        })
        .catch((error) =>  {
          console.log(error.message)
        })
    }

  }, [matchVidUrl, matchPicUrl]);



  return (
    <div id="match-screen">

      <header>
  {/* This mean: go to the previous page */}
        <div className="header-back-btn">
          <IoArrowBackOutline />
          <span onClick={() => navigate(-1)}>Back</span>
        </div>
      </header>

      <div id="mentoring-cards">


{/* Match mentoring infos */}
        <h3>Mon Match</h3>
        <div id="user-match-card">

{matchVidSrc &&  <div className="mentoring-video">
            <video key={matchVidSrc} controls>
              <source src={matchVidSrc} />
            </video>
          </div>
        }

{matchPicSrc &&  <div className="mentoring-picture">
            <img
              src={matchPicSrc}
              alt="user picture"
            />
          </div>
        }

          <div className="mentoring-infos">
            <span className="mentorName">{matchName}</span>
            <span className="mentorEmail">{matchEmail}</span>
            <span className="mentorPhone">{matchPhone}</span>
            <span className="mentorLinkedin">{matchLinkedin}</span>
          </div>

        </div>


{/* User mentoring infos */}
        <h3>Mes infos</h3>
        <div id="user-card">

{vidSrc &&  <div className="mentoring-video">
            <video key={vidSrc} controls>
              <source src={vidSrc} />
            </video>
          </div>
        }

{picSrc &&  <div className="mentoring-picture">
            <img
              src={picSrc}
              alt="user picture"
            />
          </div>
        }



          <div className="mentoring-infos">
            <span className="mentorName">{userName}</span>
            <span className="mentorEmail">{userEmail}</span>
            <span className="mentorPhone">{userPhone}</span>
            <span className="mentorLinkedin">{userLinkedin}</span>
          </div>

        </div>

      </div>
    </div>
  );
}

export default Match;