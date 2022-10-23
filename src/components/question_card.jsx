import { useState, useEffect } from "react"
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { Link } from "react-router-dom"

import "./styles/question_card.css"


function  QuestionCard({question}) {
  const [vidUrl, setVidUrl] = useState("");
  const [username, setUsername] = useState("");


// Get the video from storage
  useEffect(() => {
    const storage = getStorage()


  // Link to the video in firestore
  getDownloadURL(ref(storage, "blob:http:/localhost:3000/" + question.videourl))
    .then((url) => {
      setVidUrl(url)
    })
    .catch((err) => {
      console.log(err.message)
    })
  }, [vidUrl]);

  return (
    <div className="question-card">
      <div className="question-card__infos">
        <h3>{question.category.toUpperCase()}</h3>
        <h2>{question.title}</h2>
        <p>{question.description}</p>
        <Link to={"/video/" + question.id} alt="question detail">
          <span>DETAIL</span>
        </Link>
      </div>
      <video key={vidUrl} controls>
        <source src={vidUrl} />
      </video>
    </div>
  );
}

export default QuestionCard;