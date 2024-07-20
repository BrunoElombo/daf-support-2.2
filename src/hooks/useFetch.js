import React, {useState, useEffect} from 'react'

function useFetch() {

    const [ requestLoading, setRequestLoading ] = useState(false);
    const [requestError, setRequestError] = useState("");

    const fetchData = async (url) => {
      setRequestError("");
      setRequestLoading(true);

      let headersList = {
        "Accept": "*/*",
        "Authorization": "Bearer "+localStorage.getItem("token"),
        mode: 'cors'
      }

      try {
        const response = await fetch("https://cors-anywhere.herokuapp.com/ "+url, { 
          method: "GET",
          headers: headersList
        });
        if (!response.ok) {
          setRequestError(`Request failed with status ${response.status}`);
          const errorText = await response.text(); 
          throw new Error(`Error: ${errorText}`); 
        }
        const result = await response.json();
        result.status = response.status
        return result;

      } catch (error) {
        setRequestError(error);
        return requestError
      }finally{
        setRequestLoading(false);
      }
    };


    const postData = async (url, data = {}, withAuth = true) => {
      setRequestError("");
      setRequestLoading(true);
    
      const headers = {
        Accept: "*/*",
        "Content-Type": "application/json",
        mode: 'cors'
      };
    
      if (withAuth) {
        const token = localStorage.getItem("token");
        if (token) {
          headers.Authorization = `Bearer ${token}`;
        } else {
          setRequestError("Missing authorization token");
          throw new Error(`Error: Missing authorization token`);
        }
      }

      try {
        const response = await fetch("https://cors-anywhere.herokuapp.com/ "+url, {
          method: "POST",
          headers,
          body: JSON.stringify({ ...data }),
        });
    
        if (!response.ok) {
          setRequestError(`Request failed with status ${response.status}`);
          const errorText = await response.json();
          throw new Error(`Error: ${errorText}`);
        }
        setRequestError("Error");
        const result = await response.json();
        result.status = response.status
        return result;
      } catch (error) {
        setRequestError(error.message);
        throw new Error(`Error: ${error}`);
      } finally {
        setRequestLoading(false);
      }
    };
    
    const updateData = async (url, data={}, withAuth=true) => {
      setRequestError("");
      setRequestLoading(true);
        let headersList = {
          "Authorization": (withAuth ? "Bearer "+localStorage.getItem("token") : ""),
          "Content-Type": "application/json",
            mode: 'cors'
        }
        
        try {
          const response = await fetch("https://cors-anywhere.herokuapp.com/ "+url, {
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