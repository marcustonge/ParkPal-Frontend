import React from 'react';
import { Navigate } from 'react-router-dom';
 
const ProtectedRoute = ({ component: Component, ...props }) => {
 
   function hasJWT() {
       let flag = false;
 
       //check user has JWT token
       localStorage.getItem("token") ? flag=true : flag=false
      
       return flag
   }
 
   return (
        hasJWT() ?
            <Component {...props} />
            :
            <Navigate to={{ pathname: '/login' }} />

   );
};
 
export default ProtectedRoute;