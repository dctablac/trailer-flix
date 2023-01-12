
import React from 'react';
import { createRoot } from 'react-dom/client';
import { 
  createBrowserRouter,
  RouterProvider
} from 'react-router-dom';
import App from './App';
import AccountForm from './components/AccountForm';
import Home, { 
  loader as homeLoader
} from './components/Home';
import Details from './components/Details';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';
import './App.css';
import './index.css';

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <AccountForm formType="Register"/>
      },
      {
        path: '/login',
        element: <AccountForm formType="Login" />
      },
      {
        path: '/browse',
        element: <Home />,
        loader: homeLoader
      },
      {
        path: '/details/:movieId',
        element: <Details />
      }
    ]
  },
]);

root.render(<RouterProvider router={router} />);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
