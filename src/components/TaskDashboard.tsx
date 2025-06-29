
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LogOut, Plus, Search, Filter, Calendar, CheckCircle2, Circle, Clock, AlertCircle } from "lucide-react";
import TaskForm from "./TaskForm";
import TaskCard from "./TaskCard";

interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'in-progress' | 'completed';
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

interface TaskDashboardProps {
  user: any;
  onLogout: () => void;
}

const TaskDashboard = ({ user, onLogout }: TaskDashboardProps) => {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Setup CI/CD Pipeline',
      description: 'Configure GitHub Actions for automated deployment',
      priority: 'high',
      status: 'in-progress',
      dueDate: '2024-01-15',
      createdAt: '2024-01-10T10:00:00Z',
      updatedAt: '2024-01-10T10:00:00Z'
    },
    {
      id: '2',
      title: 'Write API Documentation',
      description: 'Document all REST endpoints for the task management system',
      priority: 'medium',
      status: 'todo',
      dueDate: '2024-01-20',
      createdAt: '2024-01-10T11:00:00Z',
      updatedAt: '2024-01-10T11:00:00Z'
    },
    {
      id: '3',
      title: 'Update README',
      description: 'Add setup instructions and deployment guide',
      priority: 'low',
      status: 'completed',
      createdAt: '2024-01-09T09:00:00Z',
      updatedAt: '2024-01-10T12:00:00Z'
    }
  ]);

  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const handleAddTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    console.log('Adding new task:', newTask);
    setTasks([newTask, ...tasks]);
    setShowTaskForm(false);
  };

  const handleEditTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!editingTask) return;
    
    const updatedTask: Task = {
      ...editingTask,
      ...taskData,
      updatedAt: new Date().toISOString()
    };
    
    console.log('Updating task:', updatedTask);
    setTasks(tasks.map(task => task.id === editingTask.id ? updatedTask : task));
    setEditingTask(null);
    setShowTaskForm(false);
  };

  const handleDeleteTask = (taskId: string) => {
    console.log('Deleting task:', taskId);
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const handleToggleStatus = (taskId: string) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        const newStatus = task.status === 'completed' ? 'todo' : 'completed';
        console.log(`Toggling task ${taskId} status to:`, newStatus);
        return {
          ...task,
          status: newStatus,
          updatedAt: new Date().toISOString()
        };
      }
      return task;
    }));
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || task.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const taskStats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'completed').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    todo: tasks.filter(t => t.status === 'todo').length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">T</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-800">TaskFlow</h1>
                <p className="text-sm text-slate-600">Welcome back, {user?.name || user?.email}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                onClick={() => setShowTaskForm(true)}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Task
              </Button>
              <Button variant="outline" onClick={onLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600">Total Tasks</p>
                <p className="text-2xl font-bold text-slate-900">{taskStats.total}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600">Completed</p>
                <p className="text-2xl font-bold text-slate-900">{taskStats.completed}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-500 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600">In Progress</p>
                <p className="text-2xl font-bold text-slate-900">{taskStats.inProgress}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-br from-slate-500 to-slate-600 rounded-lg flex items-center justify-center">
                <Circle className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600">To Do</p>
                <p className="text-2xl font-bold text-slate-900">{taskStats.todo}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="p-6 mb-8 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Tasks</option>
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Tasks Grid */}
        <div className="grid gap-6">
          {filteredTasks.length === 0 ? (
            <Card className="p-12 text-center border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <div className="w-16 h-16 bg-gradient-to-br from-slate-400 to-slate-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">No tasks found</h3>
              <p className="text-slate-600 mb-6">
                {searchTerm || filterStatus !== "all" 
                  ? "Try adjusting your search or filter criteria" 
                  : "Get started by creating your first task"}
              </p>
              <Button
                onClick={() => setShowTaskForm(true)}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Task
              </Button>
            </Card>
          ) : (
            filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={(task) => {
                  setEditingTask(task);
                  setShowTaskForm(true);
                }}
                onDelete={handleDeleteTask}
                onToggleStatus={handleToggleStatus}
              />
            ))
          )}
        </div>
      </div>

      {/* Task Form Modal */}
      <TaskForm
        isOpen={showTaskForm}
        onClose={() => {
          setShowTaskForm(false);
          setEditingTask(null);
        }}
        onSubmit={editingTask ? handleEditTask : handleAddTask}
        task={editingTask}
      />
    </div>
  );
};

export default TaskDashboard;
