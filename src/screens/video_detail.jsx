import { useEffect, useState } from 'react';

import { Link, useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { getStorage, ref, getDownloadURL } from "firebase/storage";

import { responsesCollectionRef } from "./../firebase/firebase_collections"

import { db } from "./../firebase/init_firebase"

import ResponseCard from "./../components/response_card"
import NavBar from "./../components/navbar"


import "./styles/video_detail.css"


function VideoDetail() {

// Video "metadata"
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");

  const [fileName, setFileName] = useState("");

// The part of the url we have in our DB
// We'll use it wit a static path to fetch the right video
  const [dbUrl, setDbUrl] = useState("");
  const [vidUrl, setVidUrl] = useState("");

  const {id} = useParams()

  // Here used to navigate to the previous page (like the navigator's back btn)
  const navigate = useNavigate();

  const [responses, setResponses] = useState([]);

// Get Database data on the video
  useEffect(() => {

    // Async function in useEffect()
    const getQuestion = async () => {
      // Create a ref to the data we want
      const docRef = doc(db, "questions", id);
      // Make a request to get the data
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        setTitle(docSnap.data().title);
        setDescription(docSnap.data().description);
        setCategory(docSnap.data().category);
        setDbUrl(docSnap.data().videourl);
        setFileName(docSnap.data().questionFile);

        console.log("getdata", dbUrl);
      } else {
        console.log("No such document");
      }
    }

    getQuestion();
  });

// Get the video from cloud storage
  useEffect(() => {
    // Prepare to link to DB
    const storage = getStorage();

    // Link to DB, and find the correct key: value where the 2nd argument is the key
    getDownloadURL(ref(storage, 'blob:http:/localhost:3000/' + dbUrl))
      .then((url) => {
        // set the src of the video player below to the fetched 'url'.
        setVidUrl(url)
      })
      .catch((error) =>  {
        console.log(error.message)
      })
  }, [dbUrl]);


// Fetch the optional file if it exists
  useEffect(() => {

    const getOptionalFile = async () => {

      const storage = getStorage();

      await getDownloadURL(ref(storage, 'questionFiles/' + fileName))
        .then((url) => {
        // Get parent node & next node to use "insertBefore"
          const answerLink = document.getElementById("answer-link");
          const videoDetail = document.getElementById("video-detail");

          // Put in <a> tag to have access to ressource
          const downloadLink = document.createElement('a');
          const downloadLinkText = document.createTextNode(fileName);
          downloadLink.appendChild(downloadLinkText);
          downloadLink.href = url;
          // Here we'll just be redirected to an online page 'hosting' the file
          downloadLink.setAttribute("target", "_blank")
          downloadLink.style.paddingLeft = "75px"
          videoDetail.insertBefore(downloadLink, answerLink)
        })
        .catch((error) => {
          console.log(error.message);
        })
    }
    getOptionalFile();

  }, [fileName]);


// Retrieve all existing responses (of our question)
  useEffect(() => {
    const getResponses = async () => {
      const q = query(responsesCollectionRef, where("questionID", "==", id));
      const querySnapshot = await getDocs(q);

      setResponses(querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    }

    getResponses();
  }, []);



  return (
    <div id="video-detail">

      <NavBar />

{/* Keep header or replace with navbar */}
{/*
      <header>
        <span onClick={() => navigate(-1)}>back</span>
      </header>
*/}

{/* The Question */}
      <section id="question-detail">
        <div id="question-detail__infos">

{/* Question's Category */}
          <h3>{category.toUpperCase()}</h3>

{/* Question's Title */}
          <h2 id="question-detail__title">{title}</h2>

{/* Question's Description */}
          <span id="question-detail__description">
            <h2>Description :</h2>
            {description}
          </span>
        </div>

{/* /!\ The 'key' and 'src' attributes are both needed */}
        <video key={vidUrl} controls>
          <source src={vidUrl} />
        </video>
      </section>

{/* Optional file spot  */}
      <div id="optionnal-file">
        <h4>Fichier optionnel:</h4>
        <span>{fileName ? "" : "None"}</span>
      </div>


{/* Btn to respond */}
      <Link to={"/response/" + id} id="answer-link">
        <span id="respond-to-question-btn">Répondre</span>
      </Link>

{/* The Answers */}

      <div id="responses">
{responses && responses.map((response) => {

return  <ResponseCard response={response} key={response.id} />
})}

      </div>

    </div>
  );
}

export default VideoDetail;