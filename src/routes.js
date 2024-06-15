import React from 'react'
import Organization from './components/organization/organization'

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/kpis', name: 'Organization', element: Organization }
]

export default routes
