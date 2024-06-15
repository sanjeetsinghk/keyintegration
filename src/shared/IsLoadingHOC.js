import React, { useState } from 'react';
import { CSpinner } from '@coreui/react';
import styled, { css } from "styled-components";
const DarkBackground = styled.div`
  display: none; /* Hidden by default */
  position: fixed; /* Stay in place */
  z-index: 999; /* Sit on top */
  left: 0;
  top: 0;
  width: 100%; /* Full width */
  height: 100%; /* Full height */
  overflow: auto; /* Enable scroll if needed */
  
  background-color: rgb(0 0 0 / 87%); /* Black w/ opacity */

  ${props =>
    props.disappear &&
    css`
      display: block; /* show */
    `}
`;

export  const IsLoadingHOC=(WrappedComponent,loadingMessage)=>{
    function HOC(props){
        const [isLoading,setIsLoading]=useState(false);
        const setLoadingstate=isComponentLoading=>{
            setIsLoading(isComponentLoading);
        }
        return(
            <>
              <DarkBackground disappear={isLoading?true:false}>
                <label  className='_loading_overlay_content'>
                    <CSpinner  style={{ width: '5rem', height: '5rem'}}/>
                    <span className='m-4 p-4'>{loadingMessage}</span>
                </label>
            </DarkBackground>
            <WrappedComponent {...props} setLoading={setLoadingstate}/>
            </>
        )
    }
    return HOC;
}
export default IsLoadingHOC;