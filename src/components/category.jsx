import React, { useEffect, useState } from "react";
import { getDocs } from "firebase/firestore"

import { Link } from "react-router-dom";
import { questionsCollectionRef } from "../firebase/firebase_collections";


function Category(props) {

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

  <div className="category-div">
    <Link to={"/feed/" + props.category}
          alt="feed category"
          state={{
            category: props.category
          }}>
      <h3>{props.category}</h3>
    </Link>

    <div className="videofeed">
  {questions && questions.map((question) => {
  if (question.category === (props.category).toLowerCase()) {

return  <Link to={'/video/' + question.id}
              className="question-link"
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

export default Category;