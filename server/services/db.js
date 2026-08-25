import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import supabase from '../config/supabase.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbFilePath = path.join(__dirname, '..', 'data', 'db.json');

// Helper to check if Supabase is active
const isSupabaseActive = () => supabase !== null;

// Local JSON File Helper Functions
async function readLocalDb() {
    try {
        const data = await fs.readFile(dbFilePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading local DB file, returning empty structure:', error);
        return {
            profile: {},
            projects: [],
            skills: [],
            experience: [],
            education: [],
            certifications: [],
            messages: []
        };
    }
}

async function writeLocalDb(data) {
    try {
        await fs.writeFile(dbFilePath, JSON.stringify(data, null, 2), 'utf-8');
        return true;
    } catch (error) {
        console.error('Error writing local DB file:', error);
        return false;
    }
}

// -------------------------------------------------------------
// Database Operations Service
// -------------------------------------------------------------

export const dbService = {
    // -- PROFILE --
    getProfile: async () => {
        if (isSupabaseActive()) {
            const { data, error } = await supabase.from('profiles').select('*').limit(1).maybeSingle();
            if (!error && data) return data;
            // Fallback if profiles table is empty or error
            if (error) console.error('Supabase Profiles Error:', error);
        }
        const db = await readLocalDb();
        return db.profile;
    },

    updateProfile: async (profileData) => {
        if (isSupabaseActive()) {
            // Assuming single profile entry. We query first or upsert.
            const { data: firstProfile } = await supabase.from('profiles').select('id').limit(1).maybeSingle();
            let query;
            if (firstProfile) {
                query = supabase.from('profiles').update(profileData).eq('id', firstProfile.id).select().single();
            } else {
                query = supabase.from('profiles').insert([profileData]).select().single();
            }
            const { data, error } = await query;
            if (!error) return data;
            console.error('Supabase updateProfile error:', error);
            throw error;
        }
        const db = await readLocalDb();
        db.profile = { ...db.profile, ...profileData };
        await writeLocalDb(db);
        return db.profile;
    },

    // -- PROJECTS --
    getProjects: async () => {
        if (isSupabaseActive()) {
            const { data, error } = await supabase
                .from('projects')
                .select('*')
                .order('featured', { ascending: false })
                .order('project_date', { ascending: false });
            if (!error) return data;
            console.error('Supabase getProjects error:', error);
        }
        const db = await readLocalDb();
        // Sort logic local: Featured first, then by date descending
        return [...db.projects].sort((a, b) => {
            if (a.featured && !b.featured) return -1;
            if (!a.featured && b.featured) return 1;
            return new Date(b.project_date) - new Date(a.project_date);
        });
    },

    getProjectById: async (id) => {
        if (isSupabaseActive()) {
            const { data, error } = await supabase.from('projects').select('*').eq('id', id).maybeSingle();
            if (!error && data) return data;
            console.error('Supabase getProjectById error:', error);
        }
        const db = await readLocalDb();
        return db.projects.find(p => p.id === id) || null;
    },

    createProject: async (projectData) => {
        if (isSupabaseActive()) {
            const { data, error } = await supabase.from('projects').insert([projectData]).select().single();
            if (!error) return data;
            console.error('Supabase createProject error:', error);
            throw error;
        }
        const db = await readLocalDb();
        const newProject = {
            ...projectData,
            id: 'p_' + Date.now().toString(36),
            featured: projectData.featured === true || projectData.featured === 'true'
        };
        db.projects.push(newProject);
        await writeLocalDb(db);
        return newProject;
    },

    updateProject: async (id, projectData) => {
        if (isSupabaseActive()) {
            const { data, error } = await supabase.from('projects').update(projectData).eq('id', id).select().single();
            if (!error) return data;
            console.error('Supabase updateProject error:', error);
            throw error;
        }
        const db = await readLocalDb();
        const index = db.projects.findIndex(p => p.id === id);
        if (index === -1) throw new Error('Project not found');
        db.projects[index] = {
            ...db.projects[index],
            ...projectData,
            id, // keep original ID
            featured: projectData.featured === true || projectData.featured === 'true'
        };
        await writeLocalDb(db);
        return db.projects[index];
    },

    deleteProject: async (id) => {
        if (isSupabaseActive()) {
            const { error } = await supabase.from('projects').delete().eq('id', id);
            if (!error) return true;
            console.error('Supabase deleteProject error:', error);
            throw error;
        }
        const db = await readLocalDb();
        const index = db.projects.findIndex(p => p.id === id);
        if (index === -1) throw new Error('Project not found');
        db.projects.splice(index, 1);
        await writeLocalDb(db);
        return true;
    },

    // -- SKILLS --
    getSkills: async () => {
        if (isSupabaseActive()) {
            const { data, error } = await supabase.from('skills').select('*').order('display_order', { ascending: true });
            if (!error) return data;
            console.error('Supabase getSkills error:', error);
        }
        const db = await readLocalDb();
        return [...db.skills].sort((a, b) => a.display_order - b.display_order);
    },

    createSkill: async (skillData) => {
        if (isSupabaseActive()) {
            const { data, error } = await supabase.from('skills').insert([skillData]).select().single();
            if (!error) return data;
            console.error('Supabase createSkill error:', error);
            throw error;
        }
        const db = await readLocalDb();
        const newSkill = {
            ...skillData,
            id: 's_' + Date.now().toString(36),
            proficiency: parseInt(skillData.proficiency) || 80,
            display_order: parseInt(skillData.display_order) || db.skills.length + 1
        };
        db.skills.push(newSkill);
        await writeLocalDb(db);
        return newSkill;
    },

    updateSkill: async (id, skillData) => {
        if (isSupabaseActive()) {
            const { data, error } = await supabase.from('skills').update(skillData).eq('id', id).select().single();
            if (!error) return data;
            console.error('Supabase updateSkill error:', error);
            throw error;
        }
        const db = await readLocalDb();
        const index = db.skills.findIndex(s => s.id === id);
        if (index === -1) throw new Error('Skill not found');
        db.skills[index] = {
            ...db.skills[index],
            ...skillData,
            id,
            proficiency: parseInt(skillData.proficiency) || db.skills[index].proficiency,
            display_order: parseInt(skillData.display_order) || db.skills[index].display_order
        };
        await writeLocalDb(db);
        return db.skills[index];
    },

    deleteSkill: async (id) => {
        if (isSupabaseActive()) {
            const { error } = await supabase.from('skills').delete().eq('id', id);
            if (!error) return true;
            console.error('Supabase deleteSkill error:', error);
            throw error;
        }
        const db = await readLocalDb();
        const index = db.skills.findIndex(s => s.id === id);
        if (index === -1) throw new Error('Skill not found');
        db.skills.splice(index, 1);
        await writeLocalDb(db);
        return true;
    },

    // -- EXPERIENCE --
    getExperience: async () => {
        if (isSupabaseActive()) {
            const { data, error } = await supabase.from('experience').select('*').order('created_at', { ascending: false });
            if (!error) return data;
            console.error('Supabase getExperience error:', error);
        }
        const db = await readLocalDb();
        // Returning in raw array order or sorted by date if parseable
        return db.experience;
    },

    createExperience: async (expData) => {
        if (isSupabaseActive()) {
            const { data, error } = await supabase.from('experience').insert([expData]).select().single();
            if (!error) return data;
            console.error('Supabase createExperience error:', error);
            throw error;
        }
        const db = await readLocalDb();
        const newExp = {
            ...expData,
            id: 'e_' + Date.now().toString(36),
            responsibilities: Array.isArray(expData.responsibilities) ? expData.responsibilities : [expData.responsibilities],
            technologies: Array.isArray(expData.technologies) ? expData.technologies : [expData.technologies]
        };
        db.experience.push(newExp);
        await writeLocalDb(db);
        return newExp;
    },

    updateExperience: async (id, expData) => {
        if (isSupabaseActive()) {
            const { data, error } = await supabase.from('experience').update(expData).eq('id', id).select().single();
            if (!error) return data;
            console.error('Supabase updateExperience error:', error);
            throw error;
        }
        const db = await readLocalDb();
        const index = db.experience.findIndex(e => e.id === id);
        if (index === -1) throw new Error('Experience not found');
        db.experience[index] = {
            ...db.experience[index],
            ...expData,
            id,
            responsibilities: Array.isArray(expData.responsibilities) ? expData.responsibilities : [expData.responsibilities],
            technologies: Array.isArray(expData.technologies) ? expData.technologies : [expData.technologies]
        };
        await writeLocalDb(db);
        return db.experience[index];
    },

    deleteExperience: async (id) => {
        if (isSupabaseActive()) {
            const { error } = await supabase.from('experience').delete().eq('id', id);
            if (!error) return true;
            console.error('Supabase deleteExperience error:', error);
            throw error;
        }
        const db = await readLocalDb();
        const index = db.experience.findIndex(e => e.id === id);
        if (index === -1) throw new Error('Experience not found');
        db.experience.splice(index, 1);
        await writeLocalDb(db);
        return true;
    },

    // -- EDUCATION --
    getEducation: async () => {
        if (isSupabaseActive()) {
            const { data, error } = await supabase.from('education').select('*').order('created_at', { ascending: false });
            if (!error) return data;
            console.error('Supabase getEducation error:', error);
        }
        const db = await readLocalDb();
        return db.education;
    },

    createEducation: async (eduData) => {
        if (isSupabaseActive()) {
            const { data, error } = await supabase.from('education').insert([eduData]).select().single();
            if (!error) return data;
            console.error('Supabase createEducation error:', error);
            throw error;
        }
        const db = await readLocalDb();
        const newEdu = {
            ...eduData,
            id: 'edu_' + Date.now().toString(36)
        };
        db.education.push(newEdu);
        await writeLocalDb(db);
        return newEdu;
    },

    updateEducation: async (id, eduData) => {
        if (isSupabaseActive()) {
            const { data, error } = await supabase.from('education').update(eduData).eq('id', id).select().single();
            if (!error) return data;
            console.error('Supabase updateEducation error:', error);
            throw error;
        }
        const db = await readLocalDb();
        const index = db.education.findIndex(edu => edu.id === id);
        if (index === -1) throw new Error('Education not found');
        db.education[index] = {
            ...db.education[index],
            ...eduData,
            id
        };
        await writeLocalDb(db);
        return db.education[index];
    },

    deleteEducation: async (id) => {
        if (isSupabaseActive()) {
            const { error } = await supabase.from('education').delete().eq('id', id);
            if (!error) return true;
            console.error('Supabase deleteEducation error:', error);
            throw error;
        }
        const db = await readLocalDb();
        const index = db.education.findIndex(edu => edu.id === id);
        if (index === -1) throw new Error('Education not found');
        db.education.splice(index, 1);
        await writeLocalDb(db);
        return true;
    },

    // -- CERTIFICATIONS --
    getCertifications: async () => {
        if (isSupabaseActive()) {
            const { data, error } = await supabase.from('certifications').select('*').order('created_at', { ascending: false });
            if (!error) return data;
            console.error('Supabase getCertifications error:', error);
        }
        const db = await readLocalDb();
        return db.certifications || [];
    },

    createCertification: async (certData) => {
        if (isSupabaseActive()) {
            const { data, error } = await supabase.from('certifications').insert([certData]).select().single();
            if (!error) return data;
            console.error('Supabase createCertification error:', error);
            throw error;
        }
        const db = await readLocalDb();
        if (!db.certifications) db.certifications = [];
        const newCert = {
            ...certData,
            id: 'cert_' + Date.now().toString(36)
        };
        db.certifications.push(newCert);
        await writeLocalDb(db);
        return newCert;
    },

    updateCertification: async (id, certData) => {
        if (isSupabaseActive()) {
            const { data, error } = await supabase.from('certifications').update(certData).eq('id', id).select().single();
            if (!error) return data;
            console.error('Supabase updateCertification error:', error);
            throw error;
        }
        const db = await readLocalDb();
        if (!db.certifications) db.certifications = [];
        const index = db.certifications.findIndex(c => c.id === id);
        if (index === -1) throw new Error('Certification not found');
        db.certifications[index] = {
            ...db.certifications[index],
            ...certData,
            id
        };
        await writeLocalDb(db);
        return db.certifications[index];
    },

    deleteCertification: async (id) => {
        if (isSupabaseActive()) {
            const { error } = await supabase.from('certifications').delete().eq('id', id);
            if (!error) return true;
            console.error('Supabase deleteCertification error:', error);
            throw error;
        }
        const db = await readLocalDb();
        if (!db.certifications) db.certifications = [];
        const index = db.certifications.findIndex(c => c.id === id);
        if (index === -1) throw new Error('Certification not found');
        db.certifications.splice(index, 1);
        await writeLocalDb(db);
        return true;
    },

    // -- MESSAGES --
    getMessages: async () => {
        if (isSupabaseActive()) {
            const { data, error } = await supabase.from('messages').select('*').order('created_at', { ascending: false });
            if (!error) return data;
            console.error('Supabase getMessages error:', error);
        }
        const db = await readLocalDb();
        return [...db.messages].sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
    },

    createMessage: async (messageData) => {
        const enrichedMessage = {
            ...messageData,
            read: false,
            created_at: new Date().toISOString()
        };
        if (isSupabaseActive()) {
            // In Supabase, ID might be auto-uuid
            const { data, error } = await supabase.from('messages').insert([enrichedMessage]).select().single();
            if (!error) return data;
            console.error('Supabase createMessage error:', error);
            throw error;
        }
        const db = await readLocalDb();
        const newMsg = {
            ...enrichedMessage,
            id: 'm_' + Date.now().toString(36)
        };
        db.messages.push(newMsg);
        await writeLocalDb(db);
        return newMsg;
    },

    markMessageRead: async (id, isRead = true) => {
        if (isSupabaseActive()) {
            const { data, error } = await supabase.from('messages').update({ read: isRead }).eq('id', id).select().single();
            if (!error) return data;
            console.error('Supabase markMessageRead error:', error);
            throw error;
        }
        const db = await readLocalDb();
        const index = db.messages.findIndex(m => m.id === id);
        if (index === -1) throw new Error('Message not found');
        db.messages[index].read = isRead;
        await writeLocalDb(db);
        return db.messages[index];
    },

    deleteMessage: async (id) => {
        if (isSupabaseActive()) {
            const { error } = await supabase.from('messages').delete().eq('id', id);
            if (!error) return true;
            console.error('Supabase deleteMessage error:', error);
            throw error;
        }
        const db = await readLocalDb();
        const index = db.messages.findIndex(m => m.id === id);
        if (index === -1) throw new Error('Message not found');
        db.messages.splice(index, 1);
        await writeLocalDb(db);
        return true;
    }
};
