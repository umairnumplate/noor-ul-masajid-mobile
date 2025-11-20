
import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Students from './components/Students';
import Teachers from './components/Teachers';
import Attendance from './components/Attendance';
import StudentReport from './components/StudentReport';
import NotFound from './components/NotFound';
import Graduates from './components/Alumni';
import Tanzim from './components/Tanzim';
import MadrasaFees from './components/MadrasaFees';

const App: React.FC = () => {
  return (
    <AppProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="students" element={<Students />} />
            <Route path="teachers" element={<Teachers />} />
            <Route path="attendance" element={<Attendance />} />
            <Route path="graduates" element={<Graduates />} />
            <Route path="tanzim" element={<Tanzim />} />
            <Route path="madrasa-fees" element={<MadrasaFees />} />
          </Route>
          <Route path="/report/:studentId" element={<StudentReport />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </HashRouter>
    </AppProvider>
  );
};

export default App;
