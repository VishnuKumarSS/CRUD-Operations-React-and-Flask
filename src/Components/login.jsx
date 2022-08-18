import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "../styling/createAndUpdateUser.css"
import axios from "axios";

function Login() {
  let navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const loginUser = async () => {
    console.log(username, password);
    try{
        // const responseData = await axios
        await axios
          .post("/login", {
            username,
            password,
          })
        console.log('User Logged IN'); // we are awaiting to get the response. 
        navigate("/") // if this works properly then it will navigate it to the given route.
      }
    catch(error){
      console.log(error)
      if (error.response.status === 401) {
        alert(error.response.data.message);
    }
  };
};

  return (
    <div>
      <Form onSubmit={(e) => e.preventDefault()}>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>User Name: </Form.Label>
          <Form.Control
            type="text"
            value={username}
            placeholder="Enter Your Name"
            onChange={(e) => setUsername(e.target.value)}
          />
          {/* <Form.Text className="text-muted">
          We'll never share your email with anyone else.
        </Form.Text> */}
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password: </Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
        </Form.Group>
        {/* <Form.Group className="mb-3" controlId="formBasicCheckbox">
        <Form.Check type="checkbox" label="Check me out" />
      </Form.Group> */}
        <Button variant="primary" type="submit" onClick={loginUser}>
          Submit
        </Button>
      </Form>
    </div>
  );
}

export default Login;
