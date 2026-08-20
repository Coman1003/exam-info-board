import { useState } from 'react';
import { ExamProvider } from './context/ExamContext';
import { AdminPage } from './pages/AdminPage';
import { DisplayPage } from './pages/DisplayPage';

function AppContent() {
  const [page, setPage] = useState<'display' | 'admin'>('display');

  return (
    <div className="min-h-screen bg-light-bg p-4 sm:p-8">
      <header className="mx-auto mb-6 flex w-full max-w-7xl items-center justify-between rounded-3xl bg-white p-4 shadow-soft">
        <h1 className="text-2xl font-bold text-text">🌸 考場資訊看板系統</h1>
        <nav className="flex gap-2">
          <button
            type="button"
            onClick={() => setPage('display')}
            className={`btn-secondary ${page === 'display' ? '!bg-pink' : ''}`}
          >
            顯示頁
          </button>
          <button
            type="button"
            onClick={() => setPage('admin')}
            className={`btn-secondary ${page === 'admin' ? '!bg-lavender' : ''}`}
          >
            管理頁
          </button>
        </nav>
      </header>

      <div className="mx-auto w-full max-w-7xl">{page === 'display' ? <DisplayPage /> : <AdminPage />}</div>
    </div>
  );
}

function App() {
  return (
    <ExamProvider>
      <AppContent />
    </ExamProvider>
  );
}

export default App;
