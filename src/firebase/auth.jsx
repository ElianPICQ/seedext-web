import { GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword,
         createUserWithEmailAndPassword, sendPasswordResetEmail, signOut } from "firebase/auth";
import { query, getDocs, collection, where, addDoc, doc, setDoc } from "firebase/firestore";
import { Link, Navigate } from "react-router-dom";

import { usersCollectionRef } from "./firebase_collections"

import { auth, db } from "./init_firebase"

/*  All necessary methods to:
*   - Register
*   - Login
*   - Register & Login with Google
*   - Reset Password
*   - Logout
*/



const registerWithEmailAndPassword = async (name, username, email, password, cPassword) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password, cPassword);
    const user = res.user;
    const uid = user.uid;
    console.log("UID === ", user.uid)
    await setDoc(doc(db, "users", uid), {
      uid: user.uid,
      username,
      name,
      authProvider: "local",
      email,
      coins: 50,
    });
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};


const logInWithEmailAndPassword = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};



const googleProvider = new GoogleAuthProvider();

const signInWithGoogle = async () => {
  try {
    const res = await signInWithPopup(auth, googleProvider);
    const user = res.user;
    const q = query(usersCollectionRef, where("uid", "==", user.uid));
    const docs = await getDocs(q);
    if (docs.docs.length === 0) {
      await addDoc(usersCollectionRef, {
        uid: user.uid,
        name: user.displayName,
        username: user.displayName,
        authProvider: "google",
        email: user.email,
        coins: 50,
      });
    }
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};



const sendPasswordReset = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    alert("Password reset link sent!");
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};



const logout = () => {
  signOut(auth);
};

export { signInWithGoogle, logInWithEmailAndPassword, registerWithEmailAndPassword, sendPasswordReset, logout,};