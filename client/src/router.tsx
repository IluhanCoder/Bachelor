import { Route } from "react-router-dom"
import FormComponent from "./forms/form-component"
import RegistationPage from "./auth/registration-page";
import ProjectsPage from "./project/projects-page";
import ProjectPage from "./project/project-page";
import MyProfilePage from "./user/my-profile-page";
import UserProfilePage from "./user/user-profile-page";
import BoardWindow from "./task/board-window";
import AnalyticsPage from "./analytics/analytics-page";

const CustomRoutes = [
  <Route path="/" element={<div>hello</div>} key="root"/>,
  <Route path="/registration" element={<RegistationPage/>} key="registration"/>,
  <Route path="/projects" element={<ProjectsPage/>} key="projects"/>,
  <Route path="/project/:projectId" element={<ProjectPage/>} key="project"/>,
  <Route path="/profile" element={<MyProfilePage/>} key="my-profile"/>,
  <Route path="/profile/:userId" element={<UserProfilePage/>}/>,
  <Route path="/board/:projectId" element={<BoardWindow/>}/>,
  <Route path="/analytics/:projectId" element={<AnalyticsPage/>}/>
]

export default CustomRoutes;