import React, { useEffect, useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CFormLabel,
  CFormTextarea,
  CInputGroup,
  CInputGroupText,
  CRow
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { Form} from 'react-final-form'
import { cilBuilding, cilViewColumn } from '@coreui/icons'
import userService from '../../services/user.service'
import ReactSelect from 'react-select'

const strOpearator=[
  {value:'!=',label:'not equals'},
  {value:'==',label:'equals'},
  {value:'all',label:'All'}
]
const numOpearator=[
  {value:'!=',label:'not equals'},
  {value:'==',label:'equals'},
  {value:'>',label:'greater then'},
  {value:'>=',label:'greater then or equals'},
  {value:'<',label:'less then'},
  {value:'<=',label:'less then or equals'},
]
const actionOperator=[
  {value:'sum',label:'Sum/Total'},
  {value:'avg',label:'Average'},
  {value:'count',label:'Count'},
  {value:'max',label:'Max'},
  {value:'min',label:'Min'},
  {value:'divide',label:'Divide'},
]
const OrgRegistration = () => {
  const [integratedData,setIntegratedData]=useState(null);
  const [conditionStep,setConditionStep]=useState([]);
  const [showCondition,setShowCondition]=useState(false);
  useEffect(()=>{
    userService.GetJSonData().then((res)=>{
      console.log(res.data);
      if(res && res.data){
        setIntegratedData(res.data);
        let keys =Object.keys(res.data).map((x)=>{
          return { value: x, label: x }
        });
        let data=[{
          type:'',
          kpiName:'',
          description:'',
          conditionalSteps:[{          
            keys:keys,
            jsonData:res.data,
            operator:null,
            selectedOperator:null,
            selectedKey:null,
            selectedValue:null,
            selectedValueType:null,
            isObjectLevel:true,
            isValueLevel:false,
            valueType:null,
            filteredValue:null,
            isLastItem:false,
            result:null
          }],
          actionItem:null
      }]
        setConditionStep(data);
      }
    })
  },[])
    const getKeys=(arrayValue)=>{
        return Object.keys(arrayValue).map((item)=>{
          return {
            value: item, label: item
          }
        })
    }
    const getValues=(arrayValue)=>{
      return Object.values([...new Set(arrayValue)]).map((item)=>{
        return {
          value: item, label: item
        }
      })
    }
    const getCollectedValues=(arrayValue,selectedOption)=>{
      let data=[];
      arrayValue.forEach((item)=>{
        if(item && item.length && Array.isArray(item)){
          item.forEach((_item)=>{
            //let mappedValues=_item.map((x)=> {return {label:x[selectedOption],value:x[selectedOption]}});
            data.push(_item[selectedOption]);
          })
        }
      })
      
      data=[...new Set(data)];
      console.log(data)
      return data;
    }
    //to check if selected key exist in main object or children object and return accordingly
    const getDetailsObjectKeys=(data,event)=>{
      let result =data.map((x)=>{return x[event.value]})
      console.log(result);
      let innerData=[];
      if(result && result.length && result.every((x)=>x==undefined) ){
        data.forEach((item)=>{
          innerData.push(...item.details.map((x)=>{return x[event.value]}))
        })
      }
      else{
        innerData=result;
      }
      console.log(innerData);
      return innerData;
    }
   // private method to process the next event on selected key
    const getJsonSelectedKeys=(data,index,event)=>{
      let selectedKeyValues=data[index].jsonData[event.value];
      let isObject=typeof(selectedKeyValues) == 'object';
      let isObjArray= typeof(selectedKeyValues) == 'object' && Array.isArray(selectedKeyValues);          

      let arrayValues=Array.isArray(data[index].jsonData)
        ? getDetailsObjectKeys(data[index].jsonData,event)
         //data[index].jsonData.map((x)=>{return x[event.value]}) 
         :undefined;
      let isArrayValueOfTypeObj=(arrayValues && arrayValues.length && !arrayValues.every((item)=>item==undefined) &&typeof(arrayValues[0][0])=='object');
        //arrayValues= typeof(arrayValues[0])=='object'?getKeys(arrayValues[0]):arrayValues
        if(arrayValues && arrayValues.length && arrayValues.every((item)=>item==undefined)){
          arrayValues=getCollectedValues(data[index].jsonData,event.value);
        }
        data[index].selectedKey=event;
        data[index].selectedKeyValues=isObject && isObjArray 
        ? getKeys(selectedKeyValues[0])
        : isObject? Object.keys(selectedKeyValues)
        : selectedKeyValues;           
        data[index].selectedValueType=isObjArray && isObject ? 'array':'text';
        data.splice(index+1);

        if(typeof(selectedKeyValues)=='object' && Array.isArray(selectedKeyValues) || (arrayValues && arrayValues.length)){
          let keys=arrayValues? isArrayValueOfTypeObj ?getKeys(arrayValues[0][0]):getValues(arrayValues):getKeys(selectedKeyValues[0]);
          data.push({
            jsonData: selectedKeyValues == undefined 
              ? isArrayValueOfTypeObj 
              ? arrayValues
              : (Array.isArray(data[index].jsonData) &&!selectedKeyValues)
              ? data[index].jsonData: selectedKeyValues
              :selectedKeyValues,
            keys:keys,
            selectedKey:(arrayValues && !isArrayValueOfTypeObj)?data[index].selectedKey:null,
            selectedValue:null,
            selectedValueType:null,
            selectedOperator:null,
            isObjectLevel:(!arrayValues || isArrayValueOfTypeObj)?true:false,
            isValueLevel:(arrayValues && !isArrayValueOfTypeObj)?true:false,
            operator:null,
            valueType:(arrayValues && !isArrayValueOfTypeObj)?
            keys.every((x)=>!isNaN(parseInt(x))=='number')?'number':'string':null,
            filteredValue:null,
            isLastItem:false,
            result:null
          })
        }
      return data;
    }
    //to calculate the final result based on operator
    const getCalculatedResult=(data,index,event,_selectedOperator)=>{
      let result=0;
      if(event!=null){
        switch(_selectedOperator.value){
          case "sum":            
              data[index].jsonData.forEach((x)=>{
                result+=x[event.value];
              })
              
            break;
          case "count":
          result=data[index].jsonData.length;
          break;
          case "max":
          result=Math.max(...data[index].jsonData.map((x)=>x[event.value]));
          break;
          case "min":
          result=Math.min(...data[index].jsonData.map((x)=>x[event.value]))
          break;
          case "avg":
          
            data[index].jsonData.forEach((x)=>{
              result+=x[event.value];
            });
            result=(result/data[index].jsonData.length);
          break;
        }
      }
      return result;
    }
    //to filter the result based on operator on selected Key=>Value
    const getFilteredResults=(jsonData,selectedKey,selectedValue,selectedOperator)=>{
      let result=[];
      if(selectedKey=='type' && selectedOperator.value=='all'){
          jsonData.forEach((x)=>{

            if(typeof(x)=='object' && !Array.isArray(x) && !Object.keys(x).includes('details'))// this is to push the direct details inner array
              result.push(x)
            else// this is to push complete details attay
              result.push(...x.details)
          })
        return result;
      }
     
      switch(selectedOperator.value){
        case "==":
          result= jsonData.filter((x)=>x[selectedKey]==selectedValue);
        break;
        case "!=":
          result= jsonData.filter((x)=>x[selectedKey]!=selectedValue);
        break;
        case "all":
          result= jsonData;
        break;
      }
      return result;
    }
    //to process the next operation based on selected key
    const getOnSelectedValue=(data,index,event)=>{
      data[index].selectedValue=event; 
      let selectedOperator=data[index].selectedOperator.value;
      if(!data[index].isLastItem)
        {  
        if(data[index].jsonData && data[index].jsonData.length==0){
          data[index].jsonData=data[index-1].jsonData
        }
        let filtered=getFilteredResults( data[index].jsonData,data[index].selectedKey.value,event?.value,data[index].selectedOperator);
       
        data[index].filteredValue=filtered;
        data[index].jsonData=filtered;
        //data[index].selectedKey=getKeys(filtered);
        let actionItem=null;
        let isLastItem=false;
        if(filtered && filtered.length>0 && typeof(filtered[0])=='object'){
          if (Object.keys(filtered[0]).includes('details') ) {
            actionItem=getKeys(filtered[0].details[0]);
          }
          else if(Object.keys(filtered[0]).includes('type') && Object.keys(filtered[0]).includes('netValues')){
            actionItem=getKeys(filtered[0]);
            isLastItem=true;
          }
          console.log(actionItem);
          data.push({
            jsonData:isLastItem ?filtered:selectedOperator=='all'?filtered:filtered[0].details ,
            keys:actionItem,
            selectedKey:null,
            selectedValue:null,
            selectedValueType:null,
            selectedOperator:null,
            isObjectLevel:isLastItem?false:true,
            isValueLevel:isLastItem?true:false,
            operator:null,
            valueType:null,
            filteredValue:null,
            isLastItem:isLastItem?true:false,
            result:null
          })
        }
        console.log("==============filtered",filtered)
        // originalCondition[pIndex].conditionalSteps=data;
        // console.log("==============filtered",filtered)
        // setConditionStep([...originalCondition]);
      }
      else{
        data[index].selectedValue=event;
        let _selectedOperator=data[index].selectedOperator;
        data[index].result=getCalculatedResult(data,index,event,_selectedOperator)
        // originalCondition[pIndex].conditionalSteps=data;
        //   //console.log("==============filtered",filtered)
        //   setConditionStep([...originalCondition]);
      }
      return data;
    }
    //on drop down selection
    const onSelectedKey =(event,key,item,pIndex,index) => {
      console.log(event);
      let data=conditionStep[pIndex].conditionalSteps;
      let originalCondition=conditionStep;
      switch(key){
        case "key":         
          let filteredObject=getJsonSelectedKeys(data,index,event)
          originalCondition[pIndex].conditionalSteps=filteredObject;
          setConditionStep([...originalCondition]);           
        break;
        case "operator":                
          if(event.value=='all'){
            data.splice(index+1);  
            data[index].selectedOperator=event;
            let value=data[index].selectedValue;
            let _filteredData=getOnSelectedValue(data,index,data[index].selectedKey); 
            _filteredData[index].selectedValue=null;      
            originalCondition[pIndex].conditionalSteps=_filteredData;   
          }
          else
          {
            data[index].selectedOperator=event;
            data[index].selectedValue=null;
            data.splice(index+1);//remove the remaining steps            
            originalCondition[pIndex].conditionalSteps=data;
            if(data[index].isLastItem){
              data[index].result=getCalculatedResult(data,index,data[index].selectedValue,data[index].selectedOperator)
            }
          }
          setConditionStep([...originalCondition])
        break;
        case "value":   
        data.splice(index+1);
        let _filteredData=getOnSelectedValue(data,index,event);       
          originalCondition[pIndex].conditionalSteps=_filteredData;       
          setConditionStep([...originalCondition]);
        break;
      }
        console.log("==============originalCondition",originalCondition);
    }
  const onShowCondition=()=>{
    setShowCondition(true);
  }
  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row mt-1 ml-0">
      <CContainer>
        <CRow className="">
          <CCol md={9} lg={7} xl={12} className='p-0'>
            <CCard className="">
              <CCardBody className="p-4">
                
                  <h3>Save/Update</h3>
                  <p className="text-body-secondary">Manange your KPIs</p>
                  <CRow>
                    <CCol xl={3}>
                      <CButton color="link" onClick={onShowCondition}>Add Condition</CButton>
                    </CCol>
                  </CRow>
                    {
                      showCondition && conditionStep.map((innerStep,pIndex)=>{
                        return(
                        < >
                         
                            <CRow key={(pIndex+12)}>
                              <CCol xl={6}>
                                <CInputGroup   className='mb-3'>
                                  <CInputGroupText>
                                    <CIcon icon={cilViewColumn}/>  
                                  </CInputGroupText>        
                                  <CFormInput 
                                    type='text'
                                    placeholder='Enter Type' /> 
                                </CInputGroup>
                              </CCol>
                              <CCol xl={6}>
                                <CInputGroup   className='mb-3'>
                                  <CInputGroupText>
                                    <CIcon icon={cilViewColumn}/>  
                                  </CInputGroupText>        
                                  <CFormInput 
                                    type='text'
                                    placeholder='Enter KPI Name' /> 
                                </CInputGroup>
                              </CCol>
                              <CCol xl={12}>
                                <CInputGroup   className='mb-3'>
                                  <CInputGroupText>
                                    <CIcon icon={cilViewColumn}/>  
                                  </CInputGroupText>        
                                  <CFormTextarea                          
                                    placeholder='Enter Description' /> 
                                </CInputGroup>
                              </CCol>
                            </CRow>
                            <CRow key={(pIndex+122)}>
                            <CCol><h4>IF/Then</h4></CCol>
                          </CRow>
                            <CRow key={(pIndex+13)}>
                              {
                                innerStep.conditionalSteps.map((step,index)=>{
                                  return(
                                    <>
                                   
                                    {
                                      (step.valueType =='number'|| step.valueType =='string' || step.isLastItem)&&
                                      <CCol xl={3} key={index+1} className='mt-1 '> 
                                        {step.valueType =='string' &&
                                          <ReactSelect className='operator' defaultValue={step.selectedOperator}  options={strOpearator} onChange={(e) => onSelectedKey(e,'operator',innerStep,pIndex,index)}></ReactSelect>                     
                                        }
                                        {step.valueType =='number' &&
                                          <ReactSelect className='operator' defaultValue={step.selectedOperator} options={numOpearator} onChange={(e) => onSelectedKey(e,'operator',innerStep,pIndex,index)}></ReactSelect>
                                        }
                                        {step.isLastItem &&
                                          <ReactSelect className='action-operator' defaultValue={step.selectedOperator} options={actionOperator} onChange={(e) => onSelectedKey(e,'operator',innerStep,pIndex,index)}></ReactSelect>
                                        }
                                      </CCol>
                                    }                          
                                    <CCol xl={3} key={index+2} className='mt-1'> 
                                      {step.isObjectLevel &&                
                                        <ReactSelect isDisabled={step.selectedOperator?.value=='all'} className='object-select' defaultValue={step.selectedKey}  options={step.keys} onChange={(e) => onSelectedKey(e,'key',innerStep,pIndex,index)}></ReactSelect>
                                      }
                                       {step.isValueLevel &&                
                                        <ReactSelect isDisabled={step.selectedOperator?.value=='all'} className='value-select' defaultValue={step.selectedValue}  options={step.keys} onChange={(e) => onSelectedKey(e,'value',innerStep,pIndex,index)}></ReactSelect>
                                      }
                                     
                                    </CCol>
                                    {
                                        step.result!=null&&
                                        <CCol  xl={3} key={index+3} className='mt-1'>
                                           <CInputGroup>
                                           <CFormLabel><strong>Result: </strong></CFormLabel>
                                              <CFormInput 
                                              type='text'
                                              value={step.result} readOnly/> 
                                           </CInputGroup>
                                         
                                        </CCol>
                                        
                                      }
                                    </>
                                  )
                                })
                              }
                            
                            </CRow>
                        </>)
                      })
                    }
                  <CRow className='float-end mt-3'>
                    <CCol xl={12} >
                      <CButton color="primary">Save KPIs</CButton>
                    </CCol>
                  </CRow>
                  
              </CCardBody>
            </CCard>
          </CCol>
        
        </CRow>
      </CContainer>
    </div>
  )
}

export default OrgRegistration
