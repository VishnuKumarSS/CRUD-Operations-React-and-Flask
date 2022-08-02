import React, { useState } from "react";
import {Form, Button} from 'react-bootstrap';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styling/createAndUpdateUser.css"

function CreateUser() {

  let navigate = useNavigate();
  
  const [username, setUsername] = useState("");
  const [userage, setUserage] = useState(null);
  const [usercity, setUsercity] = useState("");

  const sendDataToAPI = (eventt) => {
    eventt.preventDefault() // to remove the warning error while submitting the form , and the error is "Form submission cancelled because the form is not connected"
    
    axios.post("/adduser", {
      username,
      userage,
      usercity,
    }).catch(
      (error) => {
        if (error.response) {
          console.log('Error Response.')
        }
        else if (error.request) {
          console.log('Error Request.')
        }
        else {
          console.log('else part error')
        }
        console.log('config error: ',error.config)
      }
    );
    navigate(-1);  // this will navigate to the homepage of the application when the form is submitted.
    console.log("Typed NAME : ", username);
    console.log("Typed AGE : ", userage);
    console.log("Typed CITY : ", usercity);
  };

  return (
    <div className='createUser'>
      <h1 style={{textAlign: 'center', marginBottom: '20px'}}>Create User</h1>

      <Form onSubmit={(eve)=> eve.preventDefault()}>

        <Form.Group className="mb-3" controlId="formBasicUsername">
          <Form.Label style={{ marginLeft:10 }}>UserName</Form.Label>
          <Form.Control name="username" maxLength="16" onChange={(e)=> setUsername(e.target.value)} placeholder="Enter your name here" style={{borderRadius: 16 }} />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicUserage">
          <Form.Label style={{ marginLeft:10 }}>Age</Form.Label>
          <Form.Control type="number" name="userage" onChange={(e)=> setUserage(e.target.value.slice(0, 3))}  placeholder="Enter your age here" style={{borderRadius: 16 }} />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicUsername">
          <Form.Label style={{ marginLeft:10 }}>City</Form.Label>
          <Form.Control name="usercity" maxLength="12"  onChange={(e)=> setUsercity(e.target.value)}  placeholder="Enter your city here" style={{borderRadius: 16 }} />
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

export default CreateUser;
