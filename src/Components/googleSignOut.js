import React from 'react'
import { GoogleLogout } from 'react-google-login'

const client_id = "830332678302-05c3q8bnjjbgmhh4drn86cv2l3e05dmu.apps.googleusercontent.com"
function GoogleSignOut() {
  
    const handleOnLogoutSuccess = () => {
        console.log('Successful logged out from google account.')
    }
  return (
    <div id='signInButton'>
      <GoogleLogout 
        render={renderProps => (
          <button onClick={renderProps.onClick} style={{color:"#fff",fontSize:16, backgroundColor: "#E57373", borderRadius: 10, marginTop:10 , border: "2px solid #E57373", padding: "0.5rem"}}>Logout</button>
        )}
        clientId={client_id}
        buttonText='signout'
        onLogoutSuccess={handleOnLogoutSuccess}
        // onFailure={handleOnFailure}
        // cookiePolicy={'single_host_origin'}
        // isSignedIn={true}
      />

    </div>
  )
}

export default GoogleSignOut

