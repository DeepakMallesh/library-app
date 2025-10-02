import React from 'react';
import AdminPanel from './pages/AdminPanel';
import IPGuard from './components/IPGuard';

function App() {
  return (
    <IPGuard>
      <AdminPanel />
    </IPGuard>
  );
}

export default App;
