import React, { useEffect, useRef, useState } from 'react'
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
  CRow,
  CToast,
  CToastBody,
  CToastHeader,
  CToaster,CNav,
  CNavItem,CNavLink,CTabContent,CTabPane
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { Form} from 'react-final-form'
import { cilBuilding, cilViewColumn } from '@coreui/icons'
import userService from '../../services/user.service'
import ReactSelect from 'react-select'

const formula={
  selectedId:null,
  selectedType:null,
  selectedOperator:null,
  selectedTypeValue:null,
  selectedResult:null,
  selectedTypeAction:null,
  Type:null,
  KPIName:null,
  Description:null,
  operationBetweenItems:{
    item1:null,
    item2:null,
    operator:null
  }
};
const strOpearator=[
  // {value:'!=',label:'not equals'},
  {value:'==',label:'equals'}
  // {value:'all',label:'All'}
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
  {value:'min',label:'Min'}
]
const formulaOperator=[
  {value:'sum',label:'Sum/Total'},
  {value:'subtract',label:'Deduction'},
  {value:'avg',label:'Average'},
  {value:'count',label:'Count'},
  {value:'max',label:'Max'},
  {value:'min',label:'Min'},
  {value:'divide',label:'Divide'},
  {value:'multiply',label:'Multiply'}
]
const initialMessage="Please Capture the Kpis infor first (Type,Name,Description)";
const OrgRegistration = () => {
  const [activeKey, setActiveKey] = useState(1);
  const [integratedData,setIntegratedData]=useState(null);
  const [predefinedFormula,setPredefinedFormula]=useState(null);
  const [conditionStep,setConditionStep]=useState([]);
  const [showFormulationStep,setFormulationStep]=useState(false);
  const [showCondition,setShowCondition]=useState(false);
  const [isFormulaModified,setIsFormulaModified]=useState(false);
  const [savedKpis,setSavedKpis]=useState([]);
  const [kpisList,setKpisList]=useState([]);
  const [kpisFormula,setKpisFormula]=useState({
    operand1:null,
    operator:null,
    operand2:null,
    case:null,
    id:null
  });
  const [toast, addToast] = useState(0)
  const toaster = useRef()
  const typeRef=useRef(null);
  const nameRef=useRef(null);
  const descriptionRef=useRef(null);
  const [errorMessage,setErrorMessage]=useState(initialMessage);
  const [isOutputSavedSuccessFullt,setIsOutputSaved]=useState(false);
  useEffect(()=>{
    userService.GetJSonData().then((res)=>{
      console.log(res.data);
      if(res && res.data){
        if(res.data.formula!=null){
          setPredefinedFormula(JSON.parse(res.data.formula));         
        }
        setIntegratedData(res.data.model);
        setInitialData(res.data.model)
      }
    })
  },[])
  const getFilteredKeysForSelect=(keys,isLastItem)=>{
    let _keys=keys;
    if(keys.filter((x)=>x.value=='ownerID').length>0){
      if(isLastItem)
        _keys=keys.filter((x)=>x.value=='netValues');
      else
      _keys=keys.filter((x)=>x.value=='type');
      return _keys;
    }
  }
  const setInitialData=(initialData)=>{
    let keys =Object.keys(initialData).map((x)=>{
      return { value: x, label: x }
    }).filter((x)=>x.value=='cases');
    let data=[{
      type:'',
      kpiName:'',
      description:'',
      caseValue:null,
      conditionalSteps:[{          
        keys:keys,
        jsonData:initialData,
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
          keys:(keys.filter((_itemx)=>_itemx.value=='caseID').length>0) ?keys.filter((_itemx)=>_itemx.value=='caseID'):keys,
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
    let caseValue=null;
    if(data[index].selectedKey?.value=='caseID'){
      data[index].caseValue=data[index].selectedValue?.value;
      caseValue= data[index].caseValue;
    }
    if(data[index-1].caseValue){
      caseValue= data[index-1].caseValue;
    }
    if(!data[index].isLastItem)
      {  
      if(data[index].jsonData && data[index].jsonData.length==0 || (selectedOperator!='all')){
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
          keys:getFilteredKeysForSelect(actionItem,isLastItem),
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
          result:null,
          caseValue:caseValue
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
          data[index].jsonData= data[index-1].jsonData          
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
        if(_filteredData[index].caseValue)
        {
          originalCondition[pIndex].caseValue=_filteredData[index].caseValue;
        }
             
        originalCondition[pIndex].conditionalSteps=_filteredData;       
        setConditionStep([...originalCondition]);
      break;
    }
      console.log("==============originalCondition",originalCondition);
  }
  const onShowCondition=()=>{
    setShowCondition(true);
    setFormulationStep(false);
  }
  const inputUpdate=(e,pIndex,type)=>{
    let _conditionalStep=conditionStep;
    switch(type){
      case "type":
        _conditionalStep[pIndex].type=e.target.value;
        break;
      case "name":
        _conditionalStep[pIndex].kpiName=e.target.value;
        break;
      case "description":
        _conditionalStep[pIndex].description=e.target.value;
        break;
    }
    setConditionStep([..._conditionalStep])
  }
  const saveKpis=()=>{
    if(!typeRef.current.value || !nameRef.current.value || !descriptionRef.current.value)
      {
        setErrorMessage(initialMessage);
        addToast(exampleToast);
      }
      else
      {
        if(savedKpis.filter((x)=>x.kpiName==nameRef.current.value).length>0)
        {
          setErrorMessage("KPI Name "+nameRef.current.value+" already existed, Please choose another name");
          addToast(exampleToast);
        }
        else{
          let _conditionalSteps=conditionStep;
          let _savedKpis=savedKpis;
          _savedKpis.push(..._conditionalSteps);
          setSavedKpis([..._savedKpis]);
          setInitialData(integratedData);
          setFormulationStep(false);
          typeRef.current.value=null;
          nameRef.current.value=null;
          descriptionRef.current.value=null;
        }
      }
  }
  const onShowFormulaCondition=()=>{
    if(savedKpis && savedKpis.length>0){
      setFormulationStep(true);
      setShowCondition(false);
      let _savedKpis=savedKpis;
      let kpiList=[];
      _savedKpis.forEach((x)=>{
        let lastItem=x.conditionalSteps.length-1;
        let kpiName=x.kpiName
        let result=x.conditionalSteps[lastItem].result;
        kpiList.push({value:result,label:kpiName+' ('+result+')',case:x.caseValue,id:x.kpiName})
      });
      setKpisList([...kpiList]);
    }

  }
  const bindSavedKpisData=(kpis,index)=>{
    let lastItem=kpis.conditionalSteps.length-1;
    return(
      <CRow>        
        <CCol className='text-end'>{index+1} / {kpis.type} / {kpis.kpiName} / {kpis.description} <strong>Result: {kpis.conditionalSteps[lastItem].result}</strong></CCol>       
      </CRow>
    )
  }
  const exampleToast = (
    <CToast>
      <CToastHeader closeButton>
        <svg
          className="rounded me-2"
          width="20"
          height="20"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid slice"
          focusable="false"
          role="img"
        >
          <rect width="100%" height="100%" fill={'red'}></rect>
        </svg>
        <div className="fw-bold me-auto">{'Error While Saving'}</div>
        <small>now</small>
      </CToastHeader>
      <CToastBody>{errorMessage}</CToastBody>
    </CToast>
  )
  const exampleToastSuccess = (
    <CToast>
      <CToastHeader closeButton>
        <svg
          className="rounded me-2"
          width="20"
          height="20"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid slice"
          focusable="false"
          role="img"
        >
          <rect width="100%" height="100%" fill={'green'}></rect>
        </svg>
        <div className="fw-bold me-auto">{' Success'}</div>
        <small>now</small>
      </CToastHeader>
      <CToastBody>{'Response and Formula saved successfully'}</CToastBody>
    </CToast>
  )
  const onSelectedOperand=(e,type)=>{
    let _kpisFormula=kpisFormula;
    switch(type){
      case "operand1":
        _kpisFormula.operand1=e;
        _kpisFormula.case=e.case;
        _kpisFormula.id=e.id;
        break;
      case "operand2":
        _kpisFormula.operand2=e;
        break;
      case "operator":
        _kpisFormula.operator=e;
        _kpisFormula.case=e.case;
        _kpisFormula.id=e.id;
        break;
    }
    setKpisFormula({..._kpisFormula})
  }
  //saved the kpis after the calculation of 2 kpis 
  const saveFormulatedKpis=()=>{
    if(!typeRef.current.value || !nameRef.current.value || !descriptionRef.current.value)
      {
        setErrorMessage(initialMessage);
        addToast(exampleToast)
      }
      else
      {
        if(savedKpis.filter((x)=>x.kpiName==nameRef.current.value).length>0)
          {
            setErrorMessage("KPI Name "+nameRef.current.value+" already existed, Please choose another name");
            addToast(exampleToast);
          }
          else{
            let data={
              type:typeRef.current.value,
              kpiName:nameRef.current.value,
              description:descriptionRef.current.value,
              caseValue:kpisFormula.operand1.case,
              conditionalSteps:[{          
                keys:null,
                jsonData:{case:kpisFormula.case,operand1:kpisFormula.operand1.id,operator:kpisFormula.operator,operand2:kpisFormula.operand2.id},
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
                result:getFormulatedResult()
              }],
              actionItem:null
            } 
            let _savedKpis=savedKpis;
            _savedKpis.push(data);
            setSavedKpis([..._savedKpis]);
            setInitialData(integratedData);        
            typeRef.current.value=null;
            nameRef.current.value=null;
            descriptionRef.current.value=null;  
            setFormulationStep(false);
            onShowFormulaCondition();
          }
      }
  }
  //calculate the result between 2 kpis
  const getFormulatedResult=()=>{
    let result=0;
    let operand1=parseFloat(kpisFormula.operand1.value);
    let operand2=parseFloat(kpisFormula.operand2.value);
    switch(kpisFormula.operator.value){
      case'sum':
          result=operand1+operand2;
        break;
      case 'subtract':
        result=operand1-operand2;
        break;
      case'avg':
          result=(operand1+operand2)/2;
        break;
      case'count':
          result=2;
        break;
      case'max':
          result=Math.max(operand1,operand2);
        break;
      case'min':
          result=Math.min(operand1,operand2);
        break;
      case'divide':
          result=(operand1/operand2);
        break;
      case'multiply':
          result=(operand1*operand2);
        break;
    }
    return result;
  }

  const genrateFormulaCases=()=>{
    let responseData=integratedData;
    let totalCases=[...new Set(savedKpis.map((x)=>x.caseValue))]
    let _formulaList=[];
    let actionOperators=actionOperator.map((x)=>x.value);
    if(totalCases && totalCases.length==1){
      savedKpis.forEach((x)=>{
        if(true){
          let _formula={...formula};
          let _case=x.caseValue;
          //to get the case type value and operator
          let selectedType= x.conditionalSteps.filter((x)=>x.selectedKey?.value=='type' 
            && x.selectedOperator?.value=='==' 
            && x.selectedValue?.value);
          //to get the  applied Actions
          let appliedAction= x.conditionalSteps.filter((x)=>x.selectedKey==null 
          && actionOperators.includes(x.selectedOperator?.value)
          && x.selectedValue?.value);
          let caseActionFilters=[];         

          if(selectedType && selectedType.length && appliedAction && appliedAction.length){
            
            _formula.selectedId=x.kpiName;
            _formula.Type=x.type,
            _formula.KPIName=x.kpiName,
            _formula.Description=x.description,
            _formula.selectedType=selectedType[0].selectedKey.value;
            _formula.selectedOperator=selectedType[0].selectedOperator.value;
            _formula.selectedTypeValue=selectedType[0].selectedValue.value;
            _formula.selectedTypeAction=appliedAction[0].selectedOperator.value;  
            _formula.operationBetweenItems=null;          
            _formulaList.push(_formula);           
          }
          if(x.conditionalSteps.length==1 && x.conditionalSteps[0].jsonData && x.conditionalSteps[0].jsonData?.operand1  && x.conditionalSteps[0].jsonData?.operand2)
          {
            _formula.selectedId=x.kpiName;
            _formula.Type=x.type,
            _formula.KPIName=x.kpiName,
            _formula.Description=x.description,
            _formula.operationBetweenItems.item1= x.conditionalSteps[0].jsonData?.operand1;
            _formula.operationBetweenItems.item2= x.conditionalSteps[0].jsonData?.operand2;
            _formula.operationBetweenItems.operator= x.conditionalSteps[0].jsonData?.operator;
            _formulaList.push(_formula);
          }
        }
      });
    console.log(_formulaList)
    }
    else
    {
      setErrorMessage("Please create one case formula and apply to rest of cases");
      addToast(exampleToast)
    }
    return _formulaList;
  }
  const genrateFormulanSaveCases=(isformulaModied=false)=>{
    let formulaExp=isformulaModied?predefinedFormula:genrateFormulaCases();
    let responseData=integratedData;
    if(formulaExp && formulaExp.length>0){
     
      responseData.cases.forEach((item)=>{
        //delete x.item;
        let list=[];
        formulaExp.forEach((x,index)=>{
          let filterResult=[];
          let calculatedResult=0;
          if(x.selectedType && x.selectedOperator && x.selectedTypeValue && x.selectedTypeAction){
            switch(x.selectedOperator){
              case "==":
                filterResult= item.details.filter((obj)=>obj[x.selectedType]==x.selectedTypeValue)
                break;
            }
            switch(x.selectedTypeAction){
              case "sum":            
                filterResult.forEach((sum)=>{
                  calculatedResult+=sum['netValues'];
                })                  
                break;
              case "count":
                calculatedResult=filterResult.length;
              break;
              case "max":
                calculatedResult=Math.max(...filterResult.map((x)=>x['netValues']));
              break;
              case "min":
                calculatedResult=Math.min(...filterResult.map((x)=>x['netValues']))
              break;
              case "avg":
              
              filterResult.forEach((avg)=>{
                  calculatedResult+=avg['netValues'];
                });
                calculatedResult=(calculatedResult/filterResult.length);
              break;
            }
            list.push({
              KPIID:'KPI00'+(index+1),
              Type:x.Type,
              KPIName:x.KPIName,
              Description:x.Description,
              Value:calculatedResult
            })
            console.log("case ID "+x.caseID+" with Result "+calculatedResult);
          }
          
          if(x.operationBetweenItems?.item1 && x.operationBetweenItems?.item2 && x.operationBetweenItems?.operator){
            let item1Value=list.filter((inner)=>inner.KPIName==x.operationBetweenItems.item1)[0]?.Value;
            let item2Value=list.filter((inner)=>inner.KPIName==x.operationBetweenItems.item2)[0]?.Value;
            switch(x.operationBetweenItems.operator.value){
              case "sum":            
                calculatedResult=item1Value+item2Value;                 
                break;
              case "subtract":
                calculatedResult=item1Value-item2Value;
              break;
              case "count":
                calculatedResult=2;
              break;
              case "max":
                calculatedResult=Math.max(item1Value,item2Value);
              break;
              case "min":
                calculatedResult=Math.min(item1Value,item2Value)
              break;
              case'divide':
                calculatedResult=(item1Value/item2Value);
                break;
              case'multiply':
                calculatedResult=(item1Value*item2Value);
              break;
              case "avg":              
                calculatedResult=item1Value+item2Value;
                calculatedResult=(calculatedResult/2);
              break;
            }
            list.push({
              KPIID:'KPI00'+(index+1),
              Type:x.Type,
              KPIName:x.KPIName,
              Description:x.Description,
              Value:calculatedResult
            })
          }

        })
        delete item.details;
        item.KPIs=list
        console.log(list)
      })
       userService.SaveJsonResponse({formula:formulaExp,JsonData:responseData}).then((res)=>{     
        if(res && res.data){
          setErrorMessage("Formula and Generated JSON is saved successfully");
         
          addToast(exampleToastSuccess);
         

        }
      })
    }
  }
 
  const onPreFormulaSelectedOperator=(event,key)=>{
    let preFormula=predefinedFormula;
    let index=preFormula.findIndex((x)=>x.selectedId==key.selectedId);
    if(key.operationBetweenItems==null)
    {
      preFormula[index].selectedTypeAction=event.value
    }
    else
    {
      preFormula[index].operationBetweenItems.operator=event;
    }
    setPredefinedFormula([...preFormula]);
    setIsFormulaModified(true);
  }
  const onModiedNSaveFormula=()=>{
    genrateFormulanSaveCases(true);
  }
  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row mt-1 ml-0">
      <CContainer>
        <CRow className="justify-content-center">
            <CCol md={12}>
            <CNav variant="tabs">
                <CNavItem>
                    <CNavLink
                        href="#"
                        active={activeKey === 1}
                        onClick={() => setActiveKey(1)}
                    >
                        Kpis
                    </CNavLink>                       
                </CNavItem>
                <CNavItem>
                    <CNavLink
                        href="#"
                        active={activeKey === 2}
                        onClick={() => setActiveKey(2)}
                    >
                        Existing Formula
                    </CNavLink>
                </CNavItem>
            </CNav>
            </CCol>
        </CRow>
        <CRow className="justify-content-center">
          <CCol md={12} >
            <CTabContent>
                <CTabPane visible={activeKey === 1}>
                  <CRow className="">
                    <CCol md={9} lg={7} xl={12} className=''>
                      <CCard className="">
                        <CCardBody className="p-4">                
                            <h3>Save/Update</h3>
                            <p className="text-body-secondary">Manange your KPIs</p>
                            {savedKpis && savedKpis.length>0 &&
                              savedKpis.map((x,index)=>{
                                return(
                                  bindSavedKpisData(x,index)
                                )
                              })
                            }
                            <CRow>
                              <CCol xl={3}>
                                <CButton color="link" onClick={onShowCondition}>Add Condition</CButton>
                              </CCol>
                              <CCol xl={6}>
                                {savedKpis && savedKpis.length>0 &&
                                  <CButton color="link" onClick={onShowFormulaCondition}>Apply Formula on Existing Kpis</CButton>
                                }                      
                              </CCol>
                            </CRow>
                            <CRow >
                              <CCol xl={6}>
                                <CInputGroup   className='mb-3'>
                                  <CInputGroupText>
                                    <CIcon icon={cilViewColumn}/>  
                                  </CInputGroupText>        
                                  <CFormInput 
                                    ref={typeRef}
                                    type='text'
                                    placeholder='Enter Type'
                                    onChange={(e)=>inputUpdate(e,0,'type')} /> 
                                </CInputGroup>
                              </CCol>
                              <CCol xl={6}>
                                <CInputGroup   className='mb-3'>
                                  <CInputGroupText>
                                    <CIcon icon={cilViewColumn}/>  
                                  </CInputGroupText>        
                                  <CFormInput 
                                    ref={nameRef}
                                    type='text'
                                    placeholder='Enter KPI Name'
                                    onChange={(e)=>inputUpdate(e,0,'name')} /> 
                                </CInputGroup>
                              </CCol>
                              <CCol xl={12}>
                                <CInputGroup   className='mb-3'>
                                  <CInputGroupText>
                                    <CIcon icon={cilViewColumn}/>  
                                  </CInputGroupText>        
                                  <CFormTextarea 
                                    ref={descriptionRef}                         
                                    placeholder='Enter Description'
                                    onChange={(e)=>inputUpdate(e,0,'description')} /> 
                                </CInputGroup>
                              </CCol>
                            </CRow>
                            {
                              showFormulationStep && kpisList && kpisList.length>0 &&
                              <CRow>
                                <CCol xl={3}>
                                  <ReactSelect value={kpisFormula.operand1} className='operand'  options={kpisList} onChange={(e) => onSelectedOperand(e,'operand1')}></ReactSelect>
                                </CCol>
                                <CCol xl={3}>
                                  <ReactSelect value={kpisFormula.operator} className='operator'  options={formulaOperator} onChange={(e) => onSelectedOperand(e,'operator')}></ReactSelect>
                                </CCol>
                                <CCol xl={3}>
                                  <ReactSelect value={kpisFormula.operand2} className='operand'  options={kpisList} onChange={(e) => onSelectedOperand(e,'operand2')}></ReactSelect>
                                </CCol>
                              </CRow>
                            }
                              {
                                showCondition && conditionStep.map((innerStep,pIndex)=>{
                                  return(
                                  < > 
                                    <CRow key={(pIndex+14)}>
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
                                                <ReactSelect isDisabled={step.selectedOperator?.value=='all'} className='object-select' value={step.selectedKey}  options={step.keys} onChange={(e) => onSelectedKey(e,'key',innerStep,pIndex,index)}></ReactSelect>
                                              }
                                                {step.isValueLevel &&                
                                                <ReactSelect isDisabled={step.selectedOperator?.value=='all'} className='value-select' value={step.selectedValue}  options={step.keys} onChange={(e) => onSelectedKey(e,'value',innerStep,pIndex,index)}></ReactSelect>
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
                                {showCondition&&
                                  <CButton className='m-3' color="primary" onClick={()=>saveKpis()}>Save KPI Formula</CButton>
                                }
                                {showFormulationStep&&
                                  <CButton className='m-3' color="primary" onClick={()=>saveFormulatedKpis()}>Save Formula B/w KPIs</CButton>
                                }
                                {
                                  savedKpis && savedKpis.length>0&&
                                  <>
                                  <CButton className='m-3' color="primary" onClick={()=>genrateFormulanSaveCases()}>Repeat For all Cases and Save</CButton>
                                  {/* <CButton className='m-3' color="primary" onClick={()=>saveKpisData()}>Save Formula and  Generate Response</CButton> */}
                                  </>
                                }
                              </CCol>
                            </CRow>                  
                        </CCardBody>
                      </CCard>
                    </CCol>                
                  </CRow>
                </CTabPane>
                <CTabPane visible={activeKey===2}>
                    
                    <CRow className="">
                      <CCol xl={12} md={9} lg={7}  className=''>
                        <CCard className="">
                          <CCardBody className="p-4"> 
                            <h4>User Defined Saved Formula</h4>
                            {predefinedFormula && predefinedFormula.length>0 &&
                              predefinedFormula.map((x)=>{
                                return(
                                  <>

                                    <CRow>
                                      <CCol xl={3}>{x.Type}</CCol><CCol xl={3}>{x.KPIName}</CCol><CCol xl={6}>{x.Description}</CCol>
                                      {x.operationBetweenItems==null &&
                                      
                                        <CCol xl={12}>
                                          <CRow className='m-2'>
                                            <CCol xl={5}> <strong>If</strong> <label className='btn btn-link'>CaseType equals <u><strong>{x.selectedTypeValue}</strong></u></label></CCol>
                                            <CCol xl={2} className=' text-end mt-2'><strong>Then</strong></CCol>
                                              <CCol xl={3}>
                                                <ReactSelect value={{label:x.selectedTypeAction,value:x.selectedTypeAction}} className='operator'  options={actionOperator} onChange={(e) => onPreFormulaSelectedOperator(e,x)}></ReactSelect>
                                              </CCol> 
                                            <CCol xl={2} className='btn btn-link'>of <u><strong>NetValues</strong></u></CCol>
                                          </CRow>
                                          
                                        </CCol>
                                      
                                      }
                                       {x.operationBetweenItems!=null &&
                                      
                                      <CCol xl={12}>
                                        <CRow className='m-2'>
                                         
                                         
                                          <CCol xl={2} className='m-1'>
                                            <u><strong>{x.operationBetweenItems.item1} </strong></u>
                                          </CCol>
                                          <CCol xl={4}> 
                                            <ReactSelect value={x.operationBetweenItems.operator} className='operator'  options={formulaOperator} onChange={(e) => onPreFormulaSelectedOperator(e,x)}></ReactSelect> 
                                          </CCol>
                                          <CCol xl={2} className='m-1 text-end'>
                                            <u><strong>{x.operationBetweenItems.item2}</strong></u>
                                          </CCol>
                                        </CRow>
                                       
                                      </CCol>
                                    
                                    }
                                    </CRow>
                                    <CRow>
                                     <CCol xl={12}> <hr></hr></CCol>
                                    </CRow>
                                  </>
                                )
                              })
                              
                            }
                            {predefinedFormula && predefinedFormula.length>0 && isFormulaModified &&
                              <CRow>
                                <CCol>
                                <CButton color="link" onClick={()=>onModiedNSaveFormula()}>Update Formula and Generate Result</CButton>
                                </CCol>
                              </CRow>
                            }
                          </CCardBody>
                        </CCard>
                      </CCol>
                    </CRow>
                </CTabPane>                
            </CTabContent>
          </CCol>
        </CRow>
        
        <CToaster className="p-3" placement="top-end" push={toast} ref={toaster} />
      </CContainer>
    </div>
  )
}

export default OrgRegistration
