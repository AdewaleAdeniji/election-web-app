import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import SimpleLayout from './layouts/simple';
//
import BlogPage from './pages/BlogPage';
import UserPage from './pages/UserPage';
import LoginPage from './pages/LoginPage';
import Page404 from './pages/Page404';
import ProductsPage from './pages/ProductsPage';
import FacultiesPage from './pages/FacultiesPage';
import DepartmentsPage from './pages/DepartmentsPage';
import DashboardPage from './pages/DashboardPage';
import ElectionsPage from './pages/ElectionsPage';
import ElectionPage from './pages/ElectionPage';
import SubPollPage from './pages/SubPollPage';
import ResultsPage from './pages/Results';
import PublicResultPage from './pages/ResultPage';
import PublicAccredit from './pages/AccreditPage';
import PublicVotersPage from './pages/VotersPage';

// ----------------------------------------------------------------------

export default function Router() {
  const routes = useRoutes([
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        // { path: 'app', element: <DashboardAppPage /> },
        { path: 'app', element: <DashboardPage /> },
        { path: 'user', element: <UserPage /> },
        { path: 'faculties', element: <FacultiesPage /> },
        { path: 'elections', element: <ElectionsPage /> },
        { path: 'results/:election', element: <ResultsPage /> },
        { path: 'elections/:electionId', element: <ElectionPage /> },
        { path: 'poll/:pollId', element: <SubPollPage /> },
        { path: 'faculties/:facultyId', element: <DepartmentsPage /> },
        { path: 'products', element: <ProductsPage /> },
        { path: 'blog', element: <BlogPage /> },
      ],
    },
    {
      path: 'login',
      element: <LoginPage />,
    },
    {
      path: 'accredit/:election',
      element: <PublicAccredit />,
    },
    {
      path: 'vote/:election',
      element: <PublicVotersPage />,
    },
    {
      path: 'results/:election',
      element: <PublicResultPage />,
    },
    {
      element: <SimpleLayout />,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        { path: '404', element: <Page404 /> },
      ],
    },
    // {
    //   path: '*',
    //   element: <Navigate to="/404" />,
    // },
  ]);

  return routes;
}
