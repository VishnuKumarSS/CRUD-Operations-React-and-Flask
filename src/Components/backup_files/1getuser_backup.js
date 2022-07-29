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
        console.log(getData.data);
        setAllUsers(getData.data);
    }))
    }, []);

    function onSearchUser(eve) {
      setUserFound(false);

      console.log("Entered the Search Function...")
      eve.preventDefault();
 
      let matchingUsersArray = []
      let exactUserArray = []

      // Object.keys(allUsers).map(keyy => {
      // or 
      for (let keyy in allUsers) {

        let relatedUser = allUsers[keyy]["username"].toLowerCase()        
        let foundRelatedUser = relatedUser.includes(searchUser);

        // // the below statement is used to get all the related users that we have searched
        // if (foundRelatedUser) {
        //   console.log("related user :", relatedUser); 

        //   matchingUsersArray.push({
        //     "id": keyy,  
        //     "username" : allUsers[keyy]["username"],
        //     "userage" : allUsers[keyy]["userage"],
        //     "usercity" : allUsers[keyy]["usercity"]
        //   })
        // }

        // The below statement is used for getting the Exact User that we have searched.
        if (searchUser === allUsers[keyy]["username"] ){
          console.log("We Typed : ",searchUser);
          console.log("ID : ", keyy)
          console.log("USERNAME : ",allUsers[keyy]["username"]);
          console.log("USERAGE : ",allUsers[keyy]["userage"]);
          console.log("USERCITY : ",allUsers[keyy]["usercity"]);
          setUserFound(true);
          exactUserArray.push({
                "id" : keyy,
                "username" : allUsers[keyy]["username"],
                "userage" : allUsers[keyy]["userage"],
                "usercity" : allUsers[keyy]["usercity"],
              }
          )
        }
            // the below statement is used to get all the related users that we have searched
        else if( foundRelatedUser ){
          console.log("related user :", relatedUser); 

          matchingUsersArray.push({
            "id": keyy,  
            "username" : allUsers[keyy]["username"],
            "userage" : allUsers[keyy]["userage"],
            "usercity" : allUsers[keyy]["usercity"]
          })
        }

      }
      setMatchingUsers(matchingUsersArray)
      setExactUser(exactUserArray)
    }
    // here the function onSearchUser is ended...

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
      {/* { userFound === 1 ? 
        <div className={(userFound === 1) ? 'userFound' : 'userNotFound'}>
          <div className='singleUser'>
            <p>USER ID : {exactUser[0]['id']}</p>
            <p>USER NAME : {exactUser[0]['username']}</p>
            <p>USER AGE : {exactUser[0]['userage']}</p>
            <p>USER CITY : {exactUser[0]['usercity']}</p>
          </div>
        </div>
      :
      <div className={(userFound === 0) ? 'showMessage' : 'dontShowMessage'}>
        <div className='singleUserMessage'>
          <p style={{ backgroundColor: '#ff6969', color: "#fff"}} >User not Found.</p>
        </div>
      </div>
      } */}


    
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

                  {/* <p>USER ID : {exactUser[0]['id']}</p>
                  <p>USER NAME : {exactUser[0]['username']}</p>
                  <p>USER AGE : {exactUser[0]['userage']}</p>
                  <p>USER CITY : {exactUser[0]['usercity']}</p> */}
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

