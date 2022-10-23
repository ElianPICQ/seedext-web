import { useEffect, useState } from "react";
import { getDocs } from "firebase/firestore"

import { Link, useNavigate } from "react-router-dom";
import { questionsCollectionRef } from "../firebase/firebase_collections";

import NavBar from "./../components/navbar"

import { categories } from "./../misc-data/data"
import Category from "./../components/category"

import phototest from "./../img/elephiere.jpg"


import "./styles/feed.css"
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase/init_firebase";

const Feed = () => {
  const navigate = useNavigate();
  const [user, loading] = useAuthState(auth);
  const [questions, setQuestions] = useState([]);


// fetch all questions
  useEffect(() => {
    // It is bad practique to buil useEffect as an async function
    // Its better to build an async func in it and call it
    const getQuestions = async () => {
      const data = await getDocs(questionsCollectionRef);

      // Parse data to only keep what we want (key: values)
      setQuestions(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    }


    getQuestions();
  }, [])

  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/");
  }, [user, loading]);

  return (
    <div id="feed">
      <NavBar />

      <h2>Learn everything you need to know</h2>

{/* The Search bar that doesnt work */}
      <form id="search-question">
        <input type="text"
              id="search-question__input"
              placeholder="Not working yet"
        />
        <button id="search-question__btn">Chercher</button>
      </form>

{/* Link to record a video/post a question */}
      <div id="ask-question-btn">

{/* Ask question button */}
        <Link to="/video">
          <div id="question-btn">
            <span>Posez une question!</span>
            <div></div>
          </div>
        </Link>
      </div>
      
{/* Filters for the feed (soon) */}
{/*
      <div id="feed-filters">


  {categories && categories.map((category) => {
return  <label className="single-filter" key={category.id}>
          <input type="checkbox" className="single-filter__input"
              value={category.name} />
          <span class="single-filter__clickable">{category.name}</span>
        </label>
  })}

      </div>
*/}

      <div id="all-questions">

{/* Display all questions */}

{questions && questions.map((question) => {
// Put everything in a link to the detailed question
// The thumbnail contains:
// an img, creation date of the question, category, title, username of the poster

return  <div className="feed-question-card" key={question.id}>
          <div className='thumbnail-image-container'>
            <img src={phototest} alt="test pour vignette"
                  className='thumbnail-image' />
          </div>
          <div className="thumbnail-info">
            <span className="thumbnail-creation-date">{question.creationDate}</span>
              <h4 className="thumbnail-category">{question.category}</h4>
              <h4  className="thumbnail-title">{question.title}</h4>
            <div className="thumbnail-bottom">
              <Link to={"/video/" + question.id} alt="question detail">
                <button className="thumbnail-button">More</button>
              </Link>
              <span className="thumbnail-poster">
                <span className="thumbnail-poster-deco">De: </span>{question.username}
              </span>
            </div>
          </div>
        </div>
})}
      </div>
    </div>
  );
};

export default Feed;