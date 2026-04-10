import { Toaster } from 'react-hot-toast';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <>
      <Toaster 
        position="top-right"
        toastOptions={{
          className: 'text-sm font-semibold text-slate-800 shadow-xl rounded-xl border border-slate-100',
          duration: 4000,
        }} 
      />
      <AppRoutes />
    </>
  );
}

export default App;