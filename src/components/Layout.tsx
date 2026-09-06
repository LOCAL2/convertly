import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import GlassSearchBar from './GlassSearchBar';
import ReportModal from './ReportModal';
import ContextualAiChatbot from './ContextualAiChatbot';

export default function Layout() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <div className="flex min-h-screen bg-background relative overflow-hidden">
      <GlassSearchBar />
      <Sidebar />
      <ReportModal />
      <ContextualAiChatbot />
      <main className={`flex-1 w-full md:ml-72 min-h-screen transition-all duration-300 z-10 ${isHome ? 'p-0' : 'pt-16 md:pt-14'}`}>
        {isHome ? (
          <Outlet />
        ) : (
          <div className="container mx-auto p-4 md:p-8">
            <Outlet />
          </div>
        )}
      </main>
    </div>
  );
}
