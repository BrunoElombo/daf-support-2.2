import React, {useState, useEffect} from 'react';

function useFetch() {
    const [ requestLoading, setRequestLoading ] = useState(false);
    const [requestError, setRequestError] = useState("");
    

    const fetchData = async (url) => {
      setRequestError("");
      setRequestLoading(true);

      let headersList = {
        "Accept": "*/*",
        "Authorization": "Bearer "+localStorage.getItem("token"),
      }

      try {
        const response = await fetch(url, { 
          method: "GET",
          headers: headersList
        });
        if (!response.ok) {
          setRequestError(`Request failed with status ${response.status}`);
          const errorText = await response.text(); 
          throw new Error(`Error: ${errorText}`); 
        }
        const result = await response.json();
        return result;

      } catch (error) {
        setRequestError(error);
        return requestError
      }finally{
        setRequestLoading(false);
      }
    };

    const postData = async (url, data={}, withAuth=true) => {
      let body = JSON.stringify(data);
      let requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body
      };
      if(withAuth) requestOptions.headers.Authorization = "Bearer " + localStorage.getItem("token")
      
      let response = await fetch(`${url}`, requestOptions);
      let result = await response.json();
      return result;
    };
    
    const updateData = async (url, data={}, withAuth=true) => {
      setRequestError("");
      setRequestLoading(true);
        let headersList = {
          "Authorization": (withAuth ? "Bearer "+localStorage.getItem("token") : ""),
          "Content-Type": "application/json"
        }
        
        try {
          const response = await fetch(url, {
            method: "PATCH",
            headers: headersList,
            body: JSON.stringify({...data})
          });
          if(!response.ok){
            setRequestError("Failed to update");
            throw new Error(`Error: Failed to update`);
          }
          setRequestError("");
          let result = await response.json();
          // let data = await result ;
          result.status = response.status
          return result;
          // throw new Error
        } catch (error) {
          setRequestError(error.message);
          throw new Error(`Failed to server error`);
        } finally {
          setRequestLoading(false);
        }
  
    };

    return {requestLoading, fetchData, postData, requestError, updateData}
}

export default useFetch