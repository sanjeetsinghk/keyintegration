import React, { useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CNav,
  CNavItem,CNavLink,CTabContent,CTabPane
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import OrgRegistration from './OrgRegistraion'

const Organization = () => {
    const [activeKey, setActiveKey] = useState(1)
  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row">
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
                   
            </CNav>
                </CCol>
            </CRow>
            <CRow className="justify-content-center">
                <CCol md={12} >
                <CTabContent>
                    <CTabPane visible={activeKey === 1}>
                        <OrgRegistration></OrgRegistration>
                    </CTabPane>
                 
                   
                </CTabContent>
            </CCol>
            </CRow>
        </CContainer>
    </div>
  )
}

export default Organization
