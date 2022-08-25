import GetUser from "./Components/getUser";
import CreateUser from "./Components/createUser";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Components/home";
import UpdateUser from "./Components/updateUser";
import Login from "./Components/login";
import NotFound from "./Components/notFound";
import NavBar from "./Components/navBar";
import GoogleSignIn from "./Components/googleSignIn";

function App() {
  return (
    <>
      <Router>
        {/* <NavBar/> */}
        <div className="mainClass">
          <div>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/adduser" element={<CreateUser />} />
              <Route path="/allusers" element={<GetUser />} />
              <Route path="/update" element={<UpdateUser />} />
              <Route path="/login" element={<Login />} />
              <Route path="*" element={<NotFound />} />

              <Route path="/login/google" element={<GoogleSignIn />} />
              <Route path="/authorize/google" element={<Login />} />
            </Routes>
          </div>
        </div>
      </Router>
    </>
  );
}

export default App;
