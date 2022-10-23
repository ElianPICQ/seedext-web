import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { useAuthState } from "react-firebase-hooks/auth";

import { sendPasswordReset } from "./../../firebase/auth";
import { auth } from "./../../firebase/init_firebase"
import { Box, TextField } from "@material-ui/core";

import logo from "./../../img/SeedextBanniereTurquoise.png";


import "./styles/reset.css";
import { Flex } from "@chakra-ui/react";


function Reset() {
  const [email, setEmail] = useState("");
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (user) navigate("/profile");
  }, [user, loading, navigate]);


  return (
    <div className="reset__container">
      <div className="reset__background"/>
        <div className="reset__form">
          <h1 className="headerTitle">Réinitialisez votre mot de passe</h1>
          <TextField
            variant="outlined"
            id="outlined-required"
            label="Adresse mail"
            margin="normal"
            type="text"
            className="reset__textBox"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="ex : JackieDupont@gmail.com"/>
          <button
            className="reset__btn"
            onClick={() => sendPasswordReset(email)}>
            Envoi du mail pour réinitialiser le mot de passe
          </button>
          <Flex className="returnLogin">
            <Link to="/">
              <AiOutlineArrowLeft style={{color: "black", fontSize: "30px", margin:"0px"}}/>
            </Link>
              <p style={{paddingLeft: "5px", paddingRight: "5px", fontWeight: "bold"}}>
                Retour a la connexion
              </p>
          </Flex>
        </div>
    </div>
  );
}

export default Reset;