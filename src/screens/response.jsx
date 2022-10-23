import { useState } from "react"

import { useNavigate, useParams } from "react-router-dom"
// Firebase/firestore imports
import { getAuth } from "firebase/auth"
import { addDoc } from "firebase/firestore"
import { ref, uploadBytes } from "firebase/storage"

import { storage } from "./../firebase/init_firebase"

// Imports to record ourselves
import { useReactMediaRecorder } from "react-media-recorder";
import Webcam from "react-webcam";

import { IoArrowBackOutline } from "react-icons/io5"


import { responsesCollectionRef } from "./../firebase/firebase_collections"

import NavBar from "./../components/navbar"


import "./styles/response.css"


function  Response() {
  const navigate = useNavigate();
  const {id} = useParams();

  const [textResponse, setTextResponse] = useState("");

  // Method call to react-media-recorder
  // mediaBlobUrl will be the ressource to retrieve
  const { startRecording, stopRecording, mediaBlobUrl } =
    useReactMediaRecorder({ audio: true, video: true });

  let blobUrl = "";

  // Bool to know when to show the webcam or the preview
  const [recording, setRecording] = useState(false);
  // RealTime Webcam & the preview are displayed one after the other.
  // I use "recording" to know which one to display
  // Pb: when no video is recorded, the preview is empty (it leaves a hole instead of the video player)
  // This problem is solved with "firstTime"
  const [firstTime, setFirstTime] = useState(true);


  const auth = getAuth();
  const user = auth.currentUser;
  const uid = user.uid;


  // Method to Start/Stop the recording
  const record = (e) => {
    e.preventDefault();
    // Now that we have (will have) a preview, we dont need to show the Webcam when not recording
    setFirstTime(false);

    if (recording) {
      stopRecording();
      setRecording(false)
    }
    else if (!recording) {
      startRecording();
      setRecording(true)
    }
  }

// SUBMIT ALL DATA HERE
  const submitVideo = async (file) => {
    console.log("Please wait, uploading");

// Submit data to DB
    if (mediaBlobUrl) {
      let splitBlob = mediaBlobUrl.split('/');
      blobUrl = splitBlob[3];
    }

    if (blobUrl !== "" || textResponse !== "") {
      await addDoc(responsesCollectionRef, {questionID: id, user: uid , videoResponseUrl: blobUrl, textResponse })
    } else {
      alert("Aucune réponse enregistrée");  
    }

  // Store video in firestore
    let blob = await fetch(mediaBlobUrl).then(r => r.blob());

    // Path to the database & key of the data (key: data) where data is the Blob
    // Key will be mediaBlobUrl
    const storageRef = ref(storage, "responses/video/" + blobUrl);
    // Upload to firestore
    uploadBytes(storageRef, blob).then((snapshot) => {
      console.log("Uploaded video!");

// Should add pop-up with 2 buttons saying
// "Question upladed ! goto feed? ask another?"
      navigate("/feed");
    });

  };



  return (
    <div id="response-container">

      <NavBar />

  {/* Keep header or replace with navbar */}
      <header>
  {/* This mean: go to the previous page */}
        <IoArrowBackOutline />
        <span onClick={() => navigate(-1)}>Back</span>
      </header>

      <div id="response-field">

        <textarea
          onChange={(e) => setTextResponse(e.target.value)}
          id="response-text-area"
        />

    {/* ----------------------- VIDEO PLAYER ----------------------- */}
{/* RealTime feedback */}
      {(firstTime || recording) && <Webcam audio={false} className="webcam" />}

{/* Recorded preview */}
      {(!firstTime && !recording) && <video src={mediaBlobUrl} className="video-preview" controls autoPlay />}

      </div>

{/* Start/Stop recording button */}
      <div className="bottom-page">
        <input className="record-btn"
          onClick={record}
          type="button"
          value={`${recording ? 'Stop' : 'Start'} recording`}
        />

        {mediaBlobUrl && <button className="submit-response" onClick={submitVideo}>submit</button>}
      </div>

    </div>
  );
}

export default Response;