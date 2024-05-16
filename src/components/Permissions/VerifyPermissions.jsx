import React from 'react'

function VerifyPermissions({children, expected, received, isExclude = false}) {
  if(expected instanceof Array){
    if(isExclude){
        if(!expected.includes(received)){
            return <>{children}</>
        }
        return null;
    }
    if(expected.includes(received)){
        return <>{children}</>
    }
    return null;
  }
  throw new Error("ERROR: expected should be an Array");
}

export default VerifyPermissions