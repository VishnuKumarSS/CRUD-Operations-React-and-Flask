import React, { useState } from "react";
import {Form, Button} from 'react-bootstrap';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styling/createAndUpdateUser.css"



function CreateUser() {

  let navigate = useNavigate();
  
  // const [validated, setValidated] = useState(false);

  // const handleSubmit = (event) => {
  //   const form = event.currentTarget;
  //   if (form.checkValidity() === false) {
  //     event.preventDefault();
  //     event.stopPropagation();
  //   }

  //   setValidated(true);
  // };
  
  const [username, setUsername] = useState("");
  const [userage, setUserage] = useState(null);
  const [usercity, setUsercity] = useState("");
  
  const [ created, setCreated] = useState(false); // to show the user is created message on the screen

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
    setCreated(true);
    console.log("Typed NAME : ", username);
    console.log("Typed AGE : ", userage);
    console.log("Typed CITY : ", usercity);

    // navigate(-1);  // this will navigate to the homepage of the application when the form is submitted.
  
  };

  return (
    <div className='createUser'>

      { 
        created
        ?
        <div className='created' style={{ textAlign: 'center', padding:"2rem" }}>
            <h1 style={{backgroundColor: "#c7ffe5", border:"3px solid #fff"}}>
              User Created Successfully!
            </h1>
            <button onClick={(e)=>{
                            return(
                              e.preventDefault(),
                              navigate("/")
                            )}} 
              style={{fontSize:16, backgroundColor: "#90CAF9", borderRadius: 10, marginTop:10 , border: "2px solid #fff"}} 
            >Return Home
            </button>          
        </div>
        :
        <>
          <h1 style={{textAlign: 'center', marginBottom: '20px'}}>Create User</h1>
          <Form  >

          <Form.Group className="mb-3" controlId="formBasicUsername">
            <Form.Label style={{ marginLeft:10 }}>UserName</Form.Label>
            {/* <Form.Control name="username" maxLength="16" onChange={(e)=> setUsername(e.target.value.trim())} placeholder="Enter your name here" style={{borderRadius: 16 }} /> */}
            <Form.Control name="username" maxLength="16" onBlur={(eve)=> setUsername(eve.target.value.trim())} onChange={(e)=> setUsername(e.target.value)} placeholder="Enter your name here" style={{borderRadius: 16 }} />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicUserage">
            <Form.Label style={{ marginLeft:10 }}>Age</Form.Label>
            <Form.Control type="number" maxLength="3" name="userage" 
            onChange={(e)=> {
              return(
                // console.log(userage),
                setUserage(e.target.value.slice(0, 3)),
                e.target.value  = e.target.value.slice(0,3)
              )}}  
              placeholder="Enter your age here" style={{borderRadius: 16 }} />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicUsername">
            <Form.Label style={{ marginLeft:10 }}>City</Form.Label>
            <Form.Control name="usercity" maxLength="12" onBlur={(eve)=> setUsercity(eve.target.value.trim())} onChange={(e)=> setUsercity(e.target.value)}  placeholder="Enter your city here" style={{borderRadius: 16 }} />
            
          </Form.Group>
          { (username && userage && usercity)
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
        </>

      }

    </div>
  );
}

export default CreateUser;
