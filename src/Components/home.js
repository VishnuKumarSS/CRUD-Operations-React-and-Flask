import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import "../styling/home.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [userJSON, setUserJSON] = useState(null);
  let navigate = useNavigate();

  const logoutUser = async () => {
      await axios.post("/logout")
      setUserJSON(null)
      // navigate("/")
  }
  useEffect(()=>{
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

    // or
    axios.get("/current_user")
    .then((res)=> {
      setUserJSON(res.data)
      console.log(res)
    }
    ).catch(err => {
      console.log(err)
      console.log('Currently no users logged in.')
    })

  },[])

  return (
    <div className="home">
      { userJSON &&
      <>
      <h4>
        Logged In  
      </h4>
      <h5>
        Username: {userJSON.username}
        <br/>
        UUID : {userJSON.uuid}
      </h5>
      <Button className="btn-sm" onClick={logoutUser} style={{marginBottom:"20"}}>LOGOUT</Button>
      </>
      }
      <h1>HOME PAGE</h1>
      <nav>
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
            CREATE USER
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
      </nav>
    </div>
  );
}
