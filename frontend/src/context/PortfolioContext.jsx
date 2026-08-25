import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiService } from '../services/api';

const PortfolioContext = createContext(null);

export const PortfolioProvider = ({ children }) => {
    const [profile, setProfile] = useState(null);
    const [projects, setProjects] = useState([]);
    const [skills, setSkills] = useState([]);
    const [experience, setExperience] = useState([]);
    const [education, setEducation] = useState([]);
    const [certifications, setCertifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Admin Auth State
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [user, setUser] = useState(null);

    const fetchPublicData = async () => {
        try {
            setLoading(true);
            const [profData, projData, skillsData, expData, eduData, certData] = await Promise.all([
                apiService.getProfile(),
                apiService.getProjects(),
                apiService.getSkills(),
                apiService.getExperience(),
                apiService.getEducation(),
                apiService.getCertifications().catch(() => []) // Fallback in case of errors
            ]);

            setProfile(profData);
            setProjects(projData);
            setSkills(skillsData);
            setExperience(expData);
            setEducation(eduData);
            setCertifications(certData);
            setError(null);
        } catch (err) {
            console.error('Error fetching public portfolio data:', err);
            setError('Unable to load portfolio details. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPublicData();
        // Decode user if token is present
        if (token) {
            // In a real application, we might decode the JWT, but here we can just set mock user info
            setUser({ email: localStorage.getItem('adminEmail') || 'wafaamjad058@gmail.com', role: 'admin' });
        }
    }, [token]);

    const loginAdmin = async (email, password) => {
        try {
            const data = await apiService.login(email, password);
            localStorage.setItem('token', data.token);
            localStorage.setItem('adminEmail', data.user.email);
            setToken(data.token);
            setUser(data.user);
            return data;
        } catch (err) {
            throw new Error(err.response?.data?.error || 'Authentication failed');
        }
    };

    const logoutAdmin = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('adminEmail');
        setToken(null);
        setUser(null);
    };

    const refreshData = async () => {
        await fetchPublicData();
    };

    return (
        <PortfolioContext.Provider
            value={{
                profile,
                projects,
                skills,
                experience,
                education,
                certifications,
                loading,
                error,
                token,
                user,
                loginAdmin,
                logoutAdmin,
                refreshData
            }}
        >
            {children}
        </PortfolioContext.Provider>
    );
};

export const usePortfolio = () => {
    const context = useContext(PortfolioContext);
    if (!context) {
        throw new Error('usePortfolio must be used within a PortfolioProvider');
    }
    return context;
};
