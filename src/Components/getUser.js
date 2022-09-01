import React , { useEffect, useState }from 'react'
import axios from 'axios';
import { Table, Button, Form, Toast, ToastContainer } from 'react-bootstrap';
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom'
import "../styling/getUser.css"
import NavBar from './navBar' 

export default function GetUser() {

    let navigate = useNavigate();

    const [currentUserJSON, setCurrentUserJSON] = useState(null);
    const [loggedIn, setLoggedIn ] = useState(false)

    const [users, setUsers] = useState([{}]); // to get all the users
    const [userData, setUserData] = useState([{}]); // to get all the users

    const [ searchUser, setSearchUser ] = useState(""); // text in the search bar
    const [ userFound, setUserFound ] = useState(null); // if user is found,then we will be changing the value...otherwise no

    const [ matchingUsers, setMatchingUsers ] = useState([]);
    const [ exactUser, setExactUser ] = useState([]);

    const [confirm, setConfirm] = useState(false);

    const [error, setError] = useState(null);
    const [deleteUser, setDeleteUser] = useState("")

    const [ toastDelete, setToastDelete ] = useState(false); // to make the toastDelete to work
    const [show, setShow ] = useState(false); // to show and hide the the toast message

    useEffect(() => {
        axios.get("/current_user")
        .then((res) => {
          res.data[1] 
          ?
          setCurrentUserJSON(res.data[1])
          :
          setCurrentUserJSON({'usertype': 'normal'})

          setLoggedIn(true)
          console.log('current',res);
        })
        .catch((err) => {
          console.log("error:", err);
          setCurrentUserJSON(null)
          setLoggedIn(false)
          console.log("Currently no users logged in.");
        });
        axios.get('/allusers')
        .then((getData => {
            console.log('all data : ',getData);
            setUsers(getData.data[0]);
            setUserData(getData.data[1]);
        }))
        .catch(err => {
          console.log(err);
          console.log(err.message);
          setError(err);
        });
    }, []);
 
    function onSearchUser() {
      // eve.preventDefault();
      setUserFound(null); // if the searchUser is empty then we are setting the userFound to null
      console.log("Entered the Search Function...")
      if (searchUser !== ""){
        setUserFound(false);
        setMatchingUsers([]); // while pressing submit button.. setting it to an empty array...For not getting collapsed with the next iteration.
        setExactUser([]); // while pressing submit button.. setting it to an empty array...For not getting collapsed with the next iteration.
        // eve.preventDefault();
  
        let matchingUsersArray = []
        let exactUserArray = []
  
        let id = Object.keys(users) // returns all the user keys of the object in an array.
          
        let exactUserId = id.filter(key => {
          // console.log(key)
          if(userData[key]['username'] !== null){
            return(
              userData[key]['username'].toLowerCase() === searchUser)
          }
          else{
            return(null)
          }
          })
        .map((keyy) => {
          console.log('key', keyy)
          setUserFound(true)
          exactUserArray.push({
            "id" : keyy,
            "username" :  userData[keyy]['username'],
            "userage" :  userData[keyy]['userage'],
            "usercity" :  userData[keyy]['usercity'],
            "usertype" :  userData[keyy]['usertype'],
            "email" :  users[keyy]['email'],
            "fullname" :  users[keyy]['fullname']
          })
          return(
            setExactUser(exactUserArray),
            keyy // here we are returning key to exclude this exact user key from the related user list in the upcoming operations.
          )
          }
          )

          id.filter(key => {
            if ( userData[key]['username'] !== null){
              let relatedUser = userData[key]["username"].toLowerCase();
              let foundRelatedUser = relatedUser.includes(searchUser);
              return( 
                foundRelatedUser && key !== exactUserId[0]
            )
            }
            else{
              return(null)
            }
            })
            .map((keyy) => {
              matchingUsersArray.push({
                "id": keyy,
                "username" : userData[keyy]["username"],
                "userage" : userData[keyy]["userage"],
                "usercity" : userData[keyy]["usercity"],
                "usertype" :  userData[keyy]['usertype'],
                "email" :  users[keyy]['email'],
                "fullname" :  users[keyy]['fullname']
              })
              return(
                setMatchingUsers(matchingUsersArray)
              )
          })
      }
    }

    const setData = (name, age, city, type, email, fullname) => {
      console.log(name, age, city, type, email, fullname)
      return(
        // here we are gonna set the Items in the local storage and we will be using this keys and values in the update and delete user files. And in any files if needed.
        localStorage.setItem("LocalStorageUserName", name), // here local storage user name is a key, that we can see in the console page...go to applications and see the localstorage
        localStorage.setItem("LocalStorageUserAge", age),
        localStorage.setItem("LocalStorageUserCity",city),
        localStorage.setItem("LocalStorageUserType",type),
        localStorage.setItem("LocalStorageEmail",email),
        localStorage.setItem("LocalStorageFullName",fullname)
        // localStorage.setItem("LocalStoragePassword",password)
      )
    }

    // this is going to get the updated data and show it one the all users page
    const getData = () => {
      // let len = users.length
      axios.get('/allusers')
      .then((getData => {
          console.log('users data: ',getData.data);
          setUsers(getData.data[0]);
          setUserData(getData.data[1]);
          // setAllNames(getData.data[1])
          if (userFound !== null){
            setUserFound(null)
          }
      }))
      .catch(err => {
        console.log(err);
        console.log(err.message);
        setError(err.message);
      })

    }

    const onDelete = (name) => {
      console.log("deleted: ",name);
      console.log(currentUserJSON)
      if (currentUserJSON.username !== name){
        axios.delete(`/${name}`)
        .then(()=> {
          getData();
        }
        )
        setToastDelete(true)
        setShow(true)
      }
      else{
        console.log('Cannot delete the current user.')
        return 'No user deleted.'
      }
      
    }

    const toggleButton = () => {
      setConfirm(!confirm)
    }

    return (
    <div >
      <div style={{width:"100vw"}}>
        <NavBar />
      </div>
      {loggedIn && !error ? 
      ( currentUserJSON.usertype === 'normal' || currentUserJSON.usertype==='admin' || currentUserJSON.usertype==='superuser') &&
// ------------------------------------

  <div className="allUsers" style={{margin:"auto", marginTop: 30, marginBottom: 30}}>
      <>
      {userFound=== null ?
        <h1 style={{textAlign: 'center', marginBottom: '20px'}}>ALL USERS</h1>
        :
        <h1 style={{textAlign: 'center', marginBottom: '20px'}}>MATCHING USERS</h1>
      }
  
      <Form onSubmit={(eve)=>{
                        eve.preventDefault();
                      }}>
          <Form.Group className="mb-3" controlId="formBasicCheckbox">
            <Form.Control 
              style={{borderRadius:16}}
              type="Text" 
              label="Check me out" 
              placeholder="Type something here..."
              onChange={(e) => setSearchUser(e.target.value.toLowerCase())}
            />
          </Form.Group> 
    
          <Button id='searchButton' variant="primary" type="submit" onClick={onSearchUser} style={{alignItems:'center', display: 'flex',color: "#000", backgroundColor: "#90CAF9", border: "2px solid #fff",margin: "auto", marginBottom:20, borderRadius:16}} >
            Search
          </Button>
      </Form>
      { userFound !== null
      ?
      <div>
      { userFound === true  
      ? 
        <div className={(userFound === true) ? 'userFound' : 'userNotFound'}>
          <div className='singleUser'>
          <Table borderless >
            <thead  >
              <tr className='heading' >
                <th className="heading" style={{color: "black", borderTopLeftRadius:16, borderBottomLeftRadius:16}}  >ID</th>
                <th className="heading" style={{color: "black"}} >USER NAME</th>
                <th className="heading" style={{color: "black"}} >AGE</th>
                <th className="heading" style={{color: "black"}} >CITY</th>
                <th className="heading" style={{color: "black"}} >TYPE</th>
                <th className="heading" style={{color: "black"}} >EMAIL</th>
                <th className="heading" style={{color: "black"}} >FULLNAME</th>
                {( currentUserJSON.usertype === 'admin' || currentUserJSON.usertype === 'superuser') &&
                <>
                <th className="heading" style={{color: "black"}} >UPDATE</th>
                <th className="heading" style={{color: "black", borderTopRightRadius:16, borderBottomRightRadius:16}} >DELETE</th>
                </>
                }
              </tr>
            </thead>
            <tbody  >
              {exactUser.map((exactuser, i) => {
                  return(
                      <tr key={i} >
                          <td >{exactuser['id']}</td>
                          <td>{exactuser["username"]}</td>
                          <td>{exactuser["userage"]}</td>
                          <td>{exactuser["usercity"]}</td>
                          <td>{exactuser["usertype"]}</td>
                          <td>{exactuser["email"]}</td>
                          <td>{exactuser["fullname"]}</td>
                          { (currentUserJSON.usertype === 'admin' || currentUserJSON.usertype === 'superuser' ) &&
                          <>
                          <td>
                    
                            <Link style={{ textDecoration:"none" }} to="/update">
                              <button onClick={()=> {
                                          setData(
                                            // here we are passing the arguments
                                            exactuser["username"],
                                            exactuser["userage"], 
                                            exactuser["usercity"], 
                                            exactuser["usertype"], 
                                            exactuser["email"],
                                            exactuser["fullname"] 
                                          )
                                        }
                                        } 
                                      style={{ backgroundColor: "#c7ffe5", borderRadius:"1rem", border: '2px solid #000', fontSize:'12px', color: '#3a3a3a'}}>Update</button>
                            </Link>
                          </td>
                          <td>

                            {
                            !confirm 
                            &&
                              <button 
                                  onClick={()=>{
                                    return(
                                      toggleButton(),
                                      setDeleteUser(exactuser['username'])
                                    )
                                  } }
                                  style={{backgroundColor: "#ff8585", borderRadius:"1rem", border: '2px solid #000', fontSize:'12px', color:'#3a3a3a'}}>
                                Delete
                              </button>
                            }
                          </td>
                          </>
                        }
                      </tr>
                  )
              })}
            </tbody>
            <tbody  >
              {matchingUsers.map((matchuser, i) => {
                  return(
                      <tr key={i} >
                          <td >{matchuser['id']}</td>
                          <td>{matchuser["username"]}</td>
                          <td>{matchuser["userage"]}</td>
                          <td>{matchuser["usercity"]}</td>
                          <td>{matchuser["usertype"]}</td>
                          <td>{matchuser["email"]}</td>
                          <td>{matchuser["fullname"]}</td>
                          {( currentUserJSON.usertype === 'admin' || currentUserJSON.usertype === 'superuser' ) &&
                          <>
                          <td>
                    
                            <Link style={{ textDecoration:"none" }} to="/update">
                              <button onClick={()=> {
                                          setData(
                                            // here we are passing the arguments
                                            matchuser["username"],
                                            matchuser["userage"], 
                                            matchuser["usercity"],
                                            matchuser["usertype"], 
                                            matchuser["email"],
                                            matchuser["fullname"] 
                                          )
                                        }
                                        } 
                                      style={{ backgroundColor: "#c7ffe5", borderRadius:"1rem", border: '2px solid #000', fontSize:'12px', color: '#3a3a3a'}}>Update</button>
                            </Link>
                          </td>
                          <td>

                            {
                            !confirm 
                            &&
                              <button 
                                  onClick={()=>{
                                    return(
                                      toggleButton(),
                                      setDeleteUser(matchuser['username'])
                                    )
                                  } }
                                  style={{backgroundColor: "#ff8585", borderRadius:"1rem", border: '2px solid #000', fontSize:'12px', color:'#3a3a3a'}}>
                                Delete
                              </button>
                            
                            }
                          </td>
                          </>
                        }
                      </tr>
                  )
              })}
            </tbody>
            
          </Table>
        
          </div>
        </div>
        :
        <div className={(userFound === false) ? 'showMessage' : 'dontShowMessage'}>
          
          { matchingUsers.length===0 
          ? 
            <div className='singleUserMessage'>
              <p style={{ backgroundColor: '#ff6969', color: "#fff"}} >USER NOT FOUND.</p>
            </div>
          :
         
          <Table borderless >
            <thead  >
              <tr className='heading' >
                <th className="heading" style={{color: "black", borderTopLeftRadius:16, borderBottomLeftRadius:16}}  >ID</th>
                <th className="heading" style={{color: "black"}} >USER NAME</th>
                <th className="heading" style={{color: "black"}} >AGE</th>
                <th className="heading" style={{color: "black"}} >CITY</th>
                <th className="heading" style={{color: "black"}} >TYPE</th>
                <th className="heading" style={{color: "black"}} >EMAIL</th>
                <th className="heading" style={{color: "black"}} >FULLNAME</th>
                {( currentUserJSON.usertype === 'admin' || currentUserJSON.usertype === 'superuser' )&&
                <>
                <th className="heading" style={{color: "black"}} >UPDATE</th>
                <th className="heading" style={{color: "black", borderTopRightRadius:16, borderBottomRightRadius:16}} >DELETE</th>
                </>
                }
              </tr>
            </thead>
            <tbody  >
              {matchingUsers.map((matchuser, i) => {
                  return(
                      <tr key={i} >
                          <td >{matchuser['id']}</td>
                          <td>{matchuser["username"]}</td>
                          <td>{matchuser["userage"]}</td>
                          <td>{matchuser["usercity"]}</td>
                          <td>{matchuser["usertype"]}</td>
                          <td>{matchuser["email"]}</td>
                          <td>{matchuser["fullname"]}</td>
                          {(currentUserJSON.usertype === 'admin' || currentUserJSON.usertype === 'superuser' ) &&
                          <>
                          <td>
                    
                            <Link style={{ textDecoration:"none" }} to="/update">
                              <button onClick={()=> {
                                          setData(
                                            // here we are passing the arguments
                                            matchuser["username"],
                                            matchuser["userage"], 
                                            matchuser["usercity"],
                                            matchuser["usertype"], 
                                            matchuser["email"],
                                            matchuser["fullname"] 
                                          )
                                        }
                                        } 
                                      style={{ backgroundColor: "#c7ffe5", borderRadius:"1rem", border: '2px solid #000', fontSize:'12px', color: '#3a3a3a'}}>Update</button>
                            </Link>
                          </td>
                          <td>

                            {
                            !confirm 
                            &&
                              <button 
                                    onClick={()=>{
                                      return(
                                        toggleButton(),
                                        setDeleteUser(matchuser['username'])
                                      )
                                    } }
                                  style={{backgroundColor: "#ff8585", borderRadius:"1rem", border: '2px solid #000', fontSize:'12px', color:'#3a3a3a'}}>
                                Delete
                              </button>
                            }
                          </td>
                          </>
                        }
                      </tr>
                  )
              })}
            </tbody>
          </Table>

                }
          </div>
          }
    </div>
    : 
    <Table borderless>
      <thead  >
        <tr className='heading' >
          <th className="heading" style={{color: "black", borderTopLeftRadius:16, borderBottomLeftRadius:16}}  >ID</th>
          <th className="heading" style={{color: "black"}} >USER NAME</th>
          <th className="heading" style={{color: "black"}} >AGE</th>
          <th className="heading" style={{color: "black"}} >CITY</th>
          <th className="heading" style={{color: "black"}} >TYPE</th>
          <th className="heading" style={{color: "black"}} >EMAIL</th>
          <th className="heading" style={{color: "black"}} >FULLNAME</th>
          {( currentUserJSON.usertype === 'admin' || currentUserJSON.usertype === 'superuser' )&&
          <>
          <th className="heading" style={{color: "black"}} >UPDATE</th>
          <th className="heading" style={{color: "black", borderTopRightRadius:16, borderBottomRightRadius:16}} >DELETE</th>
          </>
          }
        </tr>
      </thead>
      <tbody>
        {Object.keys(users).map(key => {
            return(
                <tr key={key} >
                    <td >{key}</td>
                    {/* {console.log('users : ',users)} */}
                    <td>{userData[key]["username"]}</td>
                    <td>{userData[key]["userage"]}</td>
                    <td>{userData[key]["usercity"]}</td>
                    <td>{userData[key]["usertype"]}</td>
                    <td>{users[key]["email"]}</td>
                    <td>{users[key]["fullname"]}</td>
                    {( currentUserJSON.usertype === 'admin' || currentUserJSON.usertype === 'superuser' )&&
                    <>
                    <td>
               
                      <Link style={{ textDecoration:"none" }} to="/update">
                        <button onClick={()=> {
                                    setData(
                                      // here we are passing the arguments
                                      userData[key]["username"],
                                      userData[key]["userage"], 
                                      userData[key]["usercity"],
                                      userData[key]["usertype"],
                                      users[key]["email"],
                                      users[key]["fullname"],
                                      // users[key]["password"]

                                    )
                                  }
                                  } 
                                style={{ backgroundColor: "#c7ffe5", borderRadius:"1rem", border: '2px solid #000', fontSize:'12px', color: '#3a3a3a'}}>Update</button>
                      </Link>
                    </td>
                    <td>

                      {
                      !confirm 
                      &&
                        <button 
                            onClick={()=>{
                              return(
                                toggleButton(),
                                setDeleteUser(userData[key]['username'])
                              )
                             } }
                            style={{backgroundColor: "#ff8585", borderRadius:"1rem", border: '2px solid #000', fontSize:'12px', color:'#3a3a3a'}}>
                          Delete
                        </button>
                      }
                    </td>
                    </>
                    }
                </tr>
            )
        })}
      </tbody>
    </Table>
      }
    </>

      {
      confirm 
      &&
      <div onClick={toggleButton} className="overlay">
          <div className='innerOverlay'>
            <h1 style={{marginBottom:'20px', textAlign:'center'}}> Confirm Delete </h1>
            <button 
                onClick={toggleButton} 
                style={{margin:"10px",width:"150px" ,backgroundColor: "#fff", borderRadius:"1rem", border: '3px solid #000', fontSize:'12px', color:'#3a3a3a'}}>
              Cancel
            </button>

            <button 
                onClick={()=> {
                  console.log("main delete button triggered.!")

                  // if (userFound !== null){
                  //   // navigate(-1)
                  // }
                  return(
                    onDelete(deleteUser)
                  )
              }}
                style={{margin:"10px",width:"150px" ,backgroundColor: "#343434",color:"#fff", borderRadius:"1rem", border: '3px solid #fff', fontSize:'12px'}}>
              Confirm
            </button>
          </div>
        </div>
        }

        {
        toastDelete &&
        <ToastContainer position="top-end" style={{marginRight:20, marginTop:20}} >
          <Toast autohide style={{color:"#fff"}} bg={'danger'} delay={4000}  onClose={() => setShow(false)} show={show}>
            <Toast.Header>
              <strong>
                Success Message
              </strong>
            </Toast.Header>
            <Toast.Body>
              User is successfully deleted
            </Toast.Body>
          </Toast>
          </ToastContainer>
        }
  </div>
// ------------------------------------
      :
      <>
      {
      error 
      ? 
      <>
      <div onClick={()=>{
            return(
            toggleButton,
            navigate("/")
            )}}  
            className="overlay">
      <div className='innerOverlay'>
          <h1>Failed to connect with Backend.<br/>Try to connect again.</h1>
          <button  onClick={toggleButton} 
                  style={{margin:"10px",width:"150px" ,backgroundColor: "#fff", borderRadius:"1rem", border: '3px solid #000', fontSize:'12px', color:'#3a3a3a'}}>
            Go Back
          </button>
      </div>
      </div> 
      </>
      :
      <h1>No Users LOGGED IN. Cannot View This Page</h1>
      }
      </>
    }
    </div>

  )
}