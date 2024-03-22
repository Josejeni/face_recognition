import React from "react";

const Dashboard = React.lazy(() => import("./Dashboard"));
const Studentdetails = React.lazy(() => import("./Studentdetails"));
const Attendance = React.lazy(() => import("./Attendance"));

const routes = [
  { path: "/dashboard", name: "dashboard", element2: Dashboard },
  { path: "/student", name: "dashboard", element2: Studentdetails },
  { path: "/attendance", name: "dashboard", element2: Attendance },

];

export default routes;
