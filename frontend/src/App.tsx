import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HomePage } from './pages/HomePage';
import { AnalysisPage } from './pages/AnalysisPage';
import { ReportPage } from './pages/ReportPage';
import { RecommendationsPage } from './pages/RecommendationsPage';
import { BotPage } from './pages/BotPage';
import { Toaster } from 'react-hot-toast';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter 
        future={{ 
          v7_startTransition: true, 
          v7_relativeSplatPath: true 
        }}
      >
        <div className="min-h-screen bg-[#09090b] text-[#fafafa] selection:bg-indigo-500/30">
          <Toaster 
            position="top-right"
            toastOptions={{
              className: 'glass-card text-white border-white/[0.08]',
              style: {
                background: '#121217',
                color: '#fafafa',
                border: '1px solid rgba(255, 255, 255, 0.08)'
              }
            }}
          />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/analysis/:reportId" element={<AnalysisPage />} />
            <Route path="/report/:reportId/*" element={<ReportPage />} />
            <Route path="/report/:reportId/recommendations" element={<RecommendationsPage />} />
            <Route path="/report/:reportId/bot" element={<BotPage />} />
          </Routes>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
