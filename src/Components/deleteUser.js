// import React ,{ useState, useEffect }from 'react'
// import { useNavigate } from 'react-router-dom'
// import axios from 'axios';

// function DeleteUser() {
//     let navigate = useNavigate();
//     const [deleteUser, setDeleteUser] = useState("")

//     const [ username, setUsername] = useState("");
//     const [ deleteUserNameURL, setDeleteUserNameURL] = useState("");



//     useEffect(()=> {
//         setDeleteUserNameURL(localStorage.getItem('UserNameToDelete')) // this is gonna be that particular username that we have selected to update. And this will be in the url endpoint in the backend
//         setUsername(localStorage.getItem('UserNameToDelete')); // here we are getting that LocalStorageUserName that we set while setting the username in the getUser.js
//       }, [])

//     const onDelete = (name) => {
//         console.log("deleted: ",name);
//         // setDeleteUser("")  
//         axios.delete(`/${name}`)
//         .then(()=> {
//           getData(); // this will get the updated data after deleting a particular user with his username.
//         })
  
//       }
  

//     return (
        
//         <div>
//         {
//         <div className="overlay">
//             <div className='innerOverlay'>
//                 <h1 style={{marginBottom:'20px', textAlign:'center'}}> Confirm Delete </h1>
//                 <button  
//                     style={{margin:"10px",width:"150px" ,backgroundColor: "#fff", borderRadius:"1rem", border: '3px solid #000', fontSize:'12px', color:'#3a3a3a'}}>
//                 Cancel
//                 </button>

//                 {/* {console.log(deleteUser)} */}

//                 <button 
//                     onClick={()=> {
//                     console.log("main delete button triggered.!")
//                     // setToastDelete(true)
//                     // setShow(true)

//                     if (userFound !== null){
//                         navigate("/allusers")
//                     }
//                     return(
//                         // onSearchUser(),
//                         onDelete(deleteUser)
//                     )
//                 }}
//                     style={{margin:"10px",width:"150px" ,backgroundColor: "#343434",color:"#fff", borderRadius:"1rem", border: '3px solid #fff', fontSize:'12px'}}>
//                 Confirm
//                 </button>

            
//             </div>
//             </div>
//             }
//         </div>
//     )
//     }

// export default DeleteUser;