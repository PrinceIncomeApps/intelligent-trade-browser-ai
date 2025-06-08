
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
  BarChart3,
  X,
  Maximize2,
  Settings,
  Trash2,
  Target,
  Move,
  Square,
  ExternalLink
} from 'lucide-react';
import { TaskBuilder } from './TaskBuilder';

interface BrowserAreaProps {
  groups: any[];
  setGroups: (groups: any[]) => void;
}

export const BrowserArea = ({ groups, setGroups }: BrowserAreaProps) => {
  const [selectedGroup, setSelectedGroup] = useState(groups[0]?.id || null);
  const [url, setUrl] = useState('');
  const [fullScreenTab, setFullScreenTab] = useState(null);
  const [showTaskBuilder, setShowTaskBuilder] = useState(false);
  const [selectedTabForTask, setSelectedTabForTask] = useState(null);

  const selectedGroupData = groups.find(g => g.id === selectedGroup);

  const addTab = () => {
    console.log('addTab called', { selectedGroup, url, groups });
    
    if (!selectedGroup) {
      console.log('No group selected');
      return;
    }
    
    if (!url.trim()) {
      console.log('No URL provided');
      return;
    }
    
    // Add https:// if no protocol is specified
    let formattedUrl = url.trim();
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = 'https://' + formattedUrl;
    }
    
    console.log('Formatted URL:', formattedUrl);
    
    const newTab = {
      id: Date.now(),
      url: formattedUrl,
      title: formattedUrl.replace(/^https?:\/\//, '').split('/')[0],
      isActive: true,
      aiTasks: []
    };

    console.log('Creating new tab:', newTab);

    const updatedGroups = groups.map(group => 
      group.id === selectedGroup 
        ? { ...group, tabs: [...group.tabs, newTab] }
        : group
    );
    
    console.log('Updated groups:', updatedGroups);
    setGroups(updatedGroups);
    setUrl('');
  };

  const deleteTab = (tabId: number) => {
    const updatedGroups = groups.map(group => ({
      ...group,
      tabs: group.tabs.filter((tab: any) => tab.id !== tabId)
    }));
    setGroups(updatedGroups);
    
    if (fullScreenTab === tabId) {
      setFullScreenTab(null);
    }
  };

  const toggleTabStatus = (tabId: number) => {
    const updatedGroups = groups.map(group => ({
      ...group,
      tabs: group.tabs.map((tab: any) => 
        tab.id === tabId 
          ? { ...tab, isActive: !tab.isActive }
          : tab
      )
    }));
    setGroups(updatedGroups);
  };

  const openFullScreen = (tabId: number) => {
    setFullScreenTab(tabId);
  };

  const closeFullScreen = () => {
    setFullScreenTab(null);
  };

  const openTaskBuilder = (tabId: number) => {
    setSelectedTabForTask(tabId);
    setShowTaskBuilder(true);
  };

  const closeTaskBuilder = () => {
    setShowTaskBuilder(false);
    setSelectedTabForTask(null);
  };

  const openInNewWindow = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Full screen view
  if (fullScreenTab) {
    const currentTab = selectedGroupData?.tabs.find((tab: any) => tab.id === fullScreenTab);
    
    return (
      <div className="flex-1 flex flex-col relative">
        {/* Full Screen Header */}
        <div className="bg-black/20 backdrop-blur-lg border-b border-white/10 p-4 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h3 className="text-white font-medium">{currentTab?.title}</h3>
              <span className="text-blue-200 text-sm">{currentTab?.url}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                size="sm"
                variant="ghost"
                className="text-green-300 hover:bg-green-500/20"
                onClick={() => openInNewWindow(currentTab?.url)}
              >
                <ExternalLink className="h-4 w-4 mr-1" />
                Open External
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="text-blue-300 hover:bg-blue-500/20"
                onClick={() => toggleTabStatus(fullScreenTab)}
              >
                {currentTab?.isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                {currentTab?.isActive ? 'Pause' : 'Start'}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="text-purple-300 hover:bg-purple-500/20"
                onClick={() => openTaskBuilder(fullScreenTab)}
              >
                <Bot className="h-4 w-4 mr-1" />
                AI Task
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="text-white hover:bg-white/10"
                onClick={closeFullScreen}
              >
                <X className="h-4 w-4" />
                Close
              </Button>
            </div>
          </div>
        </div>

        {/* Full Screen Browser Content */}
        <div className="flex-1 relative">
          <div className="w-full h-full bg-white">
            <iframe
              src={currentTab?.url}
              className="w-full h-full border-0"
              title={currentTab?.title}
              sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-downloads allow-modals allow-orientation-lock allow-pointer-lock allow-presentation allow-popups-to-escape-sandbox allow-storage-access-by-user-activation allow-top-navigation allow-top-navigation-by-user-activation"
              referrerPolicy="no-referrer-when-downgrade"
              allow="accelerometer; autoplay; camera; encrypted-media; fullscreen; geolocation; gyroscope; magnetometer; microphone; midi; payment; picture-in-picture; publickey-credentials-get; screen-wake-lock; usb; web-share; xr-spatial-tracking"
              allowFullScreen
            />
          </div>
          
          {/* Task Builder Overlay */}
          {showTaskBuilder && (
            <TaskBuilder 
              tabId={selectedTabForTask}
              tab={currentTab}
              onClose={closeTaskBuilder}
              groups={groups}
              setGroups={setGroups}
            />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Top Bar */}
      <div className="bg-black/20 backdrop-blur-lg border-b border-white/10 p-4">
        <div className="flex items-center space-x-4">
          <div className="flex-1 flex items-center space-x-2">
            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter URL (e.g., google.com, tradingview.com, binance.com)"
              className="bg-white/10 border-white/20 text-white placeholder-blue-200"
              onKeyPress={(e) => e.key === 'Enter' && addTab()}
            />
            <Button
              onClick={addTab}
              disabled={!selectedGroup || !url.trim()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Open Tab
            </Button>
          </div>
          
          <div className="flex items-center space-x-2">
            <select 
              value={selectedGroup || ''}
              onChange={(e) => {
                const groupId = Number(e.target.value);
                console.log('Group selected:', groupId);
                setSelectedGroup(groupId);
              }}
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
                  <h4 className="text-white font-medium mb-2">Popular Sites to Try:</h4>
                  <div className="space-y-1 text-sm text-blue-200">
                    <div>• google.com</div>
                    <div>• tradingview.com</div>
                    <div>• binance.com</div>
                    <div>• example.com</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {selectedGroupData.tabs.map((tab: any) => (
                  <div key={tab.id} className="bg-white/5 rounded-lg border border-white/10 overflow-hidden">
                    {/* Tab Header */}
                    <div className="p-4 border-b border-white/10">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-white font-medium truncate">{tab.title}</h3>
                          <p className="text-blue-200 text-sm truncate">{tab.url}</p>
                        </div>
                        <div className="flex space-x-1 ml-2">
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="text-green-300 hover:bg-green-500/20 p-1"
                            onClick={() => openInNewWindow(tab.url)}
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="text-blue-300 hover:bg-blue-500/20 p-1"
                            onClick={() => openFullScreen(tab.id)}
                          >
                            <Maximize2 className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="text-green-300 hover:bg-green-500/20 p-1"
                            onClick={() => toggleTabStatus(tab.id)}
                          >
                            {tab.isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="text-purple-300 hover:bg-purple-500/20 p-1"
                            onClick={() => openTaskBuilder(tab.id)}
                          >
                            <Target className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="text-red-300 hover:bg-red-500/20 p-1"
                            onClick={() => deleteTab(tab.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Tab Preview */}
                    <div className="h-40 bg-white border-b border-white/10 relative">
                      <iframe
                        src={tab.url}
                        className="w-full h-full border-0 pointer-events-none"
                        title={tab.title}
                        sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-downloads allow-modals allow-orientation-lock allow-pointer-lock allow-presentation allow-popups-to-escape-sandbox allow-storage-access-by-user-activation allow-top-navigation allow-top-navigation-by-user-activation"
                        referrerPolicy="no-referrer-when-downgrade"
                        allow="accelerometer; autoplay; camera; encrypted-media; fullscreen; geolocation; gyroscope; magnetometer; microphone; midi; payment; picture-in-picture; publickey-credentials-get; screen-wake-lock; usb; web-share; xr-spatial-tracking"
                      />
                      <div className="absolute inset-0 bg-transparent pointer-events-none"></div>
                    </div>
                    
                    {/* Tab Status */}
                    <div className="p-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className={`flex items-center ${tab.isActive ? 'text-green-300' : 'text-yellow-300'}`}>
                          <div className={`w-2 h-2 rounded-full mr-2 ${tab.isActive ? 'bg-green-400' : 'bg-yellow-400'}`}></div>
                          {tab.isActive ? 'Active' : 'Paused'}
                        </span>
                        <span className="text-blue-200">
                          AI Tasks: {tab.aiTasks?.length || 0}
                        </span>
                      </div>
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
