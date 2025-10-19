import axios from 'axios'
import React, { useEffect } from 'react'
import { useState }  from 'react'
import { backendUrl } from '../App'
import { toast } from 'react-toastify'

function ListProduct({ token: tokenProp }) {

  const [list, setList] = useState([])

  const fetchlist = async () =>{
    try {
      const token = tokenProp || localStorage.getItem('token') || '';
      if (!token) {
        toast.error('Unauthorized: please login as admin first');
        return;
      }
      const response = await axios.get(backendUrl + '/api/product/list', {
        headers: { token },
      })
      if(response.data.success){
        setList(response.data || [])
      }
      console.log(response.data); 
    } catch (error) {
      if (error?.response?.status === 401) {
        toast.error('Unauthorized: invalid or missing admin token');
      } else {
        toast.error(error?.response?.data?.message || 'Failed to fetch products');
      }
    }
  }
useEffect(()=>{
    fetchlist()
    // eslint-disable-next-line react-hooks/exhaustive-deps
}, [tokenProp])
  return (
    <div>

    </div>
  )
}

export default ListProduct