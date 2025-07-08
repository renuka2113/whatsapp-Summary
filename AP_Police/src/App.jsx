
import './App.css'
import { Routes, Route } from 'react-router-dom';
import APPoliceHomepage from './components/APPoliceHomePage';
import PoliceDashboard from './components/PoliceDashboard';
import DashboardStats from './components/DashboardStats';
import RulesSection from './components/RulesSection';
import TasksSection from './components/TasksSection';
import SummarySection from './components/SummarySection';
import ProfileModal from './components/ProfileModal';


function App() {
 
  return (
     <Routes>
      <Route path="/" element={<APPoliceHomepage />} />
      <Route path="/PoliceDashboard" element={<PoliceDashboard />} />
      <Route path="/DashboardStats" element={<DashboardStats />} />
      <Route path="/RulesSection" element={<RulesSection/>}/>
      <Route path="/TasksSection" element={<TasksSection />} />
      <Route path="/SummarySection" element={<SummarySection />} />
      <Route path="/ProfileModal" element=
      {<ProfileModal/>} />
    </Routes>
     
  )
}

export default App
