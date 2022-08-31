import GetUser from "./Components/getUser";
import CreateUser from "./Components/createUser";
import AddUserData from "./Components/addUserData";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Components/home";
import UpdateUser from "./Components/updateUser";
import Login from "./Components/login";
import NotFound from "./Components/notFound";
import { gapi } from "gapi-script";
import { useEffect } from "react";
import GooglePage from "./Components/googlePage";

const client_id = "830332678302-05c3q8bnjjbgmhh4drn86cv2l3e05dmu.apps.googleusercontent.com"

function App() {
  useEffect(()=> {
    function start() {
      // gapi.client.init  -- Showing some text in console -> client_id and scope must both be provided to initialize OAuth.
      // or 
      gapi.auth2.init({
        clientId: client_id,
        scope: ""
      })
    };

    gapi.load('client:auth2', start)
  })

  return (
    <>
      <Router>
        <div className="mainClass">
          <div>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/adduser" element={<CreateUser />} />
              <Route path="/adduserdata" element={<AddUserData />} />
              <Route path="/allusers" element={<GetUser />} />
              <Route path="/update" element={<UpdateUser />} />
              <Route path="/login" element={<Login />} />
              <Route path="*" element={<NotFound />} />
              <Route path="/googlepage" element={<GooglePage />} />

              {/* <Route path="/google_signin" element={<GoogleSignIn />} />
              <Route path="/google_signout" element={<GoogleSignOut />} /> */}

            </Routes>
          </div>
        </div>
      </Router>
    </>
  );
}

export default App;
