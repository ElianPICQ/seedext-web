import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuthState } from "react-firebase-hooks/auth";

import GoogleButton from 'react-google-button'

import { registerWithEmailAndPassword, signInWithGoogle } from "./../../firebase/auth";
import { auth } from "./../../firebase/init_firebase"


import "./styles/register.css";
import { Box, TextField, makeStyles } from "@material-ui/core";



function Register() {
  // Data needed to register

//  const [selectedImage, setSelectedImage] = useState(null);
//  const [photoURL, setPhotoUrl] = useState(null);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  // Confirm password
  const [cPassword, setCPassword] = useState('');
  const [cPasswordClass, setCPasswordClass] = useState('form-control');
  const [isCPasswordDirty, setIsCPasswordDirty] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);


  const [user] = useAuthState(auth);
  const navigate = useNavigate();

// Call this when all fieds are filled
  const register = () => {
    if (!name) alert("Please enter name");
    registerWithEmailAndPassword(name, username, email, password, cPassword);
  };

/*
  useEffect(() => {
    if (selectedImage) {
      setPhotoUrl(URL.createObjectURL(selectedImage));
    }
  }, [selectedImage]);
*/

// Check if password & confirmPassord match
// Show error message in real time if the dont
  useEffect(() => {
    if (isCPasswordDirty) {
        if (password === cPassword) {
            setShowErrorMessage(false);
            setCPasswordClass('form-control is-valid')
        } else {
            setShowErrorMessage(true)
            setCPasswordClass('form-control is-invalid')
        }
    }
}, [cPassword, isCPasswordDirty, password])

const handleCPassword = (e) => {
    setCPassword(e.target.value);
    setIsCPasswordDirty(true);
}


// Redirect when authentificated
  useEffect(() => {
    if (user) navigate("/profile");
  }, [navigate, user]);


  return (
      <div className="register__container">
        <div className="register__background"/>
        <div className="register__form form-submit">
          <div className="formContent">
          <h1 className="headerTitle">Créer son compte</h1>
            <div className="nameInputs">
            <TextField
              variant="outlined"
              label="Nom Complet"
              type="text"
              className="register__textBox2"
              margin="normal"
              id="Name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="ex : Jackie Dupont"/>
            <p style={{margin: "5", border: "1px transparent", width: "28px"}}>   </p>
            <TextField
              variant="outlined"
              margin="normal"
              label="Nom d'utilisateur"
              type="text"
              className="register__textBox2"
              id="Username"
              style={{color: "black"}}
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="ex : Jack78595"/>
            </div>
            <TextField
              variant="outlined"
              margin="normal"
              id="outlined-required"
              label="Adresse mail"
              type="text"
              className="register__textBox"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="ex : JackieDupont@gmail.com"/>

            <TextField
              variant="outlined"
              margin="normal"
              label="Mot de passe"
              type="password"
              className="register__textBox"
              id="Password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="minimum: 6 caractères"/>

            <TextField
              variant="outlined"
              margin="normal"
              label="Confirmer le mot de passe"
              type="password"
              className={cPasswordClass}
              id="confirmPassword"
              value={cPassword}
              onChange={handleCPassword}
              placeholder="Confirmez le mot de passe" /> 
            {showErrorMessage && isCPasswordDirty ? <div style={{color: 'red'}}> Les mots de passes ne sont pas identiques </div> : ''}
          </div>
          <button className="register__btn" onClick={register}>
            S'inscrire
          </button>

          <div style={{color: "black", display: "flex", flexDirection: "row", padding:"2px"}} className="accountInput">
            Vous avez déjà un compte ? <Link to="/"> <p style={{paddingLeft: "5px", paddingRight: "5px", fontWeight: "bold", color: "#434DE7"}}>Connectez-vous</p> </Link>  
          </div>

          <GoogleButton
            style={{height: "fit-content", width: "fit-content", marginTop: "20px"}}
            label="S'inscrire avec Google"
            className="register__btn register__google"
            onClick={signInWithGoogle}>
            S'inscrire avec Google
          </GoogleButton>
        </div>
      </div>
  );
}
export default Register;