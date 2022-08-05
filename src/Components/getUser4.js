import React , { useEffect, useState }from 'react'
import axios from 'axios';
import { Table, Button, Form, Carousel } from 'react-bootstrap';
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom'

import "../styling/getUser.css"

export default function GetUser() {

    let navigate = useNavigate();

    const [allUsers, setAllUsers] = useState([{}]); // to get all the users

    const [ searchUser, setSearchUser ] = useState(""); // text in the search bar
    const [ userFound, setUserFound ] = useState(null); // if user is found,then we will be changing the value...otherwise no

    const [ matchingUsers, setMatchingUsers ] = useState([]);
    const [ exactUser, setExactUser ] = useState([]);

    const [confirm, setConfirm] = useState(false);

    const [error, setError] = useState(null);
    const [deleteUser, setDeleteUser] = useState("")

    useEffect(() => {
        axios.get('/allusers')
        .then((getData => {
            // console.log(getData);
            setAllUsers(getData.data);
        }))
        .catch(err => {
          console.log(err);
          console.log(err.message);
          setError(err.message);
        })
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
  
        let id = Object.keys(allUsers) // returns all the user keys of the object in an array.
          
        let exactUserId = id.filter(key => allUsers[key]['username'].toLowerCase() === searchUser)
        .map((keyy) => {
          setUserFound(true)
          exactUserArray.push({
            "id" : keyy,
            "username" :  allUsers[keyy]['username'],
            "userage" :  allUsers[keyy]['userage'],
            "usercity" :  allUsers[keyy]['usercity']
          })
          return(
            setExactUser(exactUserArray),
            keyy // here we are returning key to exclude this exact user key from the related user list in the upcoming operations.
          )
          }
          )

          id.filter(key => {
            let relatedUser = allUsers[key]["username"].toLowerCase();
            let foundRelatedUser = relatedUser.includes(searchUser);
            return( 
              foundRelatedUser && key !== exactUserId[0]
            )
            })
            .map((keyy) => {
              matchingUsersArray.push({
                "id": keyy,  
                "username" : allUsers[keyy]["username"],
                "userage" : allUsers[keyy]["userage"],
                "usercity" : allUsers[keyy]["usercity"]
              })
              return(
                setMatchingUsers(matchingUsersArray)
              )
          })
      }
    }

    const setData = (name, age, city) => {
      console.log(name, age, city)
      return(
        // here we are gonna set the Items in the local storage and we will be using this keys and values in the update and delete user files. And in any files if needed.
        localStorage.setItem("LocalStorageUserName", name), // here local storage user name is a key, that we can see in the console page...go to applications and see the localstorage
        localStorage.setItem("LocalStorageUserAge", age),
        localStorage.setItem("LocalStorageUserCity",city)
      )
    }

    // this is going to get the updated data and show it one the all users page
    const getData = () => {
      axios.get('/allusers')
      .then((getData => {
          // console.log(getData.data);
          setAllUsers(getData.data);
      }))
      .catch(err => {
        console.log(err);
        console.log(err.message);
        setError(err.message);
      })

    }

    const onDelete = (name) => {
      console.log(name);
      // setDeleteUser("")  
      axios.delete(`/${name}`)
      .then(()=> {
        getData(); // this will get the updated data after deleting a particular user with his username.
      })
      // .then(()=>{
      //   onSearchUser();
      // })
    }

    // console.log('EXACT USER (OUTSIDE) : ', exactUser)
    // console.log('MATCHING USERS (OUTSIDE) : ', matchingUsers)

    const toggleButton = () => {
      setConfirm(!confirm)
    }

    return (
      <div className="allUsers" >

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
          <h1>{error}</h1>
          <button onClick={toggleButton} 
          
                  style={{margin:"10px",width:"150px" ,backgroundColor: "#fff", borderRadius:"1rem", border: '3px solid #000', fontSize:'12px', color:'#3a3a3a'}}>
            Go Back
          </button>
      </div>
      </div>  
      :

      // allUsers.length===0
      // ?
      // <div>
      // <h1>No Users Found</h1>
      // </div>
      // :

      <>
      {userFound=== null ?
        <h1 style={{textAlign: 'center', marginBottom: '20px'}}>All Users</h1>
        :
        <h1 style={{textAlign: 'center', marginBottom: '20px'}}>Matching Users</h1>
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
    
          <Button variant="primary" type="submit" onClick={onSearchUser} style={{alignItems:'center', display: 'flex',color: "#000", backgroundColor: "#90CAF9", border: "2px solid #fff",margin: "auto", marginBottom:20, borderRadius:16}} >
            Search
          </Button>
      </Form>
      { userFound !== null
      ?
      <div>
      { userFound === true ? 
        <div className={(userFound === true) ? 'userFound' : 'userNotFound'}>
          <div className='singleUser'>
          <Table borderless >
            <thead  >
              <tr className='heading' >
                <th className="heading" style={{color: "black", borderTopLeftRadius:16, borderBottomLeftRadius:16}}  >ID</th>
                <th className="heading" style={{color: "black"}} >USER NAME</th>
                <th className="heading" style={{color: "black"}} >AGE</th>
                <th className="heading" style={{color: "black"}} >CITY</th>
                <th className="heading" style={{color: "black"}} >UPDATE</th>
                <th className="heading" style={{color: "black", borderTopRightRadius:16, borderBottomRightRadius:16}} >DELETE</th>
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
                          <td>
                    
                            <Link style={{ textDecoration:"none" }} to="/update">
                              <button onClick={()=> {
                                          setData(
                                            // here we are passing the arguments
                                            exactuser["username"],
                                            exactuser["userage"], 
                                            exactuser["usercity"] 
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
                          <td>
                    
                            <Link style={{ textDecoration:"none" }} to="/update">
                              <button onClick={()=> {
                                          setData(
                                            // here we are passing the arguments
                                            matchuser["username"],
                                            matchuser["userage"], 
                                            matchuser["usercity"] 
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
                      </tr>
                  )
              })}
            </tbody>
            
          </Table>
          {/* <Carousel>

            <Carousel.Item interval={5000}>
              <p style={{ backgroundColor: '#c7ffe5', color: "#000", border: "3px solid #000"}}>EXACT USER</p>
                {exactUser.map((exactuser, index) => {
                  return(
                    <div key={index}>
                      <p >
                        USER ID : {userr['id']}
                      </p>
                      <p >
                        USER NAME : { userr['username']}
                      </p>
                      <p >
                        USER AGE : {userr['userage']}
                      </p>
                      <p >
                        USER CITY : {userr['usercity']}
                      </p>
                    </div>
                  )
                })}
            </Carousel.Item>

            {matchingUsers.map((matchuser, i) => {
              return(
                  <Carousel.Item key={i} interval={2000}>
                    <p style={{ backgroundColor: '#ff8585', color: "#000", border: "3px solid #000"}}>
                      MATCHING USER
                    </p>
                      <p>
                        USER ID : {matchuser["id"]}
                      </p>
                      <p>
                        USER NAME : {matchuser["username"]}
                      </p>
                      <p>
                        USER AGE : {matchuser["userage"]}
                      </p>
                      <p>
                        USER CITY : {matchuser["usercity"]}
                      </p>
                  </Carousel.Item>
                )
            })}
          </Carousel> */}

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
          // <Carousel interval={2000}>
          // {matchingUsers.map((matchuser, i) => {
          //         return(
          //             <Carousel.Item key={i} >
          //               <p style={{ backgroundColor: '#ff8585', color: "#000", border: "3px solid #000"}}>
          //                 MATCHING USER
          //               </p>
          //                 <p>
          //                   USER ID : {matchuser["id"]}
          //                 </p>
          //                 <p>
          //                   USER NAME : {matchuser["username"]}
          //                 </p>
          //                 <p>
          //                   USER AGE : {matchuser["userage"]}
          //                 </p>
          //                 <p>
          //                   USER CITY : {matchuser["usercity"]}
          //                 </p>
          //             </Carousel.Item>
          //         )
          //       })}
          // </Carousel>
          <Table borderless >
            <thead  >
              <tr className='heading' >
                <th className="heading" style={{color: "black", borderTopLeftRadius:16, borderBottomLeftRadius:16}}  >ID</th>
                <th className="heading" style={{color: "black"}} >USER NAME</th>
                <th className="heading" style={{color: "black"}} >AGE</th>
                <th className="heading" style={{color: "black"}} >CITY</th>
                <th className="heading" style={{color: "black"}} >UPDATE</th>
                <th className="heading" style={{color: "black", borderTopRightRadius:16, borderBottomRightRadius:16}} >DELETE</th>
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
                          <td>
                    
                            <Link style={{ textDecoration:"none" }} to="/update">
                              <button onClick={()=> {
                                          setData(
                                            // here we are passing the arguments
                                            matchuser["username"],
                                            matchuser["userage"], 
                                            matchuser["usercity"] 
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
    <Table borderless >
      <thead  >
        <tr className='heading' >
          <th className="heading" style={{color: "black", borderTopLeftRadius:16, borderBottomLeftRadius:16}}  >ID</th>
          <th className="heading" style={{color: "black"}} >USER NAME</th>
          <th className="heading" style={{color: "black"}} >AGE</th>
          <th className="heading" style={{color: "black"}} >CITY</th>
          <th className="heading" style={{color: "black"}} >UPDATE</th>
          <th className="heading" style={{color: "black", borderTopRightRadius:16, borderBottomRightRadius:16}} >DELETE</th>
        </tr>
      </thead>
      <tbody>
        {Object.keys(allUsers).map(key => {
            return(
                <tr key={key} >
                    <td >{key}</td>
                    <td>{allUsers[key]["username"]}</td>
                    <td>{allUsers[key]["userage"]}</td>
                    <td>{allUsers[key]["usercity"]}</td>
                    <td>
               
                      <Link style={{ textDecoration:"none" }} to="/update">
                        <button onClick={()=> {
                                    setData(
                                      // here we are passing the arguments
                                      allUsers[key]["username"],
                                      allUsers[key]["userage"], 
                                      allUsers[key]["usercity"] 
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
                                setDeleteUser(allUsers[key]['username'])
                              )
                             } }
                            style={{backgroundColor: "#ff8585", borderRadius:"1rem", border: '2px solid #000', fontSize:'12px', color:'#3a3a3a'}}>
                          Delete
                        </button>
                      
                      
                      }
                    </td>
                </tr>
            )
        })}
      </tbody>
    </Table>
      }

    </>
      }
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

            {/* {console.log(deleteUser)} */}

            <button 
                onClick={()=> {
                  console.log("main delete button triggered.!")
                  if (userFound !== null){
                    navigate("/")
                  }
                  return(
                  onDelete(deleteUser)
                )}}
                style={{margin:"10px",width:"150px" ,backgroundColor: "#343434",color:"#fff", borderRadius:"1rem", border: '3px solid #fff', fontSize:'12px'}}>
              Confirm
            </button>           
          </div>
        </div>
        }
  </div>

  )
}

