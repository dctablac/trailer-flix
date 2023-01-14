
import React from 'react';
import { createRoot } from 'react-dom/client';
import { 
  createBrowserRouter,
  RouterProvider
} from 'react-router-dom';
import { FORM_TYPE, ROUTE } from './text';
import App from './App';
import AccountForm from './components/AccountForm';
import Home, { 
  loader as homeLoader
} from './components/Home';
import Details, {
  loader as detailsLoader
} from './components/Details';
import ErrorPage from './components/ErrorPage';
// import * as serviceWorkerRegistration from './serviceWorkerRegistration';
// import reportWebVitals from './reportWebVitals';
import './App.css';
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
        element: <AccountForm formType={FORM_TYPE.REGISTER}/>
      },
      {
        path: ROUTE.LOGIN,
        element: <AccountForm formType={FORM_TYPE.LOGIN} />
      },
      {
        path: ROUTE.BROWSE,
        element: <Home />,
        loader: homeLoader
      },
      {
        path: `${ROUTE.DETAILS}/:movieId`,
        element: <Details />,
        loader: detailsLoader
      }
    ]
  },
]);

root.render(<RouterProvider router={router} />);

// // If you want your app to work offline and load faster, you can change
// // unregister() to register() below. Note this comes with some pitfalls.
// // Learn more about service workers: https://cra.link/PWA
// serviceWorkerRegistration.unregister();

// // If you want to start measuring performance in your app, pass a function
// // to log results (for example: reportWebVitals(console.log))
// // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
