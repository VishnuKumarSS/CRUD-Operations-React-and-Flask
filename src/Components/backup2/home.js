import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import "../styling/home.css"

export default function Home() {
  return (
    <div className="home">
      <h1>HOME PAGE</h1>
      <nav >

        <Link style={{ textDecoration:"none" }} to="/allusers">
          <Button className="homeButton"
            style={{
              marginBottom: 10,
              display: "flex",
              flexDirection: "column",
              borderRadius: 16, 
              marginTop: 30,
              color: "#000",
              backgroundColor: "#ffdc7c",
              border: "3px solid #ffc420" ,
            }}
          >
            All Users
          </Button>
        </Link>

        <Link style={{ textDecoration:"none" }} to="/adduser">
          <Button className="homeButton"
            style={{
              marginBottom: 10,
              display: "flex",
              flexDirection: "column",
              borderRadius: 16,
              color: "#000",
              backgroundColor: "#ffdc7c",
              border: "3px solid #ffc420" ,
              
            }}
          >
            Create User
          </Button>
        </Link>
        
      </nav>
    </div>
  );
}
