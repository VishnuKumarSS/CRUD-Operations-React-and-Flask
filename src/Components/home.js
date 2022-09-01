import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import "../styling/home.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import GoogleSignOut from "./googleSignOut";
import GoogleSignIn from "./googleSignIn";

export default function Home() {
  const [userDataJSON, setUserDataJSON] = useState(null);
  const [ loggedIn, setLoggedIn ] = useState(false)

  const logoutUser = async () => {
    await axios.post("/logout");
    setUserDataJSON(null);
    setLoggedIn(false);
    console.log('User Logged Out.')
  };


  // useEffect(()=>{
  // (async() => {
  //   try{
  //     const responseData = await axios.get("/current_user")
  //     setUserDataJSON(responseData.data)
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
        res.data[1] 
        ?
        setUserDataJSON(res.data[1])
        :
        setUserDataJSON({'usertype': 'normal'}); // here setting all other users to "normal" usertype to avoid errors.

        console.log('home',res);
        setLoggedIn(true)
      })
      .catch((err) => {
        console.log("error:", err);
        setLoggedIn(false)
        // setResponseData(err.response.status)
        console.log("Currently no users logged in.");
      });
  }, []);

  return (
    <>
    <div className="home"> 
      <>
          {/* <GoogleSignIn />
          <GoogleSignOut /> */}
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
              backgroundColor: "#FFE0B2",
              border: "3px solid #FFCC80",
            }}
          >
            DASHBOARD
          </Button>
        </Link>
        </>
        }
        {(!loggedIn || (loggedIn && userDataJSON.usertype!=='normal')) &&
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
              backgroundColor: "#FFE0B2",
              border: "3px solid #FFCC80",
            }}
          >
            {loggedIn && (userDataJSON.usertype === 'admin' || userDataJSON.usertype === 'superuser' )?
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
              backgroundColor: "#FFE0B2",
              border: "3px solid #FFCC80",
            }}
          >
            LOGIN
          </Button>
        </Link>
        }
        {!loggedIn &&
        // <Link style={{ textDecoration: "none" }} to="/googlepage">
        //   <Button
        //     className="homeButton"
        //     style={{
        //       marginBottom: 10,
        //       display: "flex",
        //       flexDirection: "column",
        //       borderRadius: 16,
        //       color: "#000",
        //       backgroundColor: "#B2DFDB",
        //       border: "3px solid #4DB6AC",
        //     }}
        //   >
        //     Continue with GOOGLE?
        //   </Button>
        // </Link>
        <GoogleSignIn />
      

        }
        {loggedIn &&
          <div onClick={logoutUser} style={{marginTop: 20}}>
            {/* //   <Button
            //     className="btn-sm"
            //     onClick={logoutUser}
            //     style={{ color:"#fff",fontSize:16, backgroundColor: "#E57373", borderRadius: 10, marginTop:10 , border: "2px solid #E57373" }}
            //   >
            //     LOGOUT
            //   </Button > */}
            <GoogleSignOut />

            </div>
          }
      </nav>
      </>
    </div>
    </>
  );
}
