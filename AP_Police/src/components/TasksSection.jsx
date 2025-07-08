  import React, { useState, useEffect } from "react";
  import { Bell, Search, Filter, Clock, Trash } from "lucide-react";

  const TasksSection = () => {
    const [activeTab, setActiveTab] = useState("myTasks");
    const [searchTerm, setSearchTerm] = useState("");
    const [filter, setFilter] = useState("all");
    const [taskStatuses, setTaskStatuses] = useState({});
    const [tasks, setTasks] = useState([]);

    const memId = localStorage.getItem("memberId");

    useEffect(() => {
  if (!memId) return;

  const fetchAndTranslateTasks = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/tasks/byOfficer/${memId}`);
      const data = await res.json();

      // Identify Telugu lines
      const teluguRegex = /[\u0C00-\u0C7F]/;
      const teluguTasks = data.filter((task) => teluguRegex.test(task.description));

      const teluguDescriptions = teluguTasks.map((task) => task.description);

      // Fetch translations if needed
      if (teluguDescriptions.length > 0) {
        const translationRes = await fetch('http://localhost:5000/api/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ texts: teluguDescriptions }),
        });

        const { translations } = await translationRes.json();

        // Replace Telugu descriptions with English ones
        teluguTasks.forEach((task, index) => {
          task.description = translations[index];
        });
      }

      setTasks(data);
    } catch (err) {
      console.error('Error fetching or translating tasks:', err);
    }
  };

  fetchAndTranslateTasks();
}, [memId]);


    const getStatusColor = (status) => {
      switch (status) {
        case "pending":
          return "text-red-600";
        case "in progress":
          return "text-yellow-600";
        case "completed":
          return "text-green-600";
        default:
          return "text-gray-600";
      }
    };

    const formatDate = (dateStr) =>
      new Date(dateStr).toLocaleString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });

    const isDeadlineNear = (dateStr) => {
      const now = new Date();
      const deadline = new Date(dateStr);
      const hoursLeft = (deadline - now) / (1000 * 60 * 60);
      return hoursLeft <= 24 && hoursLeft > 0;
    };

    const handleStatusChange = (taskId, newStatus) => {
      setTaskStatuses((prev) => ({ ...prev, [taskId]: newStatus }));
    };

    const handleStatusUpdate = async (taskId) => {
      const newStatus = taskStatuses[taskId];
      if (!newStatus) return;

      try {
        await fetch(`http://localhost:5000/api/tasks/update/${taskId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            status: newStatus,
            completion_message_id: Math.floor(Math.random() * 100000),
          }),
        });

        setTasks((prev) =>
          prev.map((task) =>
            task._id === taskId ? { ...task, status: newStatus } : task
          )
        );

        setTaskStatuses((prev) => {
          const updated = { ...prev };
          delete updated[taskId];
          return updated;
        });
      } catch (err) {
        console.error("Error updating task:", err);
      }
    };

    const deleteTask = async (taskId) => {
      try {
        await fetch(`http://localhost:5000/api/tasks/delete/${taskId}`, {
          method: "DELETE",
        });
        setTasks((prev) => prev.filter((t) => t._id !== taskId));
      } catch (err) {
        console.error("Error deleting task:", err);
      }
    };
  const myTasks = tasks
    .filter((t) => t.assigned_to === memId)
    .filter((task) => {
      const matchesSearch = task.description
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesFilter = filter === "all" || task.status === filter;
      return matchesSearch && matchesFilter;
    });
      const assignedTasks = tasks
    .filter((t) => t.assigned_by === memId)
    .filter((task) => {
      const matchesSearch = task.description
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesFilter = filter === "all" || task.status === filter;
      return matchesSearch && matchesFilter;
    });

    // const filteredTasks = tasks.filter((task) => {
    //   const matchesSearch = task.description
    //     ?.toLowerCase()
    //     .includes(searchTerm.toLowerCase());
    //   const matchesFilter = filter === "all" || task.status === filter;
    //   return matchesSearch && matchesFilter;
    // });

    // const myTasks = filteredTasks.filter((t) => t.assigned_to === memId);
    // const assignedTasks = filteredTasks.filter((t) => t.assigned_by === memId);

    const renderTaskCard = (task, isMyTask) => {
      const pendingChange = taskStatuses[task._id];
      const assignedDate =
        task.message_date && !isNaN(Date.parse(task.message_date))
          ? task.message_date
          : task.createdAt;

      return (
        <div
          key={task._id}
          className="bg-white p-4 rounded-lg shadow border border-gray-200 space-y-4"
        >
          <h4 className="text-lg font-semibold text-gray-800">
            {task.description} 
          </h4>

          <div className="text-sm text-gray-500 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Assigned On: {formatDate(assignedDate)}
          </div>
          <div className="grid gap-2 text-sm text-gray-700">
            <div className="flex justify-between">
              <span>{isMyTask ? "Assigned By:" : "Assigned To:"}</span>
              <span className="font-medium text-gray-800">
                {isMyTask ? task.assigned_by : task.assigned_to}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Status:</span>
              {isMyTask ? (
                <select
                  value={pendingChange || task.status}
                  onChange={(e) => handleStatusChange(task._id, e.target.value)}
                  className={`border border-gray-300 px-2 py-1 rounded text-sm focus:outline-none ${getStatusColor(
                    pendingChange || task.status
                  )}`}
                >
                  <option value="pending">Pending</option>
                  <option value="in progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              ) : (
                <span
                  className={`font-medium capitalize ${getStatusColor(
                    task.status
                  )}`}
                >
                  {task.status}
                </span>
              )}
            </div>

            <div className="flex justify-between pt-2">
              {isMyTask && pendingChange && pendingChange !== task.status && (
                <button
                  onClick={() => handleStatusUpdate(task._id)}
                  className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800 text-sm font-medium"
                >
                  Update
                </button>
              )}
              {!isMyTask && (
                <button
                  onClick={() => deleteTask(task._id)}
                  className="px-2 py-1 text-red-600 hover:text-red-800 flex items-center gap-1 text-sm"
                >
                  <Trash className="w-4 h-4" /> Delete
                </button>
              )}
            </div>
          </div>
        </div>
      );
    };

    return (
      <div className="min-h-screen bg-gray-100 p-6 space-y-6">
        {/* Header */}
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Manage Tasks</h2>
            <p className="text-gray-500">
              Track and manage your assigned or delegated tasks
            </p>
          </div>
          <div className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full border border-gray-300">
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">
              {tasks.filter((t) => isDeadlineNear(t.message_date)).length} urgent
              task(s)
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow border border-gray-200">
          <div className="flex">
            <button
              onClick={() => setActiveTab("myTasks")}
              className={`flex-1 px-6 py-3 text-sm font-medium border-b-2 ${
                activeTab === "myTasks"
                  ? "border-gray-600 text-gray-800"
                  : "border-transparent text-gray-500"
              }`}
            >
              Assigned To Me ({myTasks.length})
            </button>
            <button
              onClick={() => setActiveTab("assignedTasks")}
              className={`flex-1 px-6 py-3 text-sm font-medium border-b-2 ${
                activeTab === "assignedTasks"
                  ? "border-gray-600 text-gray-800"
                  : "border-transparent text-gray-500"
              }`}
            >
              Assigned To Others ({assignedTasks.length})
            </button>
          </div>

          {/* Search & Filter */}
          <div className="p-4 border-t border-gray-200 bg-gray-50 flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="relative w-full sm:max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-400 bg-white"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-400 bg-white"
              >
                <option value="all">All</option>
                <option value="pending">Pending</option>
                <option value="in progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Task Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {(activeTab === "myTasks" ? myTasks : assignedTasks).map((task) =>
            renderTaskCard(task, activeTab === "myTasks")
          )}
        </div>
      </div>
    );
  };

  export default TasksSection;
