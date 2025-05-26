
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Globe, 
  Settings, 
  LogOut, 
  Plus, 
  Folder,
  X,
  Brain,
  TrendingUp,
  ChevronDown,
  ChevronRight,
  Bot
} from 'lucide-react';

interface SidebarProps {
  user: any;
  groups: any[];
  setGroups: (groups: any[]) => void;
  activeView: string;
  setActiveView: (view: 'browser' | 'admin') => void;
  onLogout: () => void;
}

export const Sidebar = ({ 
  user, 
  groups, 
  setGroups, 
  activeView, 
  setActiveView, 
  onLogout 
}: SidebarProps) => {
  const [newGroupName, setNewGroupName] = useState('');
  const [showNewGroup, setShowNewGroup] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<number[]>([]);

  const addGroup = () => {
    if (newGroupName.trim()) {
      const newGroup = {
        id: Date.now(),
        name: newGroupName,
        tabs: []
      };
      setGroups([...groups, newGroup]);
      setNewGroupName('');
      setShowNewGroup(false);
    }
  };

  const removeGroup = (groupId: number) => {
    setGroups(groups.filter(g => g.id !== groupId));
    setExpandedGroups(expandedGroups.filter(id => id !== groupId));
  };

  const toggleGroupExpansion = (groupId: number) => {
    setExpandedGroups(prev => 
      prev.includes(groupId) 
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    );
  };

  return (
    <div className="w-80 bg-black/20 backdrop-blur-lg border-r border-white/10 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
            <Brain className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-white font-bold">MSQ Browser</h2>
            <p className="text-blue-200 text-sm">v1.0</p>
          </div>
        </div>
        
        <div className="bg-white/10 rounded-lg p-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
              {user.name.charAt(0)}
            </div>
            <div>
              <p className="text-white text-sm font-medium">{user.name}</p>
              <p className="text-blue-200 text-xs">{user.role}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="p-4 space-y-2">
        <Button
          variant={activeView === 'browser' ? 'default' : 'ghost'}
          className={`w-full justify-start ${
            activeView === 'browser' 
              ? 'bg-blue-600 hover:bg-blue-700' 
              : 'text-white hover:bg-white/10'
          }`}
          onClick={() => setActiveView('browser')}
        >
          <Globe className="mr-2 h-4 w-4" />
          Browser
        </Button>

        {user.role === 'admin' && (
          <Button
            variant={activeView === 'admin' ? 'default' : 'ghost'}
            className={`w-full justify-start ${
              activeView === 'admin' 
                ? 'bg-purple-600 hover:bg-purple-700' 
                : 'text-white hover:bg-white/10'
            }`}
            onClick={() => setActiveView('admin')}
          >
            <Settings className="mr-2 h-4 w-4" />
            Admin Panel
          </Button>
        )}
      </div>

      {/* Groups Section */}
      {activeView === 'browser' && (
        <div className="flex-1 p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-medium">Tab Groups</h3>
            <Button
              size="sm"
              variant="ghost"
              className="text-blue-300 hover:bg-white/10"
              onClick={() => setShowNewGroup(true)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {showNewGroup && (
            <div className="mb-4 space-y-2">
              <Input
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                placeholder="Group name"
                className="bg-white/10 border-white/20 text-white placeholder-blue-200"
                onKeyPress={(e) => e.key === 'Enter' && addGroup()}
              />
              <div className="flex space-x-2">
                <Button size="sm" onClick={addGroup} className="bg-blue-600 hover:bg-blue-700">
                  Add
                </Button>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={() => setShowNewGroup(false)}
                  className="text-white hover:bg-white/10"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          <div className="space-y-2">
            {groups.map((group) => {
              const isExpanded = expandedGroups.includes(group.id);
              return (
                <div key={group.id} className="bg-white/5 rounded-lg border border-white/10">
                  {/* Group Header */}
                  <div className="p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div 
                        className="flex items-center space-x-2 cursor-pointer flex-1"
                        onClick={() => toggleGroupExpansion(group.id)}
                      >
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4 text-blue-300" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-blue-300" />
                        )}
                        <Folder className="h-4 w-4 text-blue-300" />
                        <span className="text-white text-sm font-medium">{group.name}</span>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-red-300 hover:bg-red-500/20 p-1"
                        onClick={() => removeGroup(group.id)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                    <p className="text-blue-200 text-xs">{group.tabs.length} tabs</p>
                  </div>
                  
                  {/* Expanded Tab List */}
                  {isExpanded && group.tabs.length > 0 && (
                    <div className="border-t border-white/10 p-2 space-y-1">
                      {group.tabs.map((tab: any) => (
                        <div key={tab.id} className="flex items-center justify-between p-2 rounded bg-white/5 hover:bg-white/10">
                          <div className="flex items-center space-x-2 flex-1 min-w-0">
                            <div className={`w-2 h-2 rounded-full ${tab.isActive ? 'bg-green-400' : 'bg-yellow-400'}`}></div>
                            <span className="text-white text-xs truncate">{tab.title}</span>
                          </div>
                          {tab.aiTasks && tab.aiTasks.length > 0 && (
                            <Bot className="h-3 w-3 text-purple-300" />
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Empty State */}
                  {isExpanded && group.tabs.length === 0 && (
                    <div className="border-t border-white/10 p-3 text-center">
                      <p className="text-blue-200 text-xs">No tabs in this group</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="p-4 border-t border-white/10">
        <Button
          variant="ghost"
          className="w-full justify-start text-red-300 hover:bg-red-500/20"
          onClick={onLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );
};
