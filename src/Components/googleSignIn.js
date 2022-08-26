import React from 'react'
import { GoogleLogin } from 'react-google-login'

const client_id = "830332678302-05c3q8bnjjbgmhh4drn86cv2l3e05dmu.apps.googleusercontent.com"
function GoogleSignIn() {
  
  const handleOnSuccess = (res) => {
    console.log("Login Success! Current Google User Data : ", res)
    return fetch('http://localhost:5000/google/signin', {
      'method': 'POST',
      headers : {'Content-Type' : 'application/json'},
      body: JSON.stringify(res.profileObj)
    },
    console.log('without JSON stringify : ', res.profileObj),
    console.log('JSON stringify data : ',JSON.stringify(res.profileObj))
    )
    .catch(error => console.log('Error in handlingOnSuccess :', error))
  }


  const handleOnFailure = (res) => {
    console.log("Login Failed! Current User: ", res)
  }
  return (
    <div id='signInButton' >
      <GoogleLogin 
        clientId={client_id}
        buttonText='signin'
        onSuccess={handleOnSuccess}
        onFailure={handleOnFailure}
        cookiePolicy={'single_host_origin'}
        isSignedIn={true}
      />

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