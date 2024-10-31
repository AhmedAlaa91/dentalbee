/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useRef, useEffect }from "react";
import Logo from "../Assets/Logo.png";
import { BsCamera, BsCart2 , BsMic} from "react-icons/bs";
import { HiOutlineBars3 } from "react-icons/hi2";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import HomeIcon from "@mui/icons-material/Home";
import InfoIcon from "@mui/icons-material/Info";
import CommentRoundedIcon from "@mui/icons-material/CommentRounded";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import ShoppingCartRoundedIcon from "@mui/icons-material/ShoppingCartRounded";
import { Link, BrowserRouter as Router } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
const Navbar = () => {
  const location = useLocation(); // Get location object to access state
  const userNameData = location.state?.userLogged || null;
  const [loggedUser, setLoggedUser] = useState(userNameData ? null : null);
    const [openMenu, setOpenMenu] = useState(false);
    const menuOptions = [
      {
        text: "Home",
        icon: <HomeIcon />,
      },
      {
        text: "About",
        icon: <InfoIcon />,
      },
      {
        text: "Testimonials",
        icon: <CommentRoundedIcon />,
      },
      {
        text: "Contact",
        icon: <PhoneRoundedIcon />,
      },
      {
        text: "Cart",
        icon: <ShoppingCartRoundedIcon />,
      },
    ];

    useEffect(() => {
      if (userNameData) {
        setLoggedUser(userNameData);
      }
  }, [userNameData]);

    return (
      <nav>
        <div className="nav-logo-container">
          <img src={Logo} alt="" />
        </div>
        <div className="navbar-links-container">
          <Link to="/">Home</Link>
          <Link to="/notes">My Notes</Link>
          <Link to="/mic">
            <BsMic className="navbar-camera-icon" />
            </Link>
            {loggedUser?<button className="primary-button"> {loggedUser}</button>:<Link to="/loginsignup/Login" style={{ textDecoration: 'none' }}> <button className="primary-button"> Login </button></Link> }
          
        </div>
        <div className="navbar-menu-container">
          <HiOutlineBars3 onClick={() => setOpenMenu(true)} />
        </div>
        <Drawer open={openMenu} onClose={() => setOpenMenu(false)} anchor="right">
          <Box
            sx={{ width: 250 }}
            role="presentation"
            onClick={() => setOpenMenu(false)}
            onKeyDown={() => setOpenMenu(false)}
          >
            <List>
              {menuOptions.map((item) => (
                <ListItem key={item.text} disablePadding>
                  <ListItemButton>
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.text} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
            <Divider />
          </Box>
        </Drawer>
      </nav>
    );
  };
  
  export default Navbar;