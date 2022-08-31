import React, {useState} from 'react'
import { GoogleLogin } from 'react-google-login'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "../styling/googleSignIn.css"

const client_id = "830332678302-05c3q8bnjjbgmhh4drn86cv2l3e05dmu.apps.googleusercontent.com"

function GoogleSignIn() {
  
  const [ created, setCreated ] = useState(false);
  let navigate = useNavigate();

  const handleOnSuccess = async (res) => {
    console.log("Login Success! Current Google User Data : ", res)
      try{
        let name= res.profileObj.name
        let email= res.profileObj.email
        let googleId= res.profileObj.googleId
        await axios
            .post("/google_signin", {
              name,
              email,
              googleId
            })
            // .then(()=>
            // navigate("/adduserdata")
            // )

            // query if the user exist or not
            axios
            .get("/current_user")
              .then((res) => {
                console.log('home',res);
                if (res.data[1] === undefined) {
                  navigate("/adduserdata")
                }
                else{
                  console.log('User datas are already provided.')
                  // navigate("/")
                }
              })
              .catch((err) => {
                console.log("error:", err);
              })
            // setLoggedIn(true)
            setCreated(true);
            
            // setLoggedIn(true)
            console.log('User Logged IN'); // we are awaiting to get the response. 
             // if this works properly then it will navigate it to the given route.
        }
      catch(error){
        console.log(error)
        if (error.response.status === 401) {
          alert(error.response.data.message);
      }
    };
  };
    // return fetch('http://localhost:5000/google_signin', {
    //   'method': 'POST',
    //   headers : {'Content-Type' : 'application/json'},
    //   body: JSON.stringify(res.profileObj)
    // },
    // console.log('without JSON stringify : ', res.profileObj),
    // console.log('JSON stringify data : ',JSON.stringify(res.profileObj))
    // )
    // .catch(error => console.log('Error in handlingOnSuccess :', error))
  // }


  const handleOnFailure = (res) => {
    console.log("Login Failed! Current User: ", res)
  }
  return (
    <div>
      { 
        created
        ?
        <div className='container' style={{width:"500px"}}>
        <div className='created' style={{ textAlign: 'center', padding:"2rem" }}>
            <h1 style={{backgroundColor: "#c7ffe5", border:"3px solid #fff"}}>
              Successfully LoggedIN!
            </h1>
            <button onClick={(e)=>{
                            return(
                              e.preventDefault(),
                              navigate("/")
                            )}} 
              style={{fontSize:16, backgroundColor: "#90CAF9", borderRadius: 10, marginTop:10 , border: "2px solid #fff"}} 
            >Return Home
            </button>          
        </div>
        </div>

        :
        <div className='container' style={{margin: "auto", width: "500px",padding: "3rem", alignItems: "center", display: "flex", flexDirection: 'column'}}>
          <h1 style={{ marginBottom: 30, textAlign: "center"}}>Click the below button to Continue</h1>
          <GoogleLogin
            render={renderProps => (
              <button onClick={renderProps.onClick} style={{
                // color:"#fff",fontSize:16, backgroundColor: "#E57373", borderRadius: 10, marginTop:10 , border: "2px solid #E57373", padding: "0.5rem"
              marginBottom: 10,
              flexDirection: "row",
              borderRadius: 8,
              padding: 8,
              color: "#000",
              backgroundColor: "#B2DFDB",
              border: "3px solid #4DB6AC",
              }}
                >Login with Google</button>
            )}
            clientId={client_id}
            buttonText='signin'
            onSuccess={handleOnSuccess}
            onFailure={handleOnFailure}
            cookiePolicy={'single_host_origin'}
            isSignedIn={true}
          >Login</GoogleLogin>
        </div>
    }
    </div>
    
  )
}

export default GoogleSignIn


















// import React , { useEffect , useState }from 'react'

// import axios from 'axios'
// function GoogleSignIn() {
//   const [ googleData , setGoogleData ] = useState(null);
//   useEffect(()=> {
//     axios.get('/login/google')
//     .then( res => {
//     //   setGoogleData(res)
//       console.log(res)
//     })
//   }, [])


//   // useEffect(()=>{
//   // (async() => {
//   //   try{
//   //     const responseData = await axios.get("/login/google")
//   //     console.log(responseData)
//   //   }
//   //   catch(error){
//   //     console.log('Currently no users logged in...')
//   //     console.log(error)
//   //   }
//   // }
//   // )() // lambda function
//   // },[])
//   return (
//     <div>
//       <>
//         {/* {googleData} */}
//         hel
//       </>
//       </div>
//   )
// }

// export default GoogleSignIn