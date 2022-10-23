import React, { useEffect } from 'react'
import { logout } from "./../firebase/auth"
import { FaCoins } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import { Flex, Image, useColorMode, useColorModeValue, Input, InputGroup, InputLeftElement, Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react';
import { IoMoon, IoSunny, IoSearch, IoAdd, IoLogOut } from "react-icons/io5"

import logo from "../img/SeedextBanniereTurquoise.png";
import logo_dark from "../img/SeedextBanniereBlanche.png";


import "./styles/navbar.css"
import { auth } from '../firebase/init_firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

const NavBar = () => {
  const [user, loading] = useAuthState(auth);
  const { colorMode, toggleColorMode } = useColorMode();
  const bg = useColorModeValue("gray.600", "gray.300");

  const navigate = useNavigate();


  const logoutFunction = () => {
    logout();
  }

  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/");
  }, [user, loading]);


  return (
    <div id="navbar">
      <div id="navbar-content">
        <Link to="/feed">
          <img src={logo} alt="logo" id="navbar-logo" />
        </Link>

{/* Possibility to add "contact", "about"... links here */}


        <div id="top-right-options">

          <FaCoins style={{marginTop: "30px", marginRight: "40px", width: "40px", height: "25px"}}></FaCoins>
          <p style={{marginTop: "30px", marginLeft: "-35px", marginRight: "20px"}}>50</p>
{/* Toogle dark mode button */}
          <div  id="toggle-dark-mode"
              onClick={toggleColorMode}>
            {colorMode === "light" ? ( <IoMoon fontSize={25}/> ) : ( <IoSunny fontSize={25} /> )}
          </div>

{/* Dropdown menu */}
          <Menu>
{/* Icon/button of the menu */}
            <MenuButton>
              <Image src={auth.currentUser?.photoURL} width="40px" height="40px" rounded="full" marginTop={"20px"}/>
            </MenuButton>

{/* Dropdown content */}
            <MenuList>

      {/* Link to Profile */}
              <Link to={"/profile"}>
                <MenuItem>Mon compte</MenuItem>
              </Link>

      {/* Logout */}
              <MenuItem onClick={logoutFunction} flexDirection={"row"} alignItems="center" gap={4}>
                Se déconnecter <IoLogOut fontSize={20}/>
              </MenuItem>
            </MenuList>
          </Menu>
        </div>
      </div>
    </div>



  );
}

export default NavBar