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
    
    const [ created, setCreated] = useState(false); // to show the user is created message on the screen

    const [confirm, setConfirm] = useState(false);
    const [ error, setError ] = useState(null);

    const [validated, setValidated] = useState(false);
    const [specialChar, setSpecialChar] = useState(null);
    let special_chars = [
      '!', '@', '#', '$', '%', '^',
      '&', '*', '(', ')', '+', '=',
      '-', '[', ']', "'", ';', ',',
      '.', '/', '{', '}', '|', '"',
      ':', '<', '>', '?', ' '
    ]
    const sendDataToAPI = () => {
    // eventt.preventDefault() // to remove the warning error while submitting the form , and the error is "Form submission cancelled because the form is not connected"
    axios.post("/adduser", {
      username,
      userage,
      usercity,
    })
    .catch(error => {
        console.log(error);
        console.log(error);
        setError(error);
      })
    
    setCreated(true);
    console.log(created)
    console.log("Typed NAME : ", username);
    console.log("Typed AGE : ", userage);
    console.log("Typed CITY : ", usercity);

    // navigate(-1);  // this will navigate to the homepage of the application when the form is submitted.
  
  };

    // for toggling the popup message
    const toggleButton = () => {
      setConfirm(!confirm)
    }

    const handleFormSubmit = (event) => {
      event.preventDefault();

      const form = event.currentTarget;
      if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
      }
      setValidated(true)
    };
    
    return (
      <div className='createUser'>
        {
          error
          ?
          <div onClick={()=>{
                  return(
                  toggleButton,
                  navigate("/")
                  )}}  
          className="overlay">
          <div className='innerOverlay'>
            {error.response.status === 409
            ?
            <h1>{error.response.data.message}</h1>
            :
            <h1>Something Went Wrong.<br/>Try connecting with Backend.</h1>
          }

            <button onClick={toggleButton} 
            
                    style={{margin:"10px",width:"150px" ,backgroundColor: "#fff", borderRadius:"1rem", border: '3px solid #000', fontSize:'12px', color:'#3a3a3a'}}>
              Go Back
            </button>
          </div>
          </div>
          : 
          <>
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

              <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
    
              <Form.Group className="mb-3" controlId="formBasicUsername">
                
                <Form.Label style={{ marginLeft:5 }}>UserName : </Form.Label>
                {/* <Form.Control name="username" maxLength="16" onChange={(e)=> setUsername(e.target.value.trim())} placeholder="Enter your name here" style={{borderRadius: 16 }} /> */}
                <Form.Control required value={username || ""} name="username" maxLength="16" 
                onBlur={(eve)=> setUsername(eve.target.value.trim())}   
                onChange={(e)=>{
                  setUsername(e.target.value)
                }}
                // onChange={(e)=> {
                // let last= e.target.value.slice(-1)
                // if (special_chars.includes(last) !== true) {
                //   setUsername(e.target.value)
                // }
                // }}
            
                placeholder="Enter your name here" style={{borderRadius: 16 }} />
              
                {specialChar ?
                <Form.Control.Feedback type="valid" style={{ marginLeft:5 }}>
                  Enter without special characters.
                </Form.Control.Feedback>
                :
                <Form.Control.Feedback type="invalid" style={{ marginLeft:5 }}>
                  Please provide a valid User Name.
                </Form.Control.Feedback>
                }
                
                
                <Form.Text className="text-muted" style={{marginLeft:5}}>
                  Type without any SPECIAL CHAR'S or SPACES.
                </Form.Text>                          
              </Form.Group>
    
              <Form.Group className="mb-3" controlId="formBasicUserage">
                <Form.Label style={{ marginLeft:5 }}>Age : </Form.Label>
                <Form.Control required value={userage || ""} type="number" maxLength="3" name="userage" 
                onChange={(e)=> {
                  return(
                    // console.log(userage),
                    setUserage(e.target.value.slice(0, 3))
                    // e.target.value  = e.target.value.slice(0,3)
                  )}}  
                  placeholder="Enter your age here" style={{borderRadius: 16 }} />
                <Form.Control.Feedback type="invalid" style={{ marginLeft:5 }}>
                    Please provide your Age.
                </Form.Control.Feedback>
              </Form.Group>
    
              <Form.Group className="mb-3" controlId="formBasicUsername">
                <Form.Label style={{ marginLeft:5 }}>City : </Form.Label>
                <Form.Control required name="usercity" value={usercity || ""} maxLength="12" onBlur={(eve)=> setUsercity(eve.target.value.trim())} onChange={(e)=> setUsercity(e.target.value)}  placeholder="Enter your city here" style={{borderRadius: 16 }} />
                <Form.Control.Feedback type="invalid" style={{ marginLeft:5 }}>
                    Please provide a valid city.
                </Form.Control.Feedback>
              </Form.Group>

              {console.log(username, userage, usercity)}


              { (username && userage && usercity)
              // { (username && userage && usercity && !specialChar)

              ? 
                <Button variant="primary" type="submit" 
                onSubmit={(e)=>{e.preventDefault()}}
                onClick={(e)=>{
                  let count = 0
                  for (let i of special_chars){
                    console.log(username.includes(i))
                    console.log(i)
                    if (username.includes(i)){
                      setSpecialChar(true)
                      count = count + 1;
                    }
                  }
                  if (count === 0 ){
                    setSpecialChar(false)
                  }
                }} style={{color: "black", border: "2px solid #fff",backgroundColor: "#90CAF9", marginLeft: 180 , marginTop: 16, borderRadius:16}}>
                Submit
              </Button> 
              : 
              <Button type='submit' style={{color: "black", border: "2px solid #fff", marginLeft: 180 ,backgroundColor: "#F5F5F5", marginTop: 16, borderRadius:16}}>
                Submit
              </Button>
              
              }
              {console.log("count", specialChar)}
              {/* {specialChar!==false && specialChar===true && sendDataToAPI() &&
                <Button variant="primary" type="submit" onClick={sendDataToAPI}
                 style={{color: "black", border: "2px solid #fff",backgroundColor: "#000", marginLeft: 180 , marginTop: 16, borderRadius:16}}>
                Submit
              </Button> 
              } */}
               {specialChar=== false && sendDataToAPI()}

              </Form>
            </>
    
          }
          </>

        }
        

      </div>
    );
}

export default CreateUser;
