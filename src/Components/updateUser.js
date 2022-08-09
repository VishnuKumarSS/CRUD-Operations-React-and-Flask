// this update user.js is a replica or duplicate of createuser.js...Just altered some of the things that are required for the update user.
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

  const [ updated, setUpdated ] = useState(false); // to show the user is updated message on the screen.

  const [error, setError] = useState(null); // to show the error message
  const [confirm, setConfirm] = useState(false)

  const [validated, setValidated] = useState(false);

  let special_char = "!@#$%^&*()+=-[]\\\';,./{}|\":<>? "

  const sendDataToAPI = (eventt) => {
    eventt.preventDefault()// to remove the warning error while submitting the form , and the error is "Form submission cancelled because the form is not connected"
    axios.put(`/${updateUserNameURL}`, {
      username,
      userage,
      usercity,
      })
      .catch(error => {
        console.log(error);
        console.log(error.message);
        setError(error.message);
      })
      
      setUpdated(true);

      // navigate(`/`);  // this will navigate to the homepage of the application when the form is submitted.
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

  // for toggling the popup message
  const toggleButton = () => {
    setConfirm(!confirm)
  }

  const handleFormSubmit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    setValidated(true)
  };
  
  return (
    <div className='updateUser'>
        {
        error
        ?
        <div onClick={()=>{
                return(
                toggleButton,
                navigate("/allusers")
                )}}  
        className="overlay">
        <div className='innerOverlay'>
          <h1>Failed to Connect with Backend</h1>
          <button onClick={toggleButton} 
                  style={{margin:"10px",width:"150px" ,backgroundColor: "#fff", borderRadius:"1rem", border: '3px solid #000', fontSize:'12px', color:'#3a3a3a'}}>
            Go Back
          </button>
        </div>
        </div>
        : 
        <>
      { 
        updated
        ?
        <div className='updated' style={{ textAlign: 'center', padding:"2rem" }}>
            <h1 style={{backgroundColor: "#c7ffe5", border:"3px solid #fff"}}>
              User UPDATED Successfully!
            </h1>
            <button onClick={(e)=>{
                            return(
                              e.preventDefault(),
                              navigate("/allusers")
                            )}} 
              style={{fontSize:16, backgroundColor: "#90CAF9", borderRadius: 10, marginTop:10 , border: "2px solid #fff"}} 
            >Go to Users Page
            </button>          
        </div>
        :
        <>
          <h1 style={{textAlign: 'center', marginBottom: '20px'}}> Update User Details</h1>
          <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
            <Form.Group className="mb-3" controlId="formBasicUsername">
              <Form.Label style={{ marginLeft:5 }}>UserName : </Form.Label>
              <Form.Control required name="username" value={username || ""} maxLength="16" onBlur={(eve)=> setUsername(eve.target.value.trim())} 
              // onChange={(e)=> setUsername(e.target.value)}
              onChange={(e)=> {
                let last= e.target.value.slice(-1)
                if (special_char.indexOf(last) === -1) {
                  setUsername(e.target.value)
                }

              }}  
              placeholder="Enter your name here" style={{borderRadius: 16 }} />
              
              <Form.Control.Feedback type="invalid" style={{ marginLeft:5 }}>
                Please provide a valid User Name.
              </Form.Control.Feedback>
              <Form.Text className="text-muted" style={{marginLeft:5}}>
                Type without any SPECIAL CHAR'S or SPACES.
              </Form.Text>
            </Form.Group>
            
            <Form.Group className="mb-3" controlId="formBasicUserage">
              <Form.Label style={{ marginLeft:5 }}>Age : </Form.Label>
              <Form.Control required type="number" value={userage || ""} name="userage" onChange={(e)=> setUserage(e.target.value.slice(0,3))}  placeholder="Enter your age here" style={{borderRadius: 16 }} />
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
            
            { username && userage && usercity
            ? 
            <Button variant="primary" type="submit" onClick={sendDataToAPI} style={{color: "black", border: "2px solid #fff",backgroundColor: "#90CAF9", marginLeft: 180 , marginTop: 16, borderRadius:16}}>
              Submit
            </Button> 
            : 
            <Button type='submit' style={{color: "black", border: "2px solid #fff", marginLeft: 180 ,backgroundColor: "#F5F5F5", marginTop: 16, borderRadius:16}}>
              Submit
            </Button>
            }

          </Form>
        </>
      }
      </>
      }
    </div>
  );
}

export default UpdateUser;
