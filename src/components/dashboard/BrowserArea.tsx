
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Plus, 
  Search, 
  Play, 
  Pause, 
  Bot,
  TrendingUp,
  BarChart3
} from 'lucide-react';

interface BrowserAreaProps {
  groups: any[];
  setGroups: (groups: any[]) => void;
}

export const BrowserArea = ({ groups, setGroups }: BrowserAreaProps) => {
  const [selectedGroup, setSelectedGroup] = useState(groups[0]?.id || null);
  const [url, setUrl] = useState('');

  const selectedGroupData = groups.find(g => g.id === selectedGroup);

  const addTab = () => {
    if (!selectedGroup || !url) return;
    
    const newTab = {
      id: Date.now(),
      url,
      title: new URL(url).hostname,
      isActive: false,
      aiTask: null
    };

    setGroups(groups.map(group => 
      group.id === selectedGroup 
        ? { ...group, tabs: [...group.tabs, newTab] }
        : group
    ));
    setUrl('');
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Top Bar */}
      <div className="bg-black/20 backdrop-blur-lg border-b border-white/10 p-4">
        <div className="flex items-center space-x-4">
          <div className="flex-1 flex items-center space-x-2">
            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter URL (e.g., https://binance.com)"
              className="bg-white/10 border-white/20 text-white placeholder-blue-200"
              onKeyPress={(e) => e.key === 'Enter' && addTab()}
            />
            <Button
              onClick={addTab}
              disabled={!selectedGroup || !url}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Open Tab
            </Button>
          </div>
          
          <div className="flex items-center space-x-2">
            <select 
              value={selectedGroup || ''}
              onChange={(e) => setSelectedGroup(Number(e.target.value))}
              className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm"
            >
              <option value="">Select Group</option>
              {groups.map(group => (
                <option key={group.id} value={group.id} className="bg-slate-800">
                  {group.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Browser Content */}
      <div className="flex-1 p-6">
        {selectedGroupData ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">
                {selectedGroupData.name} Group
              </h2>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" className="text-white hover:bg-white/10">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Analytics
                </Button>
              </div>
            </div>

            {selectedGroupData.tabs.length === 0 ? (
              <div className="text-center py-16">
                <div className="bg-white/5 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
                  <Search className="h-12 w-12 text-blue-300" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">No Tabs Open</h3>
                <p className="text-blue-200 mb-6">Enter a URL above to start browsing and trading</p>
                <div className="bg-blue-900/30 rounded-lg p-4 max-w-md mx-auto border border-blue-500/30">
                  <h4 className="text-white font-medium mb-2">Popular Trading Sites:</h4>
                  <div className="space-y-1 text-sm text-blue-200">
                    <div>• https://binance.com</div>
                    <div>• https://quotex.io</div>
                    <div>• https://tradingview.com</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {selectedGroupData.tabs.map((tab: any) => (
                  <div key={tab.id} className="bg-white/5 rounded-lg border border-white/10 p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="text-white font-medium">{tab.title}</h3>
                        <p className="text-blue-200 text-sm">{tab.url}</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="ghost" className="text-green-300 hover:bg-green-500/20">
                          <Play className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="text-blue-300 hover:bg-blue-500/20">
                          <Bot className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="bg-black/30 rounded-lg h-40 flex items-center justify-center border border-white/10">
                      <div className="text-center">
                        <TrendingUp className="h-8 w-8 text-blue-300 mx-auto mb-2" />
                        <p className="text-blue-200 text-sm">Browser Preview</p>
                        <p className="text-blue-300 text-xs">AI Monitoring: Ready</p>
                      </div>
                    </div>
                    
                    <div className="mt-3 flex items-center justify-between text-xs">
                      <span className="text-green-300">● Active</span>
                      <span className="text-blue-200">AI Task: None</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="bg-white/5 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
              <Bot className="h-12 w-12 text-purple-300" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Select a Group</h3>
            <p className="text-blue-200">Choose a tab group to start browsing and automation</p>
          </div>
        )}
      </div>
    </div>
  );
};
