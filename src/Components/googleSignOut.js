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
          <button onClick={renderProps.onClick} style={{color:"#000",fontSize:16, backgroundColor: "#E57373", borderRadius: 16 , border: "1px solid #E57373", padding: "0.5rem", paddingLeft: 15, paddingRight: 15}}>LOGOUT</button>
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

