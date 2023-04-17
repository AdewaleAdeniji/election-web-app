import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
// routes
import { ToastContainer } from 'react-toastify';
import Router from './routes';
// theme
import ThemeProvider from './theme';
// components
import { StyledChart } from './components/chart';
import ScrollToTop from './components/scroll-to-top';

import 'react-toastify/dist/ReactToastify.css';

// ----------------------------------------------------------------------

export default function App() {
  window.onerror = (a, b, c, d, e) => {
    console.log(`message: ${a}`);
    console.log(`source: ${b}`);
    console.log(`lineno: ${c}`);
    console.log(`colno: ${d}`);
    console.log(`error: ${e}`);

    return true;
  };
  window.addEventListener('fetch', (e)=> {
    console.log('a fetcg')
    console.log(e);
  });

  return (
    <HelmetProvider>
      <BrowserRouter>
        <ThemeProvider>
          <ScrollToTop />
          <StyledChart />
          <Router />
          <ToastContainer />
        </ThemeProvider>
      </BrowserRouter>
    </HelmetProvider>
  );
}
