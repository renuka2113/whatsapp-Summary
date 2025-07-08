import React from 'react';
import { CheckSquare, Clock, CheckCircle, AlertCircle } from 'lucide-react';

const DashboardStats = ({ tasks }) => {
  // Get status counts
  const getStatusCounts = () => {
    return {
      total: tasks.length,
      open: tasks.filter(t => t.status === 'open').length,
      inProgress: tasks.filter(t => t.status === 'in progress').length,
      completed: tasks.filter(t => t.status === 'completed').length
    };
  };

  const statusCounts = getStatusCounts();

  // Get status color and icon
  const getStatusDisplay = (status) => {
    switch(status) {
      case 'open':
        return { color: 'text-blue-600 bg-blue-100', icon: AlertCircle, text: 'Open' };
      case 'in progress':
        return { color: 'text-yellow-600 bg-yellow-100', icon: Clock, text: 'In Progress' };
      case 'completed':
        return { color: 'text-green-600 bg-green-100', icon: CheckCircle, text: 'Completed' };
      default:
        return { color: 'text-gray-600 bg-gray-100', icon: AlertCircle, text: 'Unknown' };
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
        <p className="text-gray-600">Overview of your daily activities and task status</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CheckSquare className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Tasks</p>
              <p className="text-2xl font-semibold text-gray-900">{statusCounts.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">In Progress</p>
              <p className="text-2xl font-semibold text-gray-900">{statusCounts.inProgress}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-semibold text-gray-900">{statusCounts.completed}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-semibold text-gray-900">{statusCounts.open}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Tasks */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Recent Tasks</h3>
        </div>
        <div className="p-6">
          {tasks.slice(0, 3).map((task) => {
            const statusDisplay = getStatusDisplay(task.status);
            const StatusIcon = statusDisplay.icon;
            
            return (
              <div key={task.id} className="flex items-center justify-between py-3 border-b last:border-b-0">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{task.taskName}</h4>
                  <p className="text-sm text-gray-500">Due: {formatDate(task.deadline)}</p>
                </div>
                <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${statusDisplay.color}`}>
                  <StatusIcon className="h-3 w-3" />
                  <span>{statusDisplay.text}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;