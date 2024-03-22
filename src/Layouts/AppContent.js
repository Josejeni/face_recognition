import React, { Suspense } from 'react'
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import routes from '../routes'
import { useEffect } from 'react';
function Appcontent() {
  return (
    <div>
    <Suspense>
        <Routes>
            {routes.map((route, idx) => {
                return (
                    route.element2 && (
                        <Route
                            key={idx}
                            path={route.path}
                            exact={route.exact}
                            name={route.name}
                            element={<route.element2 />}
                        />
                    )
                )
            })}
            {/* <Route path="/high_octavez/home" element={<Navigate to="home" replace />} /> */}
        </Routes>
    </Suspense>
</div>
  )
}

export default Appcontent