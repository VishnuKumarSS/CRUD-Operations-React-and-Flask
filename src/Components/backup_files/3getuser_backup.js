import React , { useEffect, useState }from 'react'
import axios from 'axios';
import { Table, Button, Form, Carousel } from 'react-bootstrap';
import "../styling/getuser.css"

export default function GetUser() {
    const [allUsers, setAllUsers] = useState([{}]); // to get all the users

    const [ searchUser, setSearchUser ] = useState(""); // text in the search bar
    const [ userFound, setUserFound ] = useState(null); // if user is found,then we will be changing the value...otherwise no

    const [ matchingUsers, setMatchingUsers ] = useState([]);
    const [ exactUser, setExactUser ] = useState([]);


    useEffect(() => {
    axios.get('/allusers')
    .then((getData => {
        // console.log(getData.data);
        setAllUsers(getData.data);
    }))
    }, []);
 

    function onSearchUser(eve) {
      setUserFound(false);
      console.log("Entered the Search Function...")
      eve.preventDefault();

      let matchingUsersArray = []
      let exactUserArray = []

      let id = Object.keys(allUsers) // returns all the user keys of the object in an array.
      
      console.log(allUsers)
      let exactUserId = id.filter(key => allUsers[key]['username'] === searchUser)
        .map((keyy, index) => {
          setUserFound(true)
          exactUserArray.push({
            "id" : keyy,
            "username" :  allUsers[keyy]['username'],
            "userage" :  allUsers[keyy]['userage'],
            "usercity" :  allUsers[keyy]['usercity']
          })
          return(
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
        .map((keyy, index) => {
          matchingUsersArray.push({
            "id": keyy,  
            "username" : allUsers[keyy]["username"],
            "userage" : allUsers[keyy]["userage"],
            "usercity" : allUsers[keyy]["usercity"]
          })
          return(
            keyy
          )
      })

      
      setMatchingUsers(matchingUsersArray)
      setExactUser(exactUserArray)
    }
    console.log('MATCHING USERS (OUTSIDE) : ', matchingUsers)
    console.log('EXACT USER (OUTSIDE) : ', exactUser)


    return (
    <div className="allUsers" >

      <Form >

      <Form.Group className="mb-3" controlId="formBasicCheckbox">
        <Form.Control 
          style={{borderRadius:16}}
          type="Text" 
          label="Check me out" 
          placeholder="Type something here..."
          onChange={(e) => setSearchUser(e.target.value.toLowerCase())}
        />
      </Form.Group>  

      <Button variant="primary" type="submit" onClick={onSearchUser} style={{color: "black", backgroundColor: "#fff", border: "1px solid #fff",margin: "auto", marginLeft:175, marginBottom:20, borderRadius:16}} >
        Submit
      </Button>

      </Form>
    
          { userFound === true ? 
            <div className={(userFound === true) ? 'userFound' : 'userNotFound'}>
              <div className='singleUser'>
            
              <Carousel>
                <Carousel.Item interval={5000}>
                  <p style={{ backgroundColor: '#c7ffe5', color: "#000", border: "3px solid #000"}}>EXACT USER</p>
                    {exactUser.map((userr, index) => {
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
                    })
                    }

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
              </Carousel>

              </div>
            </div>
          :
          <div className={(userFound === false) ? 'showMessage' : 'dontShowMessage'}>
            
            { matchingUsers.length===0 
            ? 
              <div className='singleUserMessage'>
                <p style={{ backgroundColor: '#ff6969', color: "#fff"}} >NO USERS FOUND.</p>
              </div>
            :
              <Carousel interval={2000}>
              {matchingUsers.map((matchuser, i) => {
                      return(
                          <Carousel.Item key={i} >
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
          </Carousel>
            }

          </div>
          }
  
    <Table>
      <thead >
        <tr className='heading' >
          <th className="heading" style={{color: "black", borderTopLeftRadius:16, borderBottomLeftRadius:16}}  >ID</th>
          <th className="heading" style={{color: "black"}} >User Name</th>
          <th className="heading" style={{color: "black"}} >Age</th>
          <th className="heading" style={{color: "black", borderTopRightRadius:16, borderBottomRightRadius:16}} >City</th>
        </tr>
      </thead>
      <tbody>
        {Object.keys(allUsers).map(key => {
            return(
                <tr key={key}>
                    <td>{key}</td>
                    <td>{allUsers[key]["username"]}</td>
                    <td>{allUsers[key]["userage"]}</td>
                    <td>{allUsers[key]["usercity"]}</td>
                </tr>
            )
        })}
      </tbody>
    </Table>

    </div>
  )
}

