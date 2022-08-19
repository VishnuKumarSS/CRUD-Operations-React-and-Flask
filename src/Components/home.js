import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import "../styling/home.css";
import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Home() {
  const [userJSON, setUserJSON] = useState(null);
  const [ loggedIn, setLoggedIn ] = useState(false)

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
        setLoggedIn(false)
        // setResponseData(err.response.status)
        console.log("Currently no users logged in.");
      });
  },[]);

  return (
    <>
    {/* {loggedIn &&
      <div style={{width:"100vw"}}>
        <NavBar />
      </div>
      } */}
    <div className="home"> 
      <>
      <h1 style={{marginBottom: 20}}>HOME PAGE</h1>
      <nav>
        {loggedIn &&
        <>
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
            DASHBOARD
          </Button>
        </Link>
        </>
        }
        {(!loggedIn || loggedIn) &&
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
            {loggedIn && userJSON.usertype === 'admin'?
            "ADD USER"
            :
            "REGISTER"
          }
          </Button>
        </Link>
        </>
        }
        {!loggedIn &&
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
        }
        {loggedIn &&
          <div >
            {/* <button onClick={(e)=>{
                                return(
                                  e.preventDefault(),
                                  navigate("/")
                                )}} 
                  style={{fontSize:16, backgroundColor: "#90CAF9", borderRadius: 10, marginTop:10 , border: "2px solid #fff"}} 
                >Return Home
                </button>   */}
          <Button
            className="btn-sm"
            onClick={logoutUser}
            style={{ color:"#fff",fontSize:16, backgroundColor: "#E57373", borderRadius: 10, marginTop:10 , border: "2px solid #E57373" }}
          >
            LOGOUT
          </Button >
        </div>
          }
      </nav>
      </>
    </div>
    </>
  );
}
