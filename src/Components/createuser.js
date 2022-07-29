import React, { useState } from "react";
import {Form, Button} from 'react-bootstrap';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styling/createuser.css"

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
    console.log("Typed NAME : ", username);
    console.log("Typed AGE : ", userage);
    console.log("Typed CITY : ", usercity);
  };

  function afterSubmission(event) {
    // This function solely used to stop the page refreshing while searching the user using the react bootstrap. 
    // We need the preventDefault in onSubmit event listener to make the react bootstrap work by stoping the window from refreshing..
    event.preventDefault();
  }

  return (
    <div className='createUser'>

      <Form onSubmit={afterSubmission}>

        <Form.Group className="mb-3" controlId="formBasicUsername">
          <Form.Label style={{ marginLeft:10 }}>UserName</Form.Label>
          <Form.Control name="username" onChange={(e)=> setUsername(e.target.value)} placeholder="Enter your name here" style={{borderRadius: 16 }} />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicUserage">
          <Form.Label style={{ marginLeft:10 }}>Age</Form.Label>
          <Form.Control type="number" name="userage" onChange={(e)=> setUserage(e.target.value)}  placeholder="Enter your age here" style={{borderRadius: 16 }} />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicUsername">
          <Form.Label style={{ marginLeft:10 }}>City</Form.Label>
          <Form.Control name="usercity" onChange={(e)=> setUsercity(e.target.value)}  placeholder="Enter your city here" style={{borderRadius: 16 }} />
        </Form.Group>

        <Button variant="primary" type="submit" onClick={sendDataToAPI} style={{color: "black", border: "2px solid #fff", marginLeft: 180 ,backgroundColor: "white", marginTop: 16, borderRadius:16}}>
          Submit
        </Button>

      </Form>

    </div>
  );
}

export default CreateUser;
