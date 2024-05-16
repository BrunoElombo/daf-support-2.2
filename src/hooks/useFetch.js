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
      }
      try {
        const response = await fetch(url, { 
          method: "GET",
          headers: headersList
        });
        if (!response.ok) {
          // Handle non-200 status codes gracefully
          setRequestError(`Request failed with status ${response.status}`);
          const errorText = await response.text(); // Or response.json() if applicable
          throw new Error(`Error: ${errorText}`); // Or return an error object
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


    const postData = async (url, data = {}, withAuth = true) => {
      setRequestError("");
      setRequestLoading(true);
    
      const headers = {
        Accept: "*/*",
        "Content-Type": "application/json",
      };
    
      if (withAuth) {
        const token = localStorage.getItem("token");
        if (token) {
          headers.Authorization = `Bearer ${token}`;
        } else {
          // Handle missing token scenario (e.g., log a warning or return an error)
          console.warn("Authorization token missing in localStorage");
          setRequestError("Missing authorization token");
          setRequestLoading(false);
          throw new Error(`Error: Missing authorization token`);
        }
      }

      try {
        const response = await fetch(url, {
          method: "POST",
          headers,
          body: JSON.stringify({ ...data }),
        });
    
        if (!response.ok) {
          // Handle non-200 status codes gracefully
          setRequestError(`Request failed with status ${response.status}`);
          const errorText = await response.text(); // Or response.json() if applicable
          throw new Error(`Error: ${errorText}`); // Or return an error object
        }
    
        const result = await response.json();
        return result;
      } catch (error) {
        setRequestError(error.message);
        return error; // Or throw the error for further handling
      } finally {
        setRequestLoading(false);
      }
    };
    
    const updateData = async (url, data={}, withAuth=true) => {
      setRequestError("");
      setRequestLoading(true);
        let headersList = {
          "Accept": "*/*",
          "Authorization": (withAuth ? "Bearer "+localStorage.getItem("token") : ""),
          "Content-Type": "application/json"
        }
        
        console.log({
          method: "POST",
            headers: headersList,
            body: JSON.stringify({
              ...data
            })
        })
        try {
          const response = await fetch(url, {
            method: "PATCH",
            headers: headersList,
            body: JSON.stringify({
              ...data
            })
          });
          console.log(response);
          if(!response.ok){
            console.warn("FAiled to update");
            setRequestError("FAiled to update");
            setRequestLoading(false);
            throw new Error(`Error: Failed to update`);
          }
          let result = await response.json();
          // let data = await result ;
          return result;
          // throw new Error
          // setRequestError("Cant create request")
        } catch (error) {
          setRequestError(error.message);
          setRequestLoading(false);
          throw new Error(`Failed to server error`);
        } finally {
          setRequestLoading(false);
        }
  
    };


    return {requestLoading, fetchData, postData, requestError, updateData}
}

export default useFetch