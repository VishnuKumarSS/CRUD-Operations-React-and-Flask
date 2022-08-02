import React, { useState , useEffect } from "react";
import {Form, Button} from 'react-bootstrap';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styling/createAndUpdateUser.css" // here we have used the same styling in both create and update form page

function UpdateUser() {

  let navigate = useNavigate();
  
  const [username, setUsername] = useState("");
  const [userage, setUserage] = useState(null);
  const [usercity, setUsercity] = useState("");

  const [updateUserNameURL, setUpdateUserNameURL ] = useState("");
  const sendDataToAPI = (eventt) => {
    eventt.preventDefault()// to remove the warning error while submitting the form , and the error is "Form submission cancelled because the form is not connected"

    axios.put(`/${updateUserNameURL}`, {
      username,
      userage,
      usercity,
      }).catch(
          (error) => {
            if (error.response) {
              console.log('error response')
            }
            else if (error.request) {
              console.log('error request')
            }
            else {
              console.log('else part error')
            }
            console.log('config error: ',error.config)
          }
        );

      navigate(`/`);  // this will navigate to the homepage of the application when the form is submitted.
      // navigate(-1);
      console.log("Typed NAME : ", username);
      console.log("Typed AGE : ", userage);
      console.log("Typed CITY : ", usercity);


  };

  useEffect(()=> {
    setUpdateUserNameURL(localStorage.getItem('LocalStorageUserName')) // this is gonna be that particular username that we have selected to update. And this will be in the url endpoint in the backend
    setUsername(localStorage.getItem('LocalStorageUserName')); // here we are getting that LocalStorageUserName that we set while setting the username in the getUser.js
    setUserage(localStorage.getItem('LocalStorageUserAge'));
    setUsercity(localStorage.getItem('LocalStorageUserCity'));
  }, [])

  return (
    <div className='createUser'>
      <h1 style={{textAlign: 'center', marginBottom: '20px'}}> Update User Details</h1>
      <Form>
        <Form.Group className="mb-3" controlId="formBasicUsername">
          <Form.Label style={{ marginLeft:10 }}>UserName</Form.Label>
          <Form.Control name="username" value={username || ""} onChange={(e)=> setUsername(e.target.value)} placeholder="Enter your name here" style={{borderRadius: 16 }} />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicUserage">
          <Form.Label style={{ marginLeft:10 }}>Age</Form.Label>
          <Form.Control type="number" value={userage || ""} name="userage" onChange={(e)=> setUserage(e.target.value)}  placeholder="Enter your age here" style={{borderRadius: 16 }} />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicUsername">
          <Form.Label style={{ marginLeft:10 }}>City</Form.Label>
          <Form.Control name="usercity" value={usercity || ""} onChange={(e)=> setUsercity(e.target.value)}  placeholder="Enter your city here" style={{borderRadius: 16 }} />
        </Form.Group>

        
        { username && userage && usercity
        ? 
        <Button variant="primary" type="submit" onClick={sendDataToAPI} style={{color: "black", border: "2px solid #fff",backgroundColor: "#90CAF9", marginLeft: 180 , marginTop: 16, borderRadius:16}}>
          Submit
        </Button> 
        : 
        <Button style={{color: "black", border: "2px solid #fff", marginLeft: 180 ,backgroundColor: "#F5F5F5", marginTop: 16, borderRadius:16}}>
          Submit
        </Button>
        }

      </Form>

    </div>
  );
}

export default UpdateUser;
