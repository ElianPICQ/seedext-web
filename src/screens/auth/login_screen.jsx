import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import GoogleButton from 'react-google-button'
import { useAuthState } from "react-firebase-hooks/auth";


import { getAuth, onAuthStateChanged } from "firebase/auth";

import Loading from "./../../components/loading";
import { logInWithEmailAndPassword, signInWithGoogle } from "./../../firebase/auth";
import { auth } from "./../../firebase/init_firebase"


import "./styles/login.css";
import { TextField } from "@material-ui/core";



function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();
/*
  const auth = getAuth();
  const user = auth.currentUser;
*/

  useEffect(() => {
    if (loading) {
      <Loading />
      return;
    }
    if (user) navigate("/profile");
  }, [user, loading, navigate]);

/*  La redirection lors de la deconnection ne marche pas
*   Avec ceci, dessous, la redirection fonctionne.
*   Cependant, en local, pour retourner sur l'appli sans avoir été déconnecté
*   la fonction signOut(), il faut actualiser un champs de login pour etre
*   redirigé vers le feed.
*/

/*
  useEffect(() => {
    console.log("USER === ", user);
    if (user) {
      // User is signed in
       navigate("/feed");
    }
  })
*/

  return (
    <div className="body">
      <div className="login">
        <div className="login__container">
          <div className="login__background"/>
          <div className="login__form">
            <h1 className="headerTitle">Connexion</h1>
            <TextField
              variant="outlined"
              label="Adresse mail"
              type="text"
              margin="normal"
              className="login__textBox"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Si le format est bon ca se passera bien"
              placeholderTextColor="#71D7D7"
            />

            <TextField
              variant="outlined"
              label="Mot de passe"
              type="password"
              margin="normal"
              className="login__textBox"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Trou de Mémoire ? Cliquez sur 'Mot de passe oublié ?'"
            />

            <div className="forgotPassword" style={{marginLeft: "62%", marginBottom: "10px", color: "#434DE7", fontWeight: "bold"}}>
              <Link to="/reset" >Mot de passe oublié ?</Link>
            </div>

            <button
              className="login__btn"
              onClick={() => logInWithEmailAndPassword(email, password)}
            >
              Connexion
            </button>

            <div style={{flexDirection: "row", color:"black", display: "flex", padding:"2px", margin:"10px"}} className="accountInput">
              Vous n'avez pas de compte ? <Link to="/register"> <p style={{paddingLeft: "5px", paddingRight: "5px", fontWeight: "bold", color: "#434DE7"}}>Inscrivez-vous</p> </Link>
            </div>

            <GoogleButton
              style={{height: "fit-content", width: "fit-content", minWidth: "325px"}}
              label="Se connecter avec Google"
              className="login__btn login__google" onClick={signInWithGoogle}>
              Se connecter avec Google
            </GoogleButton>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;