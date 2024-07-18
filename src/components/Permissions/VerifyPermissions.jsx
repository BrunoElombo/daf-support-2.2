import React from 'react'

function VerifyPermissions({children, expected, roles, functions, isExclude = false}) {
  if(expected instanceof Array){

    if(isExclude){
      if((!expected.includes(roles) || !expected.includes(functions)) && (roles === null || functions ===null)){
        return <>{children}</>
      }
      return null;
    }

    if(expected.includes(roles) || expected.includes(functions)){
      return <>{children}</>
    }
    return null;
  }
  throw new Error("ERROR: expected should be an Array");
}

export default VerifyPermissions