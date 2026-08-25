import axios from 'axios';

const api = axios.create({
    baseURL: '', // Handled by Vite proxy during development and same-domain in production
});

// Automatically inject Authorization Bearer token if it exists in localStorage
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export const apiService = {
    // auth
    login: async (email, password) => {
        const res = await api.post('/api/auth/login', { email, password });
        return res.data;
    },

    // profile
    getProfile: async () => {
        const res = await api.get('/api/profile');
        return res.data;
    },
    updateProfile: async (data) => {
        const res = await api.put('/api/profile', data);
        return res.data;
    },

    // projects
    getProjects: async () => {
        const res = await api.get('/api/projects');
        return res.data;
    },
    getProjectById: async (id) => {
        const res = await api.get(`/api/projects/${id}`);
        return res.data;
    },
    createProject: async (data) => {
        const res = await api.post('/api/projects', data);
        return res.data;
    },
    updateProject: async (id, data) => {
        const res = await api.put(`/api/projects/${id}`, data);
        return res.data;
    },
    deleteProject: async (id) => {
        const res = await api.delete(`/api/projects/${id}`);
        return res.data;
    },

    // skills
    getSkills: async () => {
        const res = await api.get('/api/skills');
        return res.data;
    },
    createSkill: async (data) => {
        const res = await api.post('/api/skills', data);
        return res.data;
    },
    updateSkill: async (id, data) => {
        const res = await api.put(`/api/skills/${id}`, data);
        return res.data;
    },
    deleteSkill: async (id) => {
        const res = await api.delete(`/api/skills/${id}`);
        return res.data;
    },

    // experience
    getExperience: async () => {
        const res = await api.get('/api/experience');
        return res.data;
    },
    createExperience: async (data) => {
        const res = await api.post('/api/experience', data);
        return res.data;
    },
    updateExperience: async (id, data) => {
        const res = await api.put(`/api/experience/${id}`, data);
        return res.data;
    },
    deleteExperience: async (id) => {
        const res = await api.delete(`/api/experience/${id}`);
        return res.data;
    },

    // education
    getEducation: async () => {
        const res = await api.get('/api/education');
        return res.data;
    },
    createEducation: async (data) => {
        const res = await api.post('/api/education', data);
        return res.data;
    },
    updateEducation: async (id, data) => {
        const res = await api.put(`/api/education/${id}`, data);
        return res.data;
    },
    deleteEducation: async (id) => {
        const res = await api.delete(`/api/education/${id}`);
        return res.data;
    },

    // certifications
    getCertifications: async () => {
        const res = await api.get('/api/certifications');
        return res.data;
    },
    createCertification: async (data) => {
        const res = await api.post('/api/certifications', data);
        return res.data;
    },
    updateCertification: async (id, data) => {
        const res = await api.put(`/api/certifications/${id}`, data);
        return res.data;
    },
    deleteCertification: async (id) => {
        const res = await api.delete(`/api/certifications/${id}`);
        return res.data;
    },

    // messages
    sendMessage: async (data) => {
        const res = await api.post('/api/messages', data);
        return res.data;
    },
    getMessages: async () => {
        const res = await api.get('/api/messages');
        return res.data;
    },
    markMessageRead: async (id, readStatus = true) => {
        const res = await api.put(`/api/messages/${id}/read`, { read: readStatus });
        return res.data;
    },
    deleteMessage: async (id) => {
        const res = await api.delete(`/api/messages/${id}`);
        return res.data;
    }
};
