import { cilBrowser, cilBuilding, cilUser } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import React, { useEffect, useState } from 'react'
const GetReactIcons = (props)=>{
    const {iconType}=props;
   
    const getIcon=()=>{
        switch(iconType){
            case "cilBuilding":
                return <CIcon icon={cilBuilding}/>
            break;
            case "cilBrowser":
                return <CIcon icon={cilBrowser}/>
                break;
            default:
                return <CIcon icon={cilUser}/>
            break;
        }
    }
    return(
        <>
        {iconType && getIcon()}
        </>
    )
   
}

export default GetReactIcons;