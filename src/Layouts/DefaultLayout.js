import React from 'react'
import Sidebar from './Sidebar'
import Appcontent from './AppContent'

function DefaultLayout() {
  return (
    <div className='wrapper'>
        <div className='sidebar-main'>
        <Sidebar/>
        </div>
        <div className="content">
        <Appcontent />
        </div>
    </div>
  )
}

export default DefaultLayout