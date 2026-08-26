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
    const [user, setUser] = useState(() => {
        try {
            const saved = localStorage.getItem('adminUser');
            return saved ? JSON.parse(saved) : null;
        } catch {
            return null;
        }
    });

    const fetchPublicData = async () => {
        try {
            setLoading(true);
            const [profData, projData, skillsData, expData, eduData, certData] = await Promise.all([
                apiService.getProfile().catch(() => null),
                apiService.getProjects().catch(() => []),
                apiService.getSkills().catch(() => []),
                apiService.getExperience().catch(() => []),
                apiService.getEducation().catch(() => []),
                apiService.getCertifications().catch(() => [])
            ]);

            setProfile(profData || {
                name: 'Wafa Amjad',
                title: 'Full-Stack Developer & Software Engineer',
                location: 'Abbottabad, KPK, Pakistan',
                email: 'wafaamjad058@gmail.com',
                bio: 'Building practical web and mobile applications using modern technologies.',
                long_bio: 'I am Wafa Amjad, a Computer Science undergraduate at COMSATS University Islamabad, Abbottabad Campus. I specialize in designing and engineering practical web and mobile applications from concept to deployment.',
                github_url: 'https://github.com/Wafa-Amjad',
                linkedin_url: 'https://linkedin.com/in/wafa-amjad'
            });
            setProjects(Array.isArray(projData) ? projData : []);
            setSkills(Array.isArray(skillsData) ? skillsData : []);
            setExperience(Array.isArray(expData) ? expData : []);
            setEducation(Array.isArray(eduData) ? eduData : []);
            setCertifications(Array.isArray(certData) ? certData : []);
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
    }, []);

    const loginAdmin = async (email, password) => {
        try {
            const data = await apiService.login(email, password);
            localStorage.setItem('token', data.token);
            if (data.user) {
                localStorage.setItem('adminUser', JSON.stringify(data.user));
            }
            setToken(data.token);
            setUser(data.user);
            return data;
        } catch (err) {
            throw new Error(err.response?.data?.error || 'Authentication failed');
        }
    };

    const logoutAdmin = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('adminUser');
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
