import {Navigate} from 'react-router-dom';
import DashboardLayout from 'src/components/DashboardLayout';
import Users from 'src/pages/Users';
import Questions from 'src/pages/Questions';
import Login from 'src/pages/Login';
import Logout from 'src/pages/Logout';
import NotFound from 'src/pages/NotFound';
import Register from 'src/pages/Register';
import QuestionById from './pages/QuestionById';
import Profile from './pages/Profile';
import Rating from "./pages/Rating";
import Organizations from "./pages/Organizations";

const routes = [
    {
        path: '/',
        element: <DashboardLayout/>,
        children: [
            {path: '/', element: <Questions/>},
            {path: 'questions', element: <Questions/>},
            {path: 'questions/:questionId', element: <QuestionById/>},
            {path: 'users', element: <Users/>},
            {path: 'rating', element: <Rating/>},
            {path: 'organizations', element: <Organizations/>},
            {path: 'profile', element: <Profile/>},
            {path: 'login', element: <Login/>},
            {path: 'register', element: <Register/>},
            {path: 'logout', element: <Logout/>},
            {path: '404', element: <NotFound/>},
            {path: '*', element: <Navigate to='/404'/>}
        ]
    }
];

export default routes;
