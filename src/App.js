import GetUser from "./Components/getuser";
import CreateUser from "./Components/createuser";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Components/home";


function App() {
  return (
    <Router>
      <div className="mainClass">
        <div>
          <Routes>
            <Route path="/" element={<Home />} />
            {/* <Route path=":search" element={<GetSingleUser />} /> */}
            <Route path="/adduser" element={<CreateUser />} />
            <Route path="/allusers" element={<GetUser />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
