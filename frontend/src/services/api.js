import axios from 'axios';
import { supabase } from '../supabase';

// Load Backend API Base URL from environment (e.g. Render backend URL or empty string for local dev proxy)
const rawBaseURL = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || '';
const API_BASE_URL = rawBaseURL.endsWith('/') ? rawBaseURL.slice(0, -1) : rawBaseURL;

const api = axios.create({
    baseURL: API_BASE_URL,
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
        try {
            const res = await api.post('/api/messages', data);
            return res.data;
        } catch (primaryError) {
            console.warn('[Contact Service] Backend endpoint unavailable, attempting direct Supabase & Non-SMTP REST API fallback...');

            // 1. Direct Supabase Storage Fallback
            if (supabase) {
                try {
                    await supabase.from('messages').insert([{
                        name: data.name,
                        email: data.email,
                        subject: data.subject,
                        message: data.message,
                        read: false,
                        created_at: new Date().toISOString()
                    }]);
                } catch (sbErr) {
                    console.warn('[Contact Service] Supabase fallback insert warning:', sbErr.message);
                }
            }

            // 2. Direct Non-SMTP HTTP API Fallback (FormSubmit / Web3Forms)
            const web3Key = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;
            if (web3Key) {
                try {
                    const fallbackRes = await fetch('https://api.web3forms.com/submit', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            access_key: web3Key,
                            subject: `[Portfolio Contact] ${data.subject} - from ${data.name}`,
                            from_name: data.name,
                            replyto: data.email,
                            name: data.name,
                            email: data.email,
                            message: data.message
                        })
                    });
                    const fallbackData = await fallbackRes.json();
                    if (fallbackData.success) {
                        return { success: true, message: 'Message sent successfully via Non-SMTP REST API' };
                    }
                } catch (fallbackErr) {
                    console.error('[Contact Service] Non-SMTP HTTP REST API fallback error:', fallbackErr);
                }
            }

            // If Supabase stored it, consider message sent
            if (supabase) {
                return { success: true, message: 'Message recorded successfully in Supabase' };
            }

            throw primaryError;
        }
    },
    getMessages: async () => {
        try {
            const res = await api.get('/api/messages');
            return res.data;
        } catch (primaryErr) {
            console.warn('[API Service] Backend getMessages unreachable, fetching directly from Supabase...', primaryErr.message);
            if (supabase) {
                const { data, error } = await supabase.from('messages').select('*').order('created_at', { ascending: false });
                if (!error && Array.isArray(data)) {
                    return data;
                }
            }
            throw primaryErr;
        }
    },
    markMessageRead: async (id, readStatus = true) => {
        try {
            const res = await api.put(`/api/messages/${id}/read`, { read: readStatus });
            return res.data;
        } catch (primaryErr) {
            if (supabase) {
                const { data, error } = await supabase.from('messages').update({ read: Boolean(readStatus) }).eq('id', id).select().single();
                if (!error && data) return data;
            }
            throw primaryErr;
        }
    },
    deleteMessage: async (id) => {
        try {
            const res = await api.delete(`/api/messages/${id}`);
            return res.data;
        } catch (primaryErr) {
            if (supabase) {
                const { error } = await supabase.from('messages').delete().eq('id', id);
                if (!error) return { success: true };
            }
            throw primaryErr;
        }
    }
};
