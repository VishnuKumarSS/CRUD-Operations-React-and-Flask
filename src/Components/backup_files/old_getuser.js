import React , { useEffect, useState }from 'react'
import axios from 'axios';
import {Table, Button, Form} from 'react-bootstrap';
import "../styling/getuser.css"

export default function GetUser() {
    const [allUsers, setAllUsers] = useState([{}]); // to get all the users

    const [ searchUser, setSearchUser ] = useState(""); // text in the search bar
    const [ userFound, setUserFound ] = useState(null); // if user is found,then we will be changing the value...otherwise no

    // const [userID , setUserID] = useState(null);
    // const [userName , setUserName] = useState("");
    // const [userAge , setUserAge] = useState(null);
    // const [userCity , setUserCity] = useState("");

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
      setUserFound(0);

      console.log("Entered the Search Function...")
      eve.preventDefault();
 
      let matchingUsersArray = []
      let exactUserArray = []

      // Object.keys(allUsers).map(keyy => {
      // or 
      for (let keyy in allUsers) {

        let relatedUser = allUsers[keyy]["username"].toLowerCase()        
        let foundRelatedUser = relatedUser.includes(searchUser);

        // the below statement is used to get all the related users that we have searched
        if (foundRelatedUser) {
          console.log("related user :", relatedUser); 
          // setMatchingUsers({...matchingUsers, 
          //     [keyy] : {
          //       "username" : allUsers[keyy]["username"],
          //       "userage" : allUsers[keyy]["userage"],
          //       "usercity" : allUsers[keyy]["usercity"],
          //     } 
          //   }
          // )
          matchingUsersArray.push({
            "id": keyy,  
            "username" : allUsers[keyy]["username"],
            "userage" : allUsers[keyy]["userage"],
            "usercity" : allUsers[keyy]["usercity"]
          })
        }

        // The below statement is used for getting the Exact User that we have searched.
        if (searchUser === allUsers[keyy]["username"] ){
          console.log("We Typed : ",searchUser);
          console.log("ID : ", keyy)
          console.log("USERNAME : ",allUsers[keyy]["username"]);
          console.log("USERAGE : ",allUsers[keyy]["userage"]);
          console.log("USERCITY : ",allUsers[keyy]["usercity"]);
          setUserFound(1);
          exactUserArray.push({
                "id" : keyy,
                "username" : allUsers[keyy]["username"],
                "userage" : allUsers[keyy]["userage"],
                "usercity" : allUsers[keyy]["usercity"],
              }
          )
          // return(
          // setUserID(keyy)
          // setUserName(allUsers[keyy]["username"])
          // setUserAge(allUsers[keyy]["userage"])
          // setUserCity(allUsers[keyy]["usercity"])
          // )

        }

      }
      setMatchingUsers(matchingUsersArray)
      setExactUser(exactUserArray)
      console.log("User Not Found : ", searchUser)

      return (
        // setUserFound(0), // means user not found
        matchingUsers,
        exactUser
      )
    }

    console.log('MATCHING USERS (OUTSIDE) : ', matchingUsers)
    console.log('EXACT USER (OUTSIDE) : ', exactUser)
    if (userFound === 1){
      console.log('username', exactUser[0]['username'])
    }


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
      { userFound === 1 ? 
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
