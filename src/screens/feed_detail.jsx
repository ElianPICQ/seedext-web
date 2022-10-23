import { useEffect, useState } from 'react';
import { useLocation, Link } from "react-router-dom"

import { questionsCollectionRef } from "../firebase/firebase_collections";
import { getDocs } from "firebase/firestore"


import "./styles/feed_detail.css"
import "./styles/feed.css"


function FeedDetail() {

  // Use location to retrieve params from Link (here its category name)
  const location = useLocation();
  const { category } = location.state;

  const [ questions, setQuestions ] = useState([]);

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


  return (
    <div id="feed-detail">
      <Link to="/feed">
        <span>back</span>
      </Link>
      <h3>Feed Detail</h3>
      <h4>{category}</h4>

      <div className="videofeed-category">
    {questions && questions.map((question) => {
    if (question.category === (category).toLowerCase()) {

return  <Link to={'/video/' + question.id}
              className="question-link category-card"
              alt="question detail"
              key={question.id}>
          <div className="question-card">
            <h4>{question.title}</h4>
          </div>
        </Link>
        }
    })}
      </div>


    </div>
  );
}

export default FeedDetail;