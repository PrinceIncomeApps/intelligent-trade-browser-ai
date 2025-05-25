
import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { BrowserArea } from './BrowserArea';
import { AdminPanel } from './AdminPanel';

interface DashboardProps {
  user: any;
  onLogout: () => void;
}

export const Dashboard = ({ user, onLogout }: DashboardProps) => {
  const [activeView, setActiveView] = useState<'browser' | 'admin'>('browser');
  const [groups, setGroups] = useState([
    { id: 1, name: 'Trading', tabs: [] },
    { id: 2, name: 'Research', tabs: [] }
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="flex h-screen">
        <Sidebar 
          user={user}
          groups={groups}
          setGroups={setGroups}
          activeView={activeView}
          setActiveView={setActiveView}
          onLogout={onLogout}
        />
        
        <div className="flex-1 flex flex-col">
          {activeView === 'browser' ? (
            <BrowserArea groups={groups} setGroups={setGroups} />
          ) : (
            <AdminPanel user={user} />
          )}
        </div>
      </div>
    </div>
  );
};
