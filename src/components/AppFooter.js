import React from 'react'
import { CFooter } from '@coreui/react'

const AppFooter = () => {
  return (
    <CFooter className="px-4">
      <div>
        <a target="_blank" rel="noopener noreferrer">
          Key Integration
        </a>
        <span className="ms-1"></span>
      </div>
      <div className="ms-auto">
        <span className="me-1">Powered by</span>
        <a  target="_blank" rel="noopener noreferrer">
          Key Integration
        </a>
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)
