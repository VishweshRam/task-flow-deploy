
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Calendar, Clock, CheckCircle2, Circle, AlertTriangle } from "lucide-react";
import { format } from "date-fns";

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

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onToggleStatus: (taskId: string) => void;
}

const TaskCard = ({ task, onEdit, onDelete, onToggleStatus }: TaskCardProps) => {
  const priorityColors = {
    low: 'from-green-500 to-emerald-500',
    medium: 'from-orange-500 to-amber-500',
    high: 'from-red-500 to-rose-500'
  };

  const statusColors = {
    todo: 'bg-slate-100 text-slate-700',
    'in-progress': 'bg-blue-100 text-blue-700',
    completed: 'bg-green-100 text-green-700'
  };

  const statusIcons = {
    todo: Circle,
    'in-progress': Clock,
    completed: CheckCircle2
  };

  const StatusIcon = statusIcons[task.status];

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'completed';

  return (
    <Card className="p-6 border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <button
              onClick={() => onToggleStatus(task.id)}
              className="flex items-center justify-center w-6 h-6 rounded-full border-2 border-slate-300 hover:border-blue-500 transition-colors"
            >
              <StatusIcon className={`w-4 h-4 ${task.status === 'completed' ? 'text-green-600' : 'text-slate-400'}`} />
            </button>
            <h3 className={`text-lg font-semibold ${task.status === 'completed' ? 'line-through text-slate-500' : 'text-slate-800'}`}>
              {task.title}
            </h3>
          </div>
          <p className={`text-slate-600 mb-4 ${task.status === 'completed' ? 'line-through' : ''}`}>
            {task.description}
          </p>
        </div>

        <div className="flex items-center space-x-2 ml-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(task)}
            className="p-2 hover:bg-blue-50 hover:border-blue-300"
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(task.id)}
            className="p-2 hover:bg-red-50 hover:border-red-300 text-red-600"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Priority Badge */}
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${priorityColors[task.priority]}`}></div>
            <span className="text-sm font-medium text-slate-600 capitalize">{task.priority}</span>
          </div>

          {/* Status Badge */}
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[task.status]}`}>
            {task.status.replace('-', ' ').toUpperCase()}
          </span>

          {/* Due Date */}
          {task.dueDate && (
            <div className={`flex items-center space-x-1 text-sm ${isOverdue ? 'text-red-600' : 'text-slate-600'}`}>
              {isOverdue && <AlertTriangle className="w-4 h-4" />}
              <Calendar className="w-4 h-4" />
              <span>{format(new Date(task.dueDate), 'MMM dd, yyyy')}</span>
              {isOverdue && <span className="text-xs font-medium text-red-600 ml-1">(Overdue)</span>}
            </div>
          )}
        </div>

        <div className="text-xs text-slate-500">
          Updated {format(new Date(task.updatedAt), 'MMM dd, HH:mm')}
        </div>
      </div>
    </Card>
  );
};

export default TaskCard;
