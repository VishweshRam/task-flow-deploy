
import MobileTaskDashboard from "./MobileTaskDashboard";

interface TaskDashboardProps {
  user: any;
  onLogout: () => void;
}

const TaskDashboard = ({ user, onLogout }: TaskDashboardProps) => {
  return <MobileTaskDashboard user={user} onLogout={onLogout} />;
};

export default TaskDashboard;
