import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import "../styling/home.css";
import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Home() {
  const [userJSON, setUserJSON] = useState(null);
  const [ loggedIn, setLoggedIn ] = useState(false)
  // const [responseData, setResponseData ] = useState(null);
  const logoutUser = async () => {
    await axios.post("/logout");
    setUserJSON(null);
    // setResponseData(null)
    setLoggedIn(false)
    // navigate("/")
  };
  // useEffect(()=>{
  // (async() => {
  //   try{
  //     const responseData = await axios.get("/current_user")
  //     setUserJSON(responseData.data)
  //     console.log(responseData)
  //   }
  //   catch(error){
  //     console.log('Currently no users logged in...')
  //     console.log(error)
  //   }
  // }
  // )() // lambda function
  // },[])

  // or
  useEffect(() => {
    axios
      .get("/current_user")
      .then((res) => {
        setUserJSON(res.data);
        // setResponseData(res)
        console.log(res);
        setLoggedIn(true)
      })
      .catch((err) => {
        console.log("error:", err);
        // setResponseData(err.response.status)
        console.log("Currently no users logged in.");
      });
  }, []);

  return (
    <div className="home">
      
      {/* {userJSON ? (
        <div >
          <h4>Logged In User is - {userJSON.usertype}</h4>
          <h5>
            Username: {userJSON.username}
            <br />
            UUID : {userJSON.uuid}
          </h5>
          <Button
            className="btn-sm"
            onClick={logoutUser}
            style={{ marginBottom: 20 }}
          >
            LOGOUT
          </Button >
        </div>
      ) : (
        <h4>Currently, No Users LoggedIn.</h4>
      )} */}

      <h1 style={{marginBottom: 20}}>HOME PAGE</h1>
      <nav>
        {loggedIn &&
        <Link style={{ textDecoration: "none" }} to="/allusers">
          <Button
            className="homeButton"
            style={{
              marginBottom: 10,
              display: "flex",
              flexDirection: "column",
              borderRadius: 16,
              marginTop: 30,
              color: "#000",
              backgroundColor: "#ffdc7c",
              border: "3px solid #ffc420",
            }}
          >
            ALL USERS
          </Button>
        </Link>
        }
        {!loggedIn &&
        <>
        <Link style={{ textDecoration: "none" }} to="/adduser">
          <Button
            className="homeButton"
            style={{
              marginBottom: 10,
              display: "flex",
              flexDirection: "column",
              borderRadius: 16,
              color: "#000",
              backgroundColor: "#ffdc7c",
              border: "3px solid #ffc420",
            }}
          >
            REGISTER
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
              backgroundColor: "#ffdc7c",
              border: "3px solid #ffc420",
            }}
          >
            LOGIN
          </Button>
        </Link>
        </>
        }
      </nav>
    </div>
  );
}
