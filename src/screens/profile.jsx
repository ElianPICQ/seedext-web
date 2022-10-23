import React, { useState, useEffect, useRef, } from "react"
import { Button, color, Flex, Image, Input, Text } from "@chakra-ui/react";
import Popup from "../components/Popup";
import Avatar from "../components/Avatar";
// To fetch the user data
import { getAuth, updateProfile } from "firebase/auth"
import { query, where, getDocs } from "firebase/firestore";

import { doc, updateDoc } from "firebase/firestore"
import { db } from "./../firebase/init_firebase"

import { usersCollectionRef } from "./../firebase/firebase_collections";
import { questionsCollectionRef } from "./../firebase/firebase_collections";
import { responsesCollectionRef } from "./../firebase/firebase_collections";

import { Link, useParams } from "react-router-dom"
import { auth, storage } from "../firebase/init_firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import updateUserRecords from "../firebase/updateUserRecords";
import deleteFile from "../firebase/deleteFile";
import uploadFile from "../firebase/uploadFile";
import { v4 as uuidv4 } from 'uuid';
import "./styles/profilecss.css";
import NavBar from "./../components/navbar"
import QuestionCard from "./../components/question_card"
import ResponseCard from "./../components/response_card"
import { width } from "@mui/system";

function  Profile() {
  const auth = getAuth();
  const user = auth.currentUser;
  const uid = user.uid;
  const {id} = useParams();
  const emailRef = useRef();
  const usernameRef = useRef();
  const [email, setEmail] = useState("");
  const [name, setName] = useState(user.displayName);
  const [username, setUsername] = useState(user.displayName);

{/* Additionnal data */}
  const [linkedin, setLinkedin] = useState("");
  const [phoneNum, setPhoneNum] = useState("");

  const [file, setFile] = useState(null);
  const [photo, setPhoto] = useState(user.photoURL);

  const [userPopup, setUserPopup] = useState(false);
  const [mailPopup, setMailPopup] = useState(false);

  const [alert, setAlert] = useState({ isAlert: false, severity: 'info', message: '', timeout: null, location: '',});
  
  const [photoURL, setPhotoURL] = useState(null);

  const [userQuestions, setUserQuestions] = useState([]);
  const [userResponses, setUserResponses] = useState([]);
  

// Fetch the data of the question from firebase
  useEffect(() => {

    const fetchUserData = async () => {
      

      if (user) {
        console.log(uid)
        const userDoc = query(usersCollectionRef, where("uid", "==", uid));
      
        const querySnapshot = await getDocs(userDoc);
        querySnapshot.forEach((doc) => {
          setEmail(doc.data().email);
          setName(doc.data().name);
          setUsername(doc.data().username);
        });
      }
    }

    fetchUserData();
  }, [])


// Get all the questions (we'll sort them at display, in the return)
// To get all OUR questions (the user's)
  useEffect(() => {
    const fetchUserQuestions = async () => {
      const data = await getDocs(questionsCollectionRef);

      // Parse data to only keep what we want (key: values)
      setUserQuestions(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    }

    fetchUserQuestions();
  }, [])


// Get all the responses (we'll sort them at display, in the retunr)
// To get all OUR responses (the user's)
  useEffect(() => {
    const fetchUserResponses = async () => {
      const data = await getDocs(responsesCollectionRef);

      // Parse data to only keep what we want (key: values)
      setUserResponses(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    }

    fetchUserResponses();
  }, [])


  // Functions to update the username and the mail address
  // function changeUserName () {
  //   auth.currentUser.updateProfile({
  //     displayName: auth.currentUser.displayName,
  //   }).then(() => {
  //     // Update successful
  //     // ...
  //   }).catch((error) => {
  //     // An error occurred
  //     // ...
  //   });
  // }

  // function changeEmail () {
  //   auth.currentUser.updateProfile({
  //     email: auth.currentUser.email,
  //   }).then(() => {
  //     // Update successful
  //     // ...
  //   }).catch((error) => {
  //     // An error occurred
  //     // ...
  //   });
  // }

{/* Update phone number & linkedin */}
  const submitExtraUserData = async (e) => {
      e.preventDefault();

      console.log("nice")
      const userRef = doc(db, "users", uid);
      await updateDoc(userRef, {linkedin: linkedin, phoneNum})
  }

  
  const handleChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFile(file);
      setPhotoURL(URL.createObjectURL(file));
    }
  };

  function handleClick() {
      const imageRef = ref(storage, `images/${photoURL.name}`);
      uploadBytes(imageRef, photoURL)
      .then(() => {
        getDownloadURL(imageRef)
        .then((photoURL) => {
          setPhotoURL(photoURL);
        })
        .catch ((error) => {
          console.log(error, "erreur en essayant de récupérer l'url de l'image");
        });
        setPhoto(null);
      })
      .catch((error) => {
        console.log(error, "erreur en essayant d'uploader l'image");
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let userObj = { displayName: name };
    let imagesObj = { uName: name };
    try {
      if (file) {
        const imageName = uuidv4() + '.' + file?.name?.split('.')?.pop();
        const url = await uploadFile(
          file,
          `profile/${user?.uid}/${imageName}`
        );

        if (user?.photoURL) {
          const prevImage = user?.photoURL
            ?.split(`${user?.uid}%2F`)[1]
            .split('?')[0];
          if (prevImage) {
            try {
              await deleteFile(`profile/${user?.uid}/${prevImage}`);
            } catch (error) {
              console.log(error);
            }
          }
        }

        userObj = { ...userObj, photoURL: url };
        imagesObj = { ...imagesObj, uPhoto: url };
      }

      await updateProfile(user, userObj);
      await updateUserRecords('gallery', user?.uid, imagesObj);

      setAlert({
        isAlert: true,
        severity: 'success',
        message: 'Your profile has been updated',
        timeout: 3000,
        location: 'modal',
      });
    } catch (error) {
      setAlert({
        isAlert: true,
        severity: 'error',
        message: error.message,
        timeout: 5000,
        location: 'modal',
      });
      console.log(error);
    }

  };


  // useEffect(() => {
  //   if (user?.photoURL) {
  //     user.updateProfile({
  //       setPhotoURL: photoURL,
  //     }).then(() => {
  //       // Update successful
  //       // ...
  //     }
  //     ).catch((error) => {
  //       // An error occurred
  //       // ...
  //     }
  //     );
  //   }
  // }, [user])



  return(
    <Flex className="profile__container">

        <NavBar />

      <Flex className="profile__info" >

        <h1>Mon Compte</h1>

        {/* <label for="profilepic">Changer de photo de profil</label> */}
        <Avatar className="avatar" alt="Avatar" src={photoURL}/>
               <input type={"file"} onChange={handleChange} id="profilepic"/>
               
                <button className="profile__info_button" onClick={handleSubmit}>
                  Modifier ma photo de profil</button>


{/* BUTON TO THE MATCH */}
          <Flex style={{alignItems: "center", justifyContent: "center", marginTop: "40px" }} className="match">
            <Link to={"/match"}>
            <button  style={{backgroundColor: "red", color: "white", border: "1px transparent", width: "250px", height: "50px", borderRadius: "20px"}}>Découvrir votre match</button>
            </Link>
          </Flex>

          <Flex className="profile__change">
            <Text className="profile__headText">
              Nom</Text>
            <Flex className="profile__input">
              <Text style={{ marginRight: "-30%"}} className="profile__text">{auth.currentUser.displayName}</Text>
              {/* <Button className="profile__button" onClick={() => setUserPopup(true)}>Modifier</Button> */}
            </Flex>

            <Text className="profile__headTextMail"> 
            Adresse Mail</Text>
            <Flex className="profile__inputMail">
              <Text className="profile__textMail">{auth.currentUser.email}</Text>
              {/* <Button className="profile__buttonMail" onClick={() => setMailPopup(true)} style={{ padding: "10px", marginLeft: "25px", marginTop: "-10px"}}>Modifier</Button> */}
            </Flex>


{/* Let user add some extra data */}
            <form onSubmit={submitExtraUserData} id="profile-form">
              <h3>Ajouter des informations</h3>
              <h4>LinkedIn</h4>
              <input
                  type="url"
                  className="extraDataInput"
                  value={linkedin}
                  onChange={(e) => setLinkedin(e.target.value)}
                  placeholder="LinkedIn link"
              />

              <h4>Téléphone</h4>
              <input
                  type="tel"
                  className="extraDataInput"
                  value={phoneNum}
                  onChange={(e) => setPhoneNum(e.target.value)}
                  placeholder="Phone"
              />

              <button type="submit">Confirmer</button>
            </form>
          </Flex>
          
          {/* Here is where you can configure the Pop-Up blocks to show what you want in the Pop-Up  */}
          <Popup trigger={userPopup} setTrigger={setUserPopup} className="userPopup">
            <h1 className="userChangeHeader" style={{fontWeight: "bold", fontSize: "30px",}}>Changer de nom d'utilisateur</h1>
            <h2 className="userTypeHeader" style={{fontSize: "16px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "35px"}}
                >Saisissez un nouveau nom d'utilisateur</h2>
            <text>Nom d'utilisateur</text>
            <input
              type="text"
              className="userProfile__textBox"
              id="Username"
              value={auth.currentUser.displayName}
              //onChange={(event) => changeUserName(event.target.value)}
              />
            <button className="Popup_button" onClick={"feur"}>Valider</button>
          </Popup>

          <Popup trigger={mailPopup} setTrigger={setMailPopup} className="mailPopup">
            <h1 className="userChangeHeader">Changer d'email</h1>
            <h2 className="userTypeHeader">Saisissez une nouvelle adresse mail</h2>
            <div style={{display: "flex", flexDirection: "column"}}>
              <text>Adresse Mail</text>
              <input
                type="email"
                ref={emailRef}
                className="userProfile__textBox"
                id="Email"
                value={auth.currentUser.email}
                //onChange={(event) => changeEmail(event.target.value)}
                />
            </div>
            <button className="Popup_button" onClick={"feur"}>Valider</button>
          </Popup>
      </Flex>


    {/* References to the questions asked and responses posted by the user */}
   <div id="user-references">

      <h3>Questions posées</h3>
      <div id="user-references__questions">
        {userQuestions && userQuestions.map((question) => {
        if (question.uid === uid) {
        return  <QuestionCard question={question} key={question.id}  />
          } 
        })}
              </div>

              <div id="user-references__answers">
              <h3>Réponses</h3>
        {userResponses && userResponses.map((response) => {
        if (response.user === uid) {
        return  <ResponseCard response={response} key={response.id}  />
          } 
        })}
      </div>
    </div>

    </Flex>
  );
}

export default Profile;