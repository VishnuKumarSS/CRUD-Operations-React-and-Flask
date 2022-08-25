import React , { useEffect , useState }from 'react'

import axios from 'axios'
function GoogleSignIn() {
  // const [ googleData , setGoogleData ] = useState(null);
  useEffect(()=> {
    axios.get('/login/google')
    // .then( res => {
    //   setGoogleData(res)
    //   console.log(res)
    // })
  }, [])
  return (
    <div>
      <>
        {/* {googleData} */}
        hel
      </>
      </div>
  )
}

export default GoogleSignIn