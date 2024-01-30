import { Route } from "react-router-dom"
import FormComponent from "./forms/form-component"
import RegistationPage from "./auth/registration-page";

const CustomRoutes = [
  <Route path="/" element={<div>hello</div>} key="root"/>,
  <Route path="/registration" element={<RegistationPage/>} key="registration"></Route>
]

export default CustomRoutes;