
import React from 'react';
import { createRoot } from 'react-dom/client';
import { 
  createBrowserRouter,
  RouterProvider
} from 'react-router-dom';
import { FORM_TYPE, ROUTE } from './text';
import App from './App';
import Account from './components/Account';
import AccountForm from './components/AccountForm';
import Home, { 
  loader as homeLoader
} from './components/Home';
import Details, {
  loader as detailsLoader,
  action as detailsAction
} from './components/Details';
import ErrorPage from './components/ErrorPage';
import AccountFormBackdrop, {
  loader as accountFormBackdropLoader
} from './components/AccountFormBackdrop';
import ResetPassword from './components/Account/ResetPassword';
import ChangeEmail from './components/Account/ChangeEmail';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';

import './index.css';


const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: ROUTE.REGISTER,
        element: <PublicRoute />,
        children: [
          {
            path: '',
            element: <AccountForm formType={FORM_TYPE.REGISTER}/>,
            children: [
              {
                path: '',
                element: <AccountFormBackdrop />,
                loader: accountFormBackdropLoader
              }
            ]
          }
        ]
      },
      {
        path: ROUTE.LOGIN,
        element: <PublicRoute />,
        children: [
          {
            path: '',
            element: <AccountForm formType={FORM_TYPE.LOGIN} />,
            children: [
              {
                path: '',
                element: <AccountFormBackdrop />,
                loader: accountFormBackdropLoader
              }
            ]
          }
        ]
      },
      {
        path: ROUTE.BROWSE,
        element: <ProtectedRoute />,
        children: [
          {
            path: '',
            element: <Home />,
            loader: homeLoader
          }
        ]
      },
      {
        path: `${ROUTE.DETAILS}/:movieId`,
        element: <ProtectedRoute />,
        action: detailsAction,
        children: [
          {
            path: '',
            element: <Details />,
            loader: detailsLoader
          }
        ]
      },
      {
        path: ROUTE.ACCOUNT,
        element: <ProtectedRoute />,
        children: [
          {
            path: '',
            element: <Account />
          },
          {
            path: 'reset-password',
            element: <ResetPassword />
          },
          {
            path: 'change-email',
            element: <ChangeEmail />
          }
          // {
          //   path: 'delete-account',
          //   element: <DeleteAccount />
          // }
        ]
      }
    ]
  },
]);

root.render(<RouterProvider router={router} />);