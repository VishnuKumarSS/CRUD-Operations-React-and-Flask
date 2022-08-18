import GetUser from "./Components/getUser";
import CreateUser from "./Components/createUser";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Navbar, Nav, Button } from "react-bootstrap";
import Home from "./Components/home";
import UpdateUser from "./Components/updateUser";
import Login from "./Components/login";
import NotFound from "./Components/notFound";
import axios from 'axios';
// import { useState } from 'react';

function App() {
  // const [ loggedOut, setLoggedOut ] = useState(false)
  const logoutUser = async () => {
    try{
      await axios.post("/logout");
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
    <>
      {/* <Navbar bg="dark" variant="dark"> */}

      <Router>
        <Navbar variant="light" style={{ backgroundColor: "#ffdc7c" }} >
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
            <Nav className="" style={{marginLeft: "60%"}}>
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
                  Register
                </Button>
              </Link>
              <Link style={{ textDecoration: "none" }} to="/login">
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
                
              </Link>
              {/* {!loggedOut && */}
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
                {/* } */}
              {/* <Nav.Link href="/">Home</Nav.Link>
              <Nav.Link href="/adduser">Register</Nav.Link>
              <Nav.Link href="/login">Login</Nav.Link> */}
            </Nav>
          {/* </Container> */}
        </Navbar>
        <div className="mainClass">
          <div>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/adduser" element={<CreateUser />} />
              <Route path="/allusers" element={<GetUser />} />
              <Route path="/update" element={<UpdateUser />} />
              <Route path="/login" element={<Login />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </div>
      </Router>
    </>
  );
}

export default App;
