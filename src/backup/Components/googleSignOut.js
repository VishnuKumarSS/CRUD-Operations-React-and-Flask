import React from 'react'
import { GoogleLogout } from '@leecheuk/react-google-login'

const client_id = "830332678302-05c3q8bnjjbgmhh4drn86cv2l3e05dmu.apps.googleusercontent.com"
function GoogleSignOut() {
  
    const handleOnLogoutSuccess = () => {
        console.log('Logout Successful')
    }
  return (
    <div id='signInButton'>
      <GoogleLogout 
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

