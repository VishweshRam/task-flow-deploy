
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { CalendarIcon, AlertCircle, Clock, CheckCircle } from "lucide-react";

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

interface TaskFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  task?: Task | null;
}

const TaskForm = ({ isOpen, onClose, onSubmit, task }: TaskFormProps) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium" as 'low' | 'medium' | 'high',
    status: "todo" as 'todo' | 'in-progress' | 'completed',
    dueDate: ""
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description,
        priority: task.priority,
        status: task.status,
        dueDate: task.dueDate || ""
      });
    } else {
      setFormData({
        title: "",
        description: "",
        priority: "medium",
        status: "todo",
        dueDate: ""
      });
    }
  }, [task, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    console.log(`${task ? 'Updating' : 'Creating'} task:`, formData);
    
    // Simulate API call (will be replaced with Supabase)
    await new Promise(resolve => setTimeout(resolve, 500));
    
    onSubmit({
      ...formData,
      dueDate: formData.dueDate || undefined
    });
    
    setIsLoading(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const priorityColors = {
    low: 'from-green-500 to-emerald-500',
    medium: 'from-orange-500 to-amber-500',
    high: 'from-red-500 to-rose-500'
  };

  const statusIcons = {
    todo: Circle,
    'in-progress': Clock,
    completed: CheckCircle
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg border-0 shadow-2xl bg-white/95 backdrop-blur-sm">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
            {task ? "Edit Task" : "Create New Task"}
          </DialogTitle>
        </DialogHeader>

        <Card className="border-0 shadow-none bg-transparent">
          <form onSubmit={handleSubmit} className="space-y-6 p-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-slate-700 font-medium">Task Title</Label>
              <Input
                id="title"
                name="title"
                type="text"
                placeholder="Enter task title"
                value={formData.title}
                onChange={handleInputChange}
                className="border-slate-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-slate-700 font-medium">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Enter task description"
                value={formData.description}
                onChange={handleInputChange}
                className="border-slate-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg min-h-[100px]"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="priority" className="text-slate-700 font-medium">Priority</Label>
                <select
                  id="priority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
                <div className="flex items-center space-x-2 mt-1">
                  <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${priorityColors[formData.priority]}`}></div>
                  <span className="text-sm text-slate-600 capitalize">{formData.priority} Priority</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status" className="text-slate-700 font-medium">Status</Label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
                <div className="flex items-center space-x-2 mt-1">
                  {(() => {
                    const StatusIcon = statusIcons[formData.status];
                    return <StatusIcon className="w-3 h-3 text-slate-600" />;
                  })()}
                  <span className="text-sm text-slate-600 capitalize">{formData.status.replace('-', ' ')}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dueDate" className="text-slate-700 font-medium">Due Date (Optional)</Label>
              <div className="relative">
                <CalendarIcon className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  id="dueDate"
                  name="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={handleInputChange}
                  className="pl-10 border-slate-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                />
              </div>
            </div>

            <div className="flex space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1 border-slate-300 text-slate-700 hover:bg-slate-50"
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {task ? "Updating..." : "Creating..."}
                  </div>
                ) : (
                  task ? "Update Task" : "Create Task"
                )}
              </Button>
            </div>
          </form>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default TaskForm;
