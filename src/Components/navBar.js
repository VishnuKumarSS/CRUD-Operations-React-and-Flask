import React from 'react'
import { Navbar, Nav, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";
import GoogleSignOut from './googleSignOut';


function NavBar() {
  const [ loggedOut, setLoggedOut ] = useState(false);
  const [ loggedIn, setLoggedIn ] = useState(false);
  const [userJSON, setUserJSON] = useState(null);

  const [ addUserData, setAddUserData ] = useState(false);

  let navigate = useNavigate();

  useEffect(() => {
    axios.get("/current_user")
      .then((res) => {
        // res.data[1]
        if (res.data[1]){
          setUserJSON(res.data[1])
          setAddUserData(false)
          }
          else{
          setUserJSON({'usertype': 'normal'})
          setAddUserData(true);
        }

        
        setLoggedIn(true)
      })
      .catch((err) => {
        console.log("error:", err);
        setLoggedIn(false)
        setAddUserData(false)
        console.log("Currently no users logged in.");
      });
  },[]);

  const logoutUser = async () => {
    // const logoutUser = () => {
    try{
      await axios.post("/logout");
      // axios.post("/logout");
      setLoggedOut(true)
      console.log('Logged Out.')
      navigate("/")
        }
        catch(error){
      console.log(error)
      if (error.response.status) {
        alert(error.response.data.message);
      }
    };
    // setLoggedOut(true)
  };
  return (
    <div style={{ marginTop: -50 }}>
      {/* <Navbar bg="dark" variant="dark"> */}
      <Navbar variant="light" style={{ backgroundColor: "#E1E2EE" }}>
        {/* <Container > */}
        {/* <Navbar.Brand style={{ marginLeft: -90 }} href="#home">
              ADMIN PANEL
            </Navbar.Brand> */}
        <Link style={{ textDecoration: "none" }} to="/">
          <Button
            className="homeButton"
            style={{
              marginBottom: 10,
              display: "flex",
              flexDirection: "column",
              borderRadius: 16,
              color: "#000",
              backgroundColor: "#c6c9e6",
              border: "3px solid #c6c9e6",
              width: "auto",
              margin: 5,
              marginRight: 30,
              marginLeft: 30,
            }}
          >
            <span>ADMIN PANEL</span>
          </Button>
        </Link>

        {/* <Nav className="me-auto"> */}
        <Nav className="" style={{ marginLeft: "auto", marginRight: 20 }}>
          {/* <Link style={{ textDecoration: "none" }} to="/">
                <Button
                  className="homeButton"
                  style={{
                    marginBottom: 10,
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: 16,
                    color: "#000",
                    // backgroundColor: "#ffdc7c",
                    backgroundColor: "#C6C9E6",
                    border: "3px solid #C6C9E6",
                    width: "auto",
                    margin: 5
                  }}
                >
                  HOME
                </Button>
              </Link> */}
          {loggedIn &&
            ( userJSON.usertype === 'admin' || userJSON.usertype === 'superuser') &&
              <Link style={{ textDecoration: "none" }} to="/adduser">
                <Button
                  className="homeButton"
                  style={{
                    marginBottom: 10,
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: 16,
                    color: "#000",
                    backgroundColor: "#C6C9E6",
                    border: "3px solid #C6C9E6",
                    width: "auto",
                    margin: 5
                  }}
                >
                  ADD_USER
                </Button>
              </Link>
            }
          {
                addUserData 
                &&
            <Link style={{ textDecoration: "none" }} to="/adduserdata">
              <Button
                className="homeButton"
                style={{
                  marginBottom: 10,
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: 16,
                  color: "#000",
                  backgroundColor: "#C6C9E6",
                  border: "3px solid #C6C9E6",
                  width: "auto",
                  margin: 5,
                }}
              >
                ADD_INFO
              </Button>
            </Link>
          
              }

          {!loggedOut && loggedIn &&
            <div className='homeButton' onClick={logoutUser} style={{marginBottom: 10, margin: 5}}>
              <GoogleSignOut />
            </div>
          }
          {/* <Button
                  onClick={logoutUser}
                  style={{
                    marginBottom: 10,
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: 16,
                    color: "#000",
                    backgroundColor: "#E57373",
                    border: "3px solid #EF5350",
                    width: "auto",
                    margin: 5
                  }}
                >
                  LOGOUT
                </Button> */}

          {/* <Nav.Link href="/">Home</Nav.Link>
              <Nav.Link href="/adduser">Register</Nav.Link>
              <Nav.Link href="/login">Login</Nav.Link> */}
        </Nav>
        {/* </Container> */}
      </Navbar>
    </div>
  );
}

export default NavBar;
