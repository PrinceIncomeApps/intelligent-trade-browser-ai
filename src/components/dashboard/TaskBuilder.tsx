
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  X, 
  Plus, 
  Move, 
  Target, 
  TrendingUp, 
  BarChart3, 
  DollarSign,
  Settings,
  Play,
  Trash2
} from 'lucide-react';

interface TaskFrame {
  id: number;
  type: 'chart' | 'indicator' | 'button' | 'custom';
  x: number;
  y: number;
  width: number;
  height: number;
  conditions: any[];
  actions: any[];
  aiCommand: string;
}

interface TaskBuilderProps {
  tabId: number;
  tab: any;
  onClose: () => void;
  groups: any[];
  setGroups: (groups: any[]) => void;
}

export const TaskBuilder = ({ tabId, tab, onClose, groups, setGroups }: TaskBuilderProps) => {
  const [taskFrames, setTaskFrames] = useState<TaskFrame[]>([]);
  const [selectedFrame, setSelectedFrame] = useState<number | null>(null);
  const [showAddFrame, setShowAddFrame] = useState(false);
  const [draggedFrame, setDraggedFrame] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const addTaskFrame = (type: 'chart' | 'indicator' | 'button' | 'custom') => {
    const newFrame: TaskFrame = {
      id: Date.now(),
      type,
      x: 100,
      y: 100,
      width: 200,
      height: 150,
      conditions: [],
      actions: [],
      aiCommand: ''
    };
    setTaskFrames([...taskFrames, newFrame]);
    setSelectedFrame(newFrame.id);
    setShowAddFrame(false);
  };

  const deleteFrame = (frameId: number) => {
    setTaskFrames(taskFrames.filter(f => f.id !== frameId));
    if (selectedFrame === frameId) {
      setSelectedFrame(null);
    }
  };

  const handleMouseDown = (frameId: number, e: React.MouseEvent) => {
    const frame = taskFrames.find(f => f.id === frameId);
    if (!frame) return;

    const rect = (e.target as HTMLElement).getBoundingClientRect();
    setDraggedFrame(frameId);
    setDragOffset({
      x: e.clientX - frame.x,
      y: e.clientY - frame.y
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggedFrame || !containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const newX = e.clientX - containerRect.left - dragOffset.x;
    const newY = e.clientY - containerRect.top - dragOffset.y;

    setTaskFrames(taskFrames.map(frame => 
      frame.id === draggedFrame 
        ? { ...frame, x: Math.max(0, newX), y: Math.max(0, newY) }
        : frame
    ));
  };

  const handleMouseUp = () => {
    setDraggedFrame(null);
  };

  const addCondition = (frameId: number) => {
    const frame = taskFrames.find(f => f.id === frameId);
    if (!frame) return;

    const newCondition = {
      id: Date.now(),
      type: 'price',
      operator: 'greater_than',
      value: '',
      indicator: '',
      timeframe: '1m'
    };

    setTaskFrames(taskFrames.map(f => 
      f.id === frameId 
        ? { ...f, conditions: [...f.conditions, newCondition] }
        : f
    ));
  };

  const addAction = (frameId: number, actionType: 'buy' | 'sell') => {
    const frame = taskFrames.find(f => f.id === frameId);
    if (!frame) return;

    const newAction = {
      id: Date.now(),
      type: actionType,
      amount: '',
      price: 'market',
      conditions: []
    };

    setTaskFrames(taskFrames.map(f => 
      f.id === frameId 
        ? { ...f, actions: [...f.actions, newAction] }
        : f
    ));
  };

  const updateAICommand = (frameId: number, command: string) => {
    setTaskFrames(taskFrames.map(f => 
      f.id === frameId 
        ? { ...f, aiCommand: command }
        : f
    ));
  };

  const saveTask = () => {
    const updatedGroups = groups.map(group => ({
      ...group,
      tabs: group.tabs.map((t: any) => 
        t.id === tabId 
          ? { ...t, aiTasks: taskFrames }
          : t
      )
    }));
    setGroups(updatedGroups);
    onClose();
  };

  const selectedFrameData = taskFrames.find(f => f.id === selectedFrame);

  return (
    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-20 flex">
      {/* Task Builder Overlay */}
      <div className="w-80 bg-black/80 backdrop-blur-lg border-r border-white/20 p-4 overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-white font-bold text-lg">AI Task Builder</h3>
          <Button
            size="sm"
            variant="ghost"
            className="text-white hover:bg-white/10"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Add Frame Section */}
        <div className="mb-6">
          <Button
            onClick={() => setShowAddFrame(!showAddFrame)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Task Frame
          </Button>

          {showAddFrame && (
            <div className="mt-3 space-y-2">
              <Button
                size="sm"
                variant="outline"
                className="w-full justify-start text-white border-white/20 hover:bg-white/10 font-medium"
                onClick={() => addTaskFrame('chart')}
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                Chart Area
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="w-full justify-start text-white border-white/20 hover:bg-white/10 font-medium"
                onClick={() => addTaskFrame('indicator')}
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Indicator
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="w-full justify-start text-white border-white/20 hover:bg-white/10 font-medium"
                onClick={() => addTaskFrame('button')}
              >
                <DollarSign className="h-4 w-4 mr-2" />
                Buy/Sell Button
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="w-full justify-start text-white border-white/20 hover:bg-white/10 font-medium"
                onClick={() => addTaskFrame('custom')}
              >
                <Target className="h-4 w-4 mr-2" />
                Custom Area
              </Button>
            </div>
          )}
        </div>

        {/* Task Frames List */}
        <div className="mb-6">
          <h4 className="text-white font-medium mb-3">Task Frames ({taskFrames.length})</h4>
          <div className="space-y-2">
            {taskFrames.map((frame) => (
              <div
                key={frame.id}
                className={`p-3 rounded-lg border cursor-pointer ${
                  selectedFrame === frame.id
                    ? 'border-blue-500 bg-blue-500/20'
                    : 'border-white/20 bg-white/5 hover:bg-white/10'
                }`}
                onClick={() => setSelectedFrame(frame.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {frame.type === 'chart' && <TrendingUp className="h-4 w-4 text-blue-300" />}
                    {frame.type === 'indicator' && <BarChart3 className="h-4 w-4 text-green-300" />}
                    {frame.type === 'button' && <DollarSign className="h-4 w-4 text-yellow-300" />}
                    {frame.type === 'custom' && <Target className="h-4 w-4 text-purple-300" />}
                    <span className="text-white text-sm capitalize font-medium">{frame.type} Frame</span>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-red-300 hover:bg-red-500/20 p-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteFrame(frame.id);
                    }}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
                <div className="text-xs text-blue-200 mt-1 font-medium">
                  Conditions: {frame.conditions.length} | Actions: {frame.actions.length}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Frame Details */}
        {selectedFrameData && (
          <div className="space-y-4">
            <h4 className="text-white font-medium">Frame Settings</h4>
            
            {/* AI Command */}
            <div>
              <label className="text-white text-sm block mb-2 font-medium">AI Command</label>
              <Textarea
                value={selectedFrameData.aiCommand}
                onChange={(e) => updateAICommand(selectedFrameData.id, e.target.value)}
                placeholder="Tell AI what to detect and do in this frame..."
                className="bg-white/10 border-white/20 text-white placeholder-blue-200 resize-none"
                rows={3}
              />
            </div>

            {/* Conditions */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-white text-sm font-medium">Conditions</label>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-white border-white/20 hover:bg-white/10 font-medium"
                  onClick={() => addCondition(selectedFrameData.id)}
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Add Condition
                </Button>
              </div>
              {selectedFrameData.conditions.length === 0 ? (
                <p className="text-blue-200 text-xs">No conditions added yet</p>
              ) : (
                <div className="space-y-2">
                  {selectedFrameData.conditions.map((condition, index) => (
                    <div key={condition.id} className="bg-white/5 p-2 rounded border border-white/10">
                      <div className="text-xs text-white font-medium">
                        Condition {index + 1}: {condition.type} {condition.operator} {condition.value}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-white text-sm font-medium">Actions</label>
                <div className="flex space-x-1">
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-green-300 border-green-500/20 hover:bg-green-500/20 font-medium px-2 py-1"
                    onClick={() => addAction(selectedFrameData.id, 'buy')}
                  >
                    Buy
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-red-300 border-red-500/20 hover:bg-red-500/20 font-medium px-2 py-1"
                    onClick={() => addAction(selectedFrameData.id, 'sell')}
                  >
                    Sell
                  </Button>
                </div>
              </div>
              {selectedFrameData.actions.length === 0 ? (
                <p className="text-blue-200 text-xs">No actions added yet</p>
              ) : (
                <div className="space-y-2">
                  {selectedFrameData.actions.map((action, index) => (
                    <div key={action.id} className="bg-white/5 p-2 rounded border border-white/10">
                      <div className="text-xs text-white font-medium">
                        Action {index + 1}: {action.type.toUpperCase()} at {action.price} price
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Save Button */}
        <div className="mt-6 pt-4 border-t border-white/20">
          <Button
            onClick={saveTask}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium"
          >
            <Play className="h-4 w-4 mr-2" />
            Save & Activate Task
          </Button>
        </div>
      </div>

      {/* Frame Canvas */}
      <div 
        ref={containerRef}
        className="flex-1 relative"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        {taskFrames.map((frame) => (
          <div
            key={frame.id}
            className={`absolute border-2 border-dashed rounded-lg cursor-move ${
              selectedFrame === frame.id
                ? 'border-blue-400 bg-blue-400/10'
                : 'border-white/40 bg-white/5'
            }`}
            style={{
              left: frame.x,
              top: frame.y,
              width: frame.width,
              height: frame.height
            }}
            onMouseDown={(e) => handleMouseDown(frame.id, e)}
            onClick={() => setSelectedFrame(frame.id)}
          >
            <div className="absolute -top-6 left-0 bg-black/80 px-2 py-1 rounded text-xs text-white font-medium">
              {frame.type} Frame
            </div>
            <div className="absolute top-2 right-2">
              <Move className="h-4 w-4 text-white/60" />
            </div>
            <div className="h-full flex items-center justify-center">
              {frame.type === 'chart' && <TrendingUp className="h-8 w-8 text-blue-300/50" />}
              {frame.type === 'indicator' && <BarChart3 className="h-8 w-8 text-green-300/50" />}
              {frame.type === 'button' && <DollarSign className="h-8 w-8 text-yellow-300/50" />}
              {frame.type === 'custom' && <Target className="h-8 w-8 text-purple-300/50" />}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
