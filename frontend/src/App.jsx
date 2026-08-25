import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { PortfolioProvider } from './context/PortfolioContext';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';

// Public Pages
import Home from './pages/Home';
import About from './pages/About';
import Skills from './pages/Skills';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import Experience from './pages/Experience';
import Education from './pages/Education';
import Certifications from './pages/Certifications';
import Contact from './pages/Contact';

// Admin Pages
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminProjects from './pages/AdminProjects';
import AdminSkills from './pages/AdminSkills';
import AdminExperience from './pages/AdminExperience';
import AdminEducation from './pages/AdminEducation';
import AdminCertifications from './pages/AdminCertifications';
import AdminProfile from './pages/AdminProfile';
import AdminMessages from './pages/AdminMessages';

function App() {
    return (
        <PortfolioProvider>
            <BrowserRouter>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<PublicLayout />}>
                        <Route index element={<Home />} />
                        <Route path="about" element={<About />} />
                        <Route path="skills" element={<Skills />} />
                        <Route path="projects" element={<Projects />} />
                        <Route path="projects/:id" element={<ProjectDetail />} />
                        <Route path="experience" element={<Experience />} />
                        <Route path="education" element={<Education />} />
                        <Route path="certifications" element={<Certifications />} />
                        <Route path="contact" element={<Contact />} />
                    </Route>

                    {/* Admin Login Route */}
                    <Route path="/admin/login" element={<AdminLogin />} />

                    {/* Protected Console Admin Routes */}
                    <Route path="/admin" element={<AdminLayout />}>
                        <Route index element={<Navigate to="/admin/dashboard" replace />} />
                        <Route path="dashboard" element={<AdminDashboard />} />
                        <Route path="projects" element={<AdminProjects />} />
                        <Route path="skills" element={<AdminSkills />} />
                        <Route path="experience" element={<AdminExperience />} />
                        <Route path="education" element={<AdminEducation />} />
                        <Route path="certifications" element={<AdminCertifications />} />
                        <Route path="profile" element={<AdminProfile />} />
                        <Route path="messages" element={<AdminMessages />} />
                    </Route>

                    {/* Catch-all Routing Redirect */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </BrowserRouter>
        </PortfolioProvider>
    );
}

export default App;
