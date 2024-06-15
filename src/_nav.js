import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilBell,
  cilCalculator,
  cilChartPie,
  cilCursor,
  cilDescription,
  cilDrop,
  cilFactorySlash,
  cilNotes,
  cilPencil,
  cilPuzzle,
  cilSpeedometer,
  cilStar,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
 
  {
    component: CNavTitle,
    name: 'Key Integration',
  },  
  {
    component: CNavGroup,
    name: 'KPIs Section',
    to: '/base',
    icon: <CIcon icon={cilFactorySlash} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Add/Update KPIs',
        to: '/kpis',
      }
    ],
  }
]

export default _nav
