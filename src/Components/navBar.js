import React from 'react'
import { Navbar, Nav, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";

function NavBar() {
  const [ loggedOut, setLoggedOut ] = useState(false);
  const [ loggedIn, setLoggedIn ] = useState(false);
  const [userJSON, setUserJSON] = useState(null);

    useEffect(() => {
      axios.get("/current_user")
      .then((res) => {
        setUserJSON(res.data);
        setLoggedIn(true)        
      })
      .catch((err) => {
        console.log("error:", err);
        setLoggedIn(false)
        console.log("Currently no users logged in.");
      });
    },[]);
    const logoutUser = async () => {
        try{
          await axios.post("/logout");
          setLoggedOut(true)
          // navigate("/")
          // window.location.href("/")
        //   setIsNavbar(false);
          // <Home isNavbar={isNavbar}/>
        }
        catch(error){
          console.log(error)
          if (error.response.status === 409) {
            alert(error.response.data.message);
        }
      };
        // setLoggedOut(true)
      };
  return (
    <div style={{marginTop:-50}}>
        {/* <Navbar bg="dark" variant="dark"> */}
        <Navbar variant="light" style={{ backgroundColor: "#ffdc7c" }}  >
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
                    backgroundColor: "#fff",
                    border: "3px solid #fff",
                    width: "auto",
                    margin: 5,
                    marginRight: 30,
                    marginLeft: 30
                  }}
                >
                  ADMIN PANEL
                </Button>
              </Link>
            
            {/* <Nav className="me-auto"> */}
            <Nav className="" style={{marginLeft: "auto", marginRight:20}}>
              <Link style={{ textDecoration: "none" }} to="/">
                <Button
                  className="homeButton"
                  style={{
                    marginBottom: 10,
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: 16,
                    color: "#000",
                    // backgroundColor: "#ffdc7c",
                    backgroundColor: "#ffc420",
                    border: "3px solid #ffc420",
                    width: "auto",
                    margin: 5
                  }}
                >
                  Home
                </Button>
              </Link>
              {loggedIn &&
              userJSON.usertype === 'admin' &&
              <Link style={{ textDecoration: "none" }} to="/adduser">
                <Button
                  className="homeButton"
                  style={{
                    marginBottom: 10,
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: 16,
                    color: "#000",
                    backgroundColor: "#ffc420",
                    border: "3px solid #ffc420",
                    width: "auto",
                    margin: 5
                  }}
                >
                  Add User
                </Button>
              </Link>
              }
              {/* <Link style={{ textDecoration: "none" }} to="/login">
                <Button
                  className="homeButton"
                  style={{
                    marginBottom: 10,
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: 16,
                    color: "#000",
                    backgroundColor: "#ffc420",
                    border: "3px solid #ffc420",
                    width: "auto",
                    margin: 5
                  }}
                >
                  Login
                </Button>
                
              </Link> */}
              {/* {!loggedOut && */}
              {!loggedOut && loggedIn &&
              <Link style={{ textDecoration: "none" }} to="/">
              <Button
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
                </Button>
                </Link>
              }
              {/* <Nav.Link href="/">Home</Nav.Link>
              <Nav.Link href="/adduser">Register</Nav.Link>
              <Nav.Link href="/login">Login</Nav.Link> */}
            </Nav>
          {/* </Container> */}
        </Navbar>
    </div>
  )
}






export default NavBar