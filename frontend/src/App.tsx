import OTP from './pages/OTP';
import Home from "./pages/Home";
import Edit from "./pages/EditNote";
import Login from './pages/LoginPage';
import Profile from './pages/ProfilePage';
import Register from './pages/RegisterPage';
import NotFound from './components/NotFound';
import NewPassword from './pages/NewPassword';
import Landingpage from './pages/LandingPage';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from "react-toastify";
import ForgotPassword from './pages/ForgotPassword';
import PrivateRoute from './components/PrivateRoute';
import { RouterProvider, createBrowserRouter } from "react-router-dom";

function App() {

  const router = createBrowserRouter([
    { path: '/', element: <Landingpage />, errorElement: <NotFound /> },
    { path: '/home', element: (<PrivateRoute><Home /></PrivateRoute>), errorElement: <NotFound /> },
    {
      path: '/note/:id', element: (<PrivateRoute><Edit noteId={''} open={false} onClose={function (): void {
        throw new Error('Function not implemented.');
      }} /></PrivateRoute>), errorElement: <NotFound />
    },
    { path: '/me/profile', element: (<PrivateRoute><Profile /></PrivateRoute>), errorElement: <NotFound /> },
    { path: '/login', element: <Login />, errorElement: <NotFound /> },
    { path: '/register', element: <Register />, errorElement: <NotFound /> },
    { path: '/forgot-password', element: <ForgotPassword />, errorElement: <NotFound /> },
    { path: '/otp-verify', element: <OTP />, errorElement: <NotFound /> },
    { path: '/new-password', element: <NewPassword />, errorElement: <NotFound /> },
  ]);

  return (
    <>
      <ToastContainer />
      <RouterProvider router={router} />
    </>
  )
}

export default App;