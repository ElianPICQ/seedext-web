import { useState, useEffect } from "react";

import { Link, useNavigate } from "react-router-dom"

// Imports to record ourselves
import { useReactMediaRecorder } from "react-media-recorder";
import Webcam from "react-webcam";

// Import the link to the firebase project
import { storage } from "./../firebase/init_firebase"
import { questionsCollectionRef } from "./../firebase/firebase_collections"
import { usersCollectionRef } from "./../firebase/firebase_collections"

import { getAuth } from "firebase/auth"

// Import for firestore
import { ref, uploadBytes, uploadBytesResumable, getDownloadURL } from "firebase/storage"
import { addDoc, query, where, getDocs } from "firebase/firestore"


import Loading from "./../components/loading"
import NavBar from "./../components/navbar"


import "./styles/video.css"


/*
* On this video screen, i used 2 packages:
*
* react-webcam          to have a real time webcam of the device of my screen
* react-media-recorder  to record the camera feed and have a preview (doesnt show real time webcam)
*/

const Video = () => {
  // Method call to react-media-recorder
  // mediaBlobUrl will be the ressource to retrieve
  const { startRecording, stopRecording, mediaBlobUrl } =
    useReactMediaRecorder({ audio: true, video: true });
  // Bool to know when to show the webcam or the preview
  const [recording, setRecording] = useState(false);

  // RealTime Webcam & the preview are displayed one after the other.
  // I use "recording" to know which one to display
  // Pb: when no video is recorded, the preview is empty (it leaves a hole instead of the video player)
  // This problem is solved with "firstTime"
  const [firstTime, setFirstTime] = useState(true);

  // Additional infos on the question
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
/*  There is also the username just bellow and the creation date
*   is created when uploading the question
*/
  
  // Bool to show the loading anim or not
  const [uploading, setUploading] = useState(false);
  

  // Progress bar for optional file upload
  const [progress, setProgress] = useState(0);

  // To redirect after publishing
  const navigate = useNavigate();

  // Fetch current user UID
  const auth = getAuth();
  const currentUser = auth.currentUser;
  const uid = currentUser .uid;

  const [user, setUser] = useState([])
  const [username, setUsername] = useState("");


// Fetch current username
  useEffect(() => {
    const getUser = async () => {
      const q = query(usersCollectionRef, where("uid", "==", uid));
      const querySnapshot = await getDocs(q);

      setUser(querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      setUsername(user[0].username)
    }
    getUser();
  }, [uid, user])


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


// THIS is what happens when you hit "publish"
  // Check if the opt file exists and set the name for later
  const checkFileInput = (e) => {
    e.preventDefault()

    // Show the loading anim
    setUploading(true);
    
    let file;

// Looking at target[3] because our file is the 4th input of the form
    if (e.target[3].files[0]) {
      file = e.target[3].files[0];
    }
    submitVideo(file);
  }

// SUBMIT ALL DATA HERE (this function is called by checkFileInput())
  const submitVideo = async (file) => {

    console.log("Please wait, uploading");

    // Split the blob to keep onl the url (not the full path)
    let splitBlob = mediaBlobUrl.split('/');
    let blobUrl = splitBlob[3];

    // Get current Date, and split it because easier
    const date = new Date();
    const day = date.getDate();
    const month = date.getMonth() + 1; // Cause January is month: 0
    const year = date.getFullYear();
    const currentDate = `${day}-${month}-${year}`

// Submit data to DB
    if (file === undefined) {
      await addDoc(questionsCollectionRef, { creationDate: currentDate, username, uid, title, description, category, videourl: blobUrl, questionFile: ""});
    } else if (file.name) {
      await addDoc(questionsCollectionRef, { creationDate: currentDate, username, uid, title, description, category, videourl: blobUrl, questionFile: file.name});
    }

// Submit files to cloud storage
  // Submit optional file
    if (file) {
      const storageRef = ref(storage, `questionFiles/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on("stage_changed", (snapshot) => {
        const prog = (Math.round
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        setProgress(prog);
      },
      (err) => console.log(err),
      () => {
        getDownloadURL(uploadTask.snapshot.ref)
        .then(url => console.log("Data has been sent to the Database"))
      });
    }

  // Submit the video
    // Turn the Blob URL into something we can send to firestore
    let blob = await fetch(mediaBlobUrl).then(r => r.blob());

    // Path to the database & key of the data (key: data) where data is the Blob
    // Key (and path) will be mediaBlobUrl
    // each '/' is an intersection in the path
    const storageRef = ref(storage, mediaBlobUrl);
    // Upload to firestore
    uploadBytes(storageRef, blob).then((snapshot) => {
      console.log("Uploaded video!");

// Should add pop-up with 2 buttons saying
// "Question upladed ! goto feed? ask another?"
      navigate("/feed");
    });
  };


  return (
    <div id="video-screen">
      <NavBar />

      <form onSubmit={checkFileInput}>  
{/* Let the user enter a title for his question (REQUIRED) */}
        <div className="question-more-infos">
          <div className="question-more-infos__main">
            <label className="title-label">Titre</label>
            <input
              type="text"
              className="question-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Requis"
              required
            />

{/* Let the user add a category to his question (REQUIRED) */}
            <label className="select-category__label">Catégorie</label>
            <select className="select-category" 
              onChange={e => setCategory(e.target.value)}
              required>
              <option value="" hidden>--Choisir Catégorie--</option>
              <option value="feedback">Feedback</option>
              <option value="finance">Finance</option>
              <option value="informatique">Informatique</option>
              <option value="marketing">Marketing</option>
              <option value="autres">Autres</option>
            </select>
          </div>

{/* Let the user add text/ a description (OPTIONNAL) */}
          <textarea
            className="question-desc"
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Ajouter une description..."
          />
        </div>

    {/* Let user add a media (photo, video, screen...) (OPTIONNAL) */}
        <label>Ajouter un fichier?</label>
        <br />
        <input
          type="file"
          className="question-file"
        />

{/* UPLOAD BUTTON SHOULD ONLY APPEAR ONCE A VIDEO IS RECORDED */}
{mediaBlobUrl && <button type="submit" id="upload-question-btn">upload file</button>}
      </form>

    {/* ----------------------- VIDEO PLAYER ----------------------- */}
{/* RealTime feedback */}
      {(firstTime || recording) && <Webcam audio={false} className="webcam" />}

{/* Recorded preview */}
      {(!firstTime && !recording) && <video src={mediaBlobUrl} className="video-preview" controls autoPlay />}


{/* Start/Stop recording button */}
      <div className="bottom-page">
        <input className="record-btn"
          onClick={record}
          type="button"
          value={`${recording ? 'Stop' : 'Start'} recording`}
        />

      </div>

{/* Submit Button */}
{/*
      <button
        className="submit-btn"
        onClick={submitVideo}>
        Publier
      </button>
*/}


      {uploading && <Loading />}

    </div>
  );
};

export default Video;