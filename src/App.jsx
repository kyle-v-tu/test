import { createBrowserRouter, RouterProvider, Outlet, Navigate } from 'react-router-dom';
import Nav from './Pages/Nav';
import Home from './Pages/Home';
import About from './Pages/About';
import ClassPage from './Pages/ClassPage';
import OurChapter from './Pages/OurChapter';

function Layout() {
  return (
    <>
      <Nav />
      <Outlet />
    </>
  );
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/about", element: <About /> },
      { path: "/our-chapter", element: <OurChapter /> },
      { path: "/our-chapter/:name", element: <ClassPage /> },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;