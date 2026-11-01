import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { POSView } from './views/POSView';
import { DashboardView } from './views/DashboardView';
import { InvoicesView } from './views/InvoicesView';
import { InventoryView } from './views/InventoryView';
import { PartnersView } from './views/PartnersView';
import { AnalyticsView } from './views/AnalyticsView';
import { CustomersView } from './views/CustomersView';
import { ExpensesView } from './views/ExpensesView';
import { SettingsView } from './views/SettingsView';
import { LoginScreen } from './components/auth/LoginScreen';
import { SuspendedOrdersModal } from './components/pos/SuspendedOrdersModal';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

function AppContent() {
  const { activeTab, toast, currentUser } = useApp();
  const [isSuspendedModalOpen, setIsSuspendedModalOpen] = useState(false);

  // If user is not logged in, render the login screen
  if (!currentUser) {
    return <LoginScreen />;
  }

  const renderActiveView = () => {
    switch (activeTab) {
      case 'pos':
        return <POSView />;
      case 'dashboard':
        return <DashboardView />;
      case 'invoices':
        return <InvoicesView />;
      case 'inventory':
        return <InventoryView />;
      case 'partners':
        return <PartnersView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'customers':
        return <CustomersView />;
      case 'expenses':
        return <ExpensesView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <POSView />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors selection:bg-indigo-500 selection:text-white">
      {/* Header */}
      <Header onOpenSuspendedModal={() => setIsSuspendedModalOpen(true)} />

      {/* Main Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar />

        {/* Dynamic View */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {renderActiveView()}
        </main>
      </div>

      {/* Global Suspended Orders Modal */}
      <SuspendedOrdersModal
        isOpen={isSuspendedModalOpen}
        onClose={() => setIsSuspendedModalOpen(false)}
      />

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 left-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-200">
          <div className={`px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs font-bold border backdrop-blur-md ${
            toast.type === 'error'
              ? 'bg-rose-600/90 text-white border-rose-500 shadow-rose-600/20'
              : toast.type === 'success'
              ? 'bg-emerald-600/90 text-white border-emerald-500 shadow-emerald-600/20'
              : 'bg-slate-900/90 dark:bg-slate-800/95 text-white border-slate-700 shadow-slate-950/30'
          }`}>
            {toast.type === 'error' ? (
              <AlertCircle className="w-4 h-4 shrink-0" />
            ) : toast.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            ) : (
              <Info className="w-4 h-4 shrink-0 text-indigo-400" />
            )}
            <span>{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
