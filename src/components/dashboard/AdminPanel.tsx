
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { 
  Shield, 
  Users, 
  Settings, 
  Activity,
  BarChart3,
  AlertCircle
} from 'lucide-react';

interface AdminPanelProps {
  user: any;
}

export const AdminPanel = ({ user }: AdminPanelProps) => {
  const [settings, setSettings] = useState({
    registrationEnabled: true,
    maintenanceMode: false,
    aiTasksEnabled: true,
    tradingEnabled: true
  });

  const toggleSetting = (key: string) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const stats = [
    { label: 'Total Users', value: '1,234', icon: Users, color: 'blue' },
    { label: 'Active Sessions', value: '89', icon: Activity, color: 'green' },
    { label: 'AI Tasks Running', value: '45', icon: BarChart3, color: 'purple' },
    { label: 'System Status', value: 'Healthy', icon: Shield, color: 'emerald' }
  ];

  return (
    <div className="flex-1 p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-blue-200">Manage MSQ Browser settings and monitor system</p>
        </div>
        <div className="bg-purple-900/30 rounded-lg px-4 py-2 border border-purple-500/30">
          <div className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-purple-300" />
            <span className="text-purple-200 font-medium">Admin Access</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="bg-white/5 border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-200 text-sm font-medium">{stat.label}</p>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg bg-${stat.color}-500/20`}>
                  <stat.icon className={`h-6 w-6 text-${stat.color}-300`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Settings Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Settings className="mr-2 h-5 w-5" />
              System Settings
            </CardTitle>
            <CardDescription className="text-blue-200">
              Configure core system functionality
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-white font-medium">User Registration</h4>
                <p className="text-blue-200 text-sm">Allow new users to register</p>
              </div>
              <Switch
                checked={settings.registrationEnabled}
                onCheckedChange={() => toggleSetting('registrationEnabled')}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-white font-medium">Maintenance Mode</h4>
                <p className="text-blue-200 text-sm">Temporarily disable access</p>
              </div>
              <Switch
                checked={settings.maintenanceMode}
                onCheckedChange={() => toggleSetting('maintenanceMode')}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-white font-medium">AI Tasks</h4>
                <p className="text-blue-200 text-sm">Enable automated trading tasks</p>
              </div>
              <Switch
                checked={settings.aiTasksEnabled}
                onCheckedChange={() => toggleSetting('aiTasksEnabled')}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-white font-medium">Trading Features</h4>
                <p className="text-blue-200 text-sm">Allow buy/sell automation</p>
              </div>
              <Switch
                checked={settings.tradingEnabled}
                onCheckedChange={() => toggleSetting('tradingEnabled')}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <AlertCircle className="mr-2 h-5 w-5" />
              System Monitoring
            </CardTitle>
            <CardDescription className="text-blue-200">
              Real-time system status and alerts
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-green-900/20 rounded-lg border border-green-500/30">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-green-200 text-sm">Database Connection</span>
                </div>
                <span className="text-green-300 text-sm font-medium">Healthy</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-green-900/20 rounded-lg border border-green-500/30">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-green-200 text-sm">Email Service</span>
                </div>
                <span className="text-green-300 text-sm font-medium">Active</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-blue-900/20 rounded-lg border border-blue-500/30">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span className="text-blue-200 text-sm">AI Engine</span>
                </div>
                <span className="text-blue-300 text-sm font-medium">Running</span>
              </div>
            </div>
            
            <Button className="w-full bg-blue-600 hover:bg-blue-700">
              View Detailed Logs
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
