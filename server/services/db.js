import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import supabase from '../config/supabase.js';
import { sanitizeString, sanitizeUrl } from '../middleware/security.js';

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
        console.error('Error reading local DB file, returning fallback structure:', error.message);
        return {
            profile: {
                name: 'Wafa Amjad',
                title: 'Full-Stack Developer & Software Engineer',
                location: 'Abbottabad, KPK, Pakistan',
                email: 'wafaamjad058@gmail.com',
                bio: 'Building practical web and mobile applications using modern technologies.',
                long_bio: 'I am Wafa Amjad, a Computer Science undergraduate at COMSATS University Islamabad, Abbottabad Campus. I specialize in designing and engineering practical web and mobile applications from concept to deployment.',
                github_url: 'https://github.com/Wafa-Amjad',
                linkedin_url: 'https://linkedin.com/in/wafa-amjad',
                resume_url: '',
                profile_image: ''
            },
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
        console.error('Error writing local DB file:', error.message);
        return false;
    }
}

// -------------------------------------------------------------
// Database Operations Service with Automatic Local Fallback
// -------------------------------------------------------------

export const dbService = {
    // -- PROFILE --
    getProfile: async () => {
        if (isSupabaseActive()) {
            try {
                const { data, error } = await supabase.from('profiles').select('*').limit(1).maybeSingle();
                if (!error && data) return data;
                if (error) console.warn('[Supabase] getProfile error, using local DB:', error.message);
            } catch (err) {
                console.warn('[Supabase] getProfile unreachable, using local DB:', err.message);
            }
        }
        const db = await readLocalDb();
        return db.profile;
    },

    updateProfile: async (profileData, userId = null) => {
        const cleanData = {
            name: sanitizeString(profileData.name, 100) || 'Wafa Amjad',
            title: sanitizeString(profileData.title, 150) || 'Full-Stack Developer',
            location: sanitizeString(profileData.location, 150),
            email: sanitizeString(profileData.email, 100),
            bio: sanitizeString(profileData.bio, 500),
            long_bio: sanitizeString(profileData.long_bio, 5000),
            github_url: sanitizeUrl(profileData.github_url),
            linkedin_url: sanitizeUrl(profileData.linkedin_url),
            resume_url: sanitizeUrl(profileData.resume_url),
            profile_image: sanitizeUrl(profileData.profile_image),
            updated_at: new Date().toISOString()
        };

        if (isSupabaseActive()) {
            try {
                const { data: existingProfile } = await supabase.from('profiles').select('id').limit(1).maybeSingle();
                let targetId = existingProfile?.id || userId;

                if (targetId) {
                    const { data, error } = await supabase
                        .from('profiles')
                        .upsert([{ id: targetId, ...cleanData }])
                        .select()
                        .single();
                    if (!error && data) return data;
                } else {
                    const { data, error } = await supabase.from('profiles').insert([cleanData]).select().single();
                    if (!error && data) return data;
                }
            } catch (err) {
                console.warn('[Supabase] updateProfile failed, falling back to local DB:', err.message);
            }
        }

        const db = await readLocalDb();
        db.profile = { ...db.profile, ...cleanData };
        await writeLocalDb(db);
        return db.profile;
    },

    // -- PROJECTS --
    getProjects: async () => {
        if (isSupabaseActive()) {
            try {
                const { data, error } = await supabase
                    .from('projects')
                    .select('*')
                    .order('featured', { ascending: false })
                    .order('project_date', { ascending: false });
                if (!error && data) return data;
                if (error) console.warn('[Supabase] getProjects error, using local DB:', error.message);
            } catch (err) {
                console.warn('[Supabase] getProjects unreachable, using local DB:', err.message);
            }
        }
        const db = await readLocalDb();
        return [...(db.projects || [])].sort((a, b) => {
            if (a.featured && !b.featured) return -1;
            if (!a.featured && b.featured) return 1;
            return new Date(b.project_date || 0) - new Date(a.project_date || 0);
        });
    },

    getProjectById: async (id) => {
        if (isSupabaseActive()) {
            try {
                const { data, error } = await supabase.from('projects').select('*').eq('id', id).maybeSingle();
                if (!error && data) return data;
            } catch (err) {
                console.warn('[Supabase] getProjectById error, using local DB:', err.message);
            }
        }
        const db = await readLocalDb();
        return (db.projects || []).find(p => p.id === id) || null;
    },

    createProject: async (projectData) => {
        const cleanProject = {
            title: sanitizeString(projectData.title, 200),
            short_description: sanitizeString(projectData.short_description, 500),
            detailed_description: sanitizeString(projectData.detailed_description, 5000),
            category: sanitizeString(projectData.category, 100),
            technologies: Array.isArray(projectData.technologies)
                ? projectData.technologies.map(t => sanitizeString(t, 50)).filter(Boolean)
                : [],
            image_url: sanitizeUrl(projectData.image_url),
            github_url: sanitizeUrl(projectData.github_url),
            live_url: sanitizeUrl(projectData.live_url),
            featured: Boolean(projectData.featured),
            project_date: projectData.project_date ? String(projectData.project_date).slice(0, 10) : null,
            highlights: Array.isArray(projectData.highlights)
                ? projectData.highlights.map(h => sanitizeString(h, 200)).filter(Boolean)
                : [],
            role: sanitizeString(projectData.role, 100),
            database_tech: sanitizeString(projectData.database_tech, 100),
            project_type: sanitizeString(projectData.project_type, 100)
        };

        if (isSupabaseActive()) {
            try {
                const { data, error } = await supabase.from('projects').insert([cleanProject]).select().single();
                if (!error && data) return data;
                console.warn('[Supabase] createProject failed, saving locally:', error?.message);
            } catch (err) {
                console.warn('[Supabase] createProject unreachable, saving locally:', err.message);
            }
        }

        const db = await readLocalDb();
        if (!db.projects) db.projects = [];
        const newProject = {
            ...cleanProject,
            id: 'p_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6)
        };
        db.projects.push(newProject);
        await writeLocalDb(db);
        return newProject;
    },

    updateProject: async (id, projectData) => {
        const cleanProject = {
            title: sanitizeString(projectData.title, 200),
            short_description: sanitizeString(projectData.short_description, 500),
            detailed_description: sanitizeString(projectData.detailed_description, 5000),
            category: sanitizeString(projectData.category, 100),
            technologies: Array.isArray(projectData.technologies)
                ? projectData.technologies.map(t => sanitizeString(t, 50)).filter(Boolean)
                : [],
            image_url: sanitizeUrl(projectData.image_url),
            github_url: sanitizeUrl(projectData.github_url),
            live_url: sanitizeUrl(projectData.live_url),
            featured: Boolean(projectData.featured),
            project_date: projectData.project_date ? String(projectData.project_date).slice(0, 10) : null,
            highlights: Array.isArray(projectData.highlights)
                ? projectData.highlights.map(h => sanitizeString(h, 200)).filter(Boolean)
                : [],
            role: sanitizeString(projectData.role, 100),
            database_tech: sanitizeString(projectData.database_tech, 100),
            project_type: sanitizeString(projectData.project_type, 100)
        };

        if (isSupabaseActive()) {
            try {
                const { data, error } = await supabase.from('projects').update(cleanProject).eq('id', id).select().single();
                if (!error && data) return data;
                console.warn('[Supabase] updateProject failed, updating locally:', error?.message);
            } catch (err) {
                console.warn('[Supabase] updateProject unreachable, updating locally:', err.message);
            }
        }

        const db = await readLocalDb();
        const index = (db.projects || []).findIndex(p => p.id === id);
        if (index === -1) throw new Error('Project not found');
        db.projects[index] = {
            ...db.projects[index],
            ...cleanProject,
            id
        };
        await writeLocalDb(db);
        return db.projects[index];
    },

    deleteProject: async (id) => {
        if (isSupabaseActive()) {
            try {
                const { error } = await supabase.from('projects').delete().eq('id', id);
                if (!error) return true;
                console.warn('[Supabase] deleteProject failed, deleting locally:', error?.message);
            } catch (err) {
                console.warn('[Supabase] deleteProject unreachable, deleting locally:', err.message);
            }
        }

        const db = await readLocalDb();
        const index = (db.projects || []).findIndex(p => p.id === id);
        if (index === -1) throw new Error('Project not found');
        db.projects.splice(index, 1);
        await writeLocalDb(db);
        return true;
    },

    // -- SKILLS --
    getSkills: async () => {
        if (isSupabaseActive()) {
            try {
                const { data, error } = await supabase.from('skills').select('*').order('display_order', { ascending: true });
                if (!error && data) return data;
                if (error) console.warn('[Supabase] getSkills error, using local DB:', error.message);
            } catch (err) {
                console.warn('[Supabase] getSkills unreachable, using local DB:', err.message);
            }
        }
        const db = await readLocalDb();
        return [...(db.skills || [])].sort((a, b) => a.display_order - b.display_order);
    },

    createSkill: async (skillData) => {
        const cleanSkill = {
            name: sanitizeString(skillData.name, 100),
            category: sanitizeString(skillData.category, 100),
            proficiency: Math.min(100, Math.max(0, parseInt(skillData.proficiency, 10) || 80)),
            display_order: parseInt(skillData.display_order, 10) || 0
        };

        if (isSupabaseActive()) {
            try {
                const { data, error } = await supabase.from('skills').insert([cleanSkill]).select().single();
                if (!error && data) return data;
                console.warn('[Supabase] createSkill failed, saving locally:', error?.message);
            } catch (err) {
                console.warn('[Supabase] createSkill unreachable, saving locally:', err.message);
            }
        }

        const db = await readLocalDb();
        if (!db.skills) db.skills = [];
        const newSkill = {
            ...cleanSkill,
            id: 's_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
            display_order: cleanSkill.display_order || db.skills.length + 1
        };
        db.skills.push(newSkill);
        await writeLocalDb(db);
        return newSkill;
    },

    updateSkill: async (id, skillData) => {
        const cleanSkill = {
            name: sanitizeString(skillData.name, 100),
            category: sanitizeString(skillData.category, 100),
            proficiency: Math.min(100, Math.max(0, parseInt(skillData.proficiency, 10) || 80)),
            display_order: parseInt(skillData.display_order, 10) || 0
        };

        if (isSupabaseActive()) {
            try {
                const { data, error } = await supabase.from('skills').update(cleanSkill).eq('id', id).select().single();
                if (!error && data) return data;
                console.warn('[Supabase] updateSkill failed, updating locally:', error?.message);
            } catch (err) {
                console.warn('[Supabase] updateSkill unreachable, updating locally:', err.message);
            }
        }

        const db = await readLocalDb();
        const index = (db.skills || []).findIndex(s => s.id === id);
        if (index === -1) throw new Error('Skill not found');
        db.skills[index] = {
            ...db.skills[index],
            ...cleanSkill,
            id
        };
        await writeLocalDb(db);
        return db.skills[index];
    },

    deleteSkill: async (id) => {
        if (isSupabaseActive()) {
            try {
                const { error } = await supabase.from('skills').delete().eq('id', id);
                if (!error) return true;
                console.warn('[Supabase] deleteSkill failed, deleting locally:', error?.message);
            } catch (err) {
                console.warn('[Supabase] deleteSkill unreachable, deleting locally:', err.message);
            }
        }

        const db = await readLocalDb();
        const index = (db.skills || []).findIndex(s => s.id === id);
        if (index === -1) throw new Error('Skill not found');
        db.skills.splice(index, 1);
        await writeLocalDb(db);
        return true;
    },

    // -- EXPERIENCE --
    getExperience: async () => {
        if (isSupabaseActive()) {
            try {
                const { data, error } = await supabase.from('experience').select('*').order('created_at', { ascending: false });
                if (!error && data) return data;
                if (error) console.warn('[Supabase] getExperience error, using local DB:', error.message);
            } catch (err) {
                console.warn('[Supabase] getExperience unreachable, using local DB:', err.message);
            }
        }
        const db = await readLocalDb();
        return db.experience || [];
    },

    createExperience: async (expData) => {
        const cleanExp = {
            company: sanitizeString(expData.company, 150),
            position: sanitizeString(expData.position, 150),
            start_date: sanitizeString(expData.start_date, 50),
            end_date: sanitizeString(expData.end_date, 50),
            responsibilities: Array.isArray(expData.responsibilities)
                ? expData.responsibilities.map(r => sanitizeString(r, 500)).filter(Boolean)
                : typeof expData.responsibilities === 'string' && expData.responsibilities.trim()
                    ? [sanitizeString(expData.responsibilities, 500)]
                    : [],
            technologies: Array.isArray(expData.technologies)
                ? expData.technologies.map(t => sanitizeString(t, 50)).filter(Boolean)
                : typeof expData.technologies === 'string' && expData.technologies.trim()
                    ? [sanitizeString(expData.technologies, 50)]
                    : []
        };

        if (isSupabaseActive()) {
            try {
                const { data, error } = await supabase.from('experience').insert([cleanExp]).select().single();
                if (!error && data) return data;
                console.warn('[Supabase] createExperience failed, saving locally:', error?.message);
            } catch (err) {
                console.warn('[Supabase] createExperience unreachable, saving locally:', err.message);
            }
        }

        const db = await readLocalDb();
        if (!db.experience) db.experience = [];
        const newExp = {
            ...cleanExp,
            id: 'e_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6)
        };
        db.experience.push(newExp);
        await writeLocalDb(db);
        return newExp;
    },

    updateExperience: async (id, expData) => {
        const cleanExp = {
            company: sanitizeString(expData.company, 150),
            position: sanitizeString(expData.position, 150),
            start_date: sanitizeString(expData.start_date, 50),
            end_date: sanitizeString(expData.end_date, 50),
            responsibilities: Array.isArray(expData.responsibilities)
                ? expData.responsibilities.map(r => sanitizeString(r, 500)).filter(Boolean)
                : typeof expData.responsibilities === 'string' && expData.responsibilities.trim()
                    ? [sanitizeString(expData.responsibilities, 500)]
                    : [],
            technologies: Array.isArray(expData.technologies)
                ? expData.technologies.map(t => sanitizeString(t, 50)).filter(Boolean)
                : typeof expData.technologies === 'string' && expData.technologies.trim()
                    ? [sanitizeString(expData.technologies, 50)]
                    : []
        };

        if (isSupabaseActive()) {
            try {
                const { data, error } = await supabase.from('experience').update(cleanExp).eq('id', id).select().single();
                if (!error && data) return data;
                console.warn('[Supabase] updateExperience failed, updating locally:', error?.message);
            } catch (err) {
                console.warn('[Supabase] updateExperience unreachable, updating locally:', err.message);
            }
        }

        const db = await readLocalDb();
        const index = (db.experience || []).findIndex(e => e.id === id);
        if (index === -1) throw new Error('Experience not found');
        db.experience[index] = {
            ...db.experience[index],
            ...cleanExp,
            id
        };
        await writeLocalDb(db);
        return db.experience[index];
    },

    deleteExperience: async (id) => {
        if (isSupabaseActive()) {
            try {
                const { error } = await supabase.from('experience').delete().eq('id', id);
                if (!error) return true;
                console.warn('[Supabase] deleteExperience failed, deleting locally:', error?.message);
            } catch (err) {
                console.warn('[Supabase] deleteExperience unreachable, deleting locally:', err.message);
            }
        }

        const db = await readLocalDb();
        const index = (db.experience || []).findIndex(e => e.id === id);
        if (index === -1) throw new Error('Experience not found');
        db.experience.splice(index, 1);
        await writeLocalDb(db);
        return true;
    },

    // -- EDUCATION --
    getEducation: async () => {
        if (isSupabaseActive()) {
            try {
                const { data, error } = await supabase.from('education').select('*').order('created_at', { ascending: false });
                if (!error && data) return data;
                if (error) console.warn('[Supabase] getEducation error, using local DB:', error.message);
            } catch (err) {
                console.warn('[Supabase] getEducation unreachable, using local DB:', err.message);
            }
        }
        const db = await readLocalDb();
        return db.education || [];
    },

    createEducation: async (eduData) => {
        const cleanEdu = {
            institution: sanitizeString(eduData.institution, 150),
            degree: sanitizeString(eduData.degree, 150),
            field_of_study: sanitizeString(eduData.field_of_study, 150),
            start_date: sanitizeString(eduData.start_date, 50),
            end_date: sanitizeString(eduData.end_date, 50),
            grade: sanitizeString(eduData.grade, 50),
            location: sanitizeString(eduData.location, 150)
        };

        if (isSupabaseActive()) {
            try {
                const { data, error } = await supabase.from('education').insert([cleanEdu]).select().single();
                if (!error && data) return data;
                console.warn('[Supabase] createEducation failed, saving locally:', error?.message);
            } catch (err) {
                console.warn('[Supabase] createEducation unreachable, saving locally:', err.message);
            }
        }

        const db = await readLocalDb();
        if (!db.education) db.education = [];
        const newEdu = {
            ...cleanEdu,
            id: 'edu_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6)
        };
        db.education.push(newEdu);
        await writeLocalDb(db);
        return newEdu;
    },

    updateEducation: async (id, eduData) => {
        const cleanEdu = {
            institution: sanitizeString(eduData.institution, 150),
            degree: sanitizeString(eduData.degree, 150),
            field_of_study: sanitizeString(eduData.field_of_study, 150),
            start_date: sanitizeString(eduData.start_date, 50),
            end_date: sanitizeString(eduData.end_date, 50),
            grade: sanitizeString(eduData.grade, 50),
            location: sanitizeString(eduData.location, 150)
        };

        if (isSupabaseActive()) {
            try {
                const { data, error } = await supabase.from('education').update(cleanEdu).eq('id', id).select().single();
                if (!error && data) return data;
                console.warn('[Supabase] updateEducation failed, updating locally:', error?.message);
            } catch (err) {
                console.warn('[Supabase] updateEducation unreachable, updating locally:', err.message);
            }
        }

        const db = await readLocalDb();
        const index = (db.education || []).findIndex(edu => edu.id === id);
        if (index === -1) throw new Error('Education not found');
        db.education[index] = {
            ...db.education[index],
            ...cleanEdu,
            id
        };
        await writeLocalDb(db);
        return db.education[index];
    },

    deleteEducation: async (id) => {
        if (isSupabaseActive()) {
            try {
                const { error } = await supabase.from('education').delete().eq('id', id);
                if (!error) return true;
                console.warn('[Supabase] deleteEducation failed, deleting locally:', error?.message);
            } catch (err) {
                console.warn('[Supabase] deleteEducation unreachable, deleting locally:', err.message);
            }
        }

        const db = await readLocalDb();
        const index = (db.education || []).findIndex(edu => edu.id === id);
        if (index === -1) throw new Error('Education not found');
        db.education.splice(index, 1);
        await writeLocalDb(db);
        return true;
    },

    // -- CERTIFICATIONS --
    getCertifications: async () => {
        if (isSupabaseActive()) {
            try {
                const { data, error } = await supabase.from('certifications').select('*').order('created_at', { ascending: false });
                if (!error && data) return data;
                if (error) console.warn('[Supabase] getCertifications error, using local DB:', error.message);
            } catch (err) {
                console.warn('[Supabase] getCertifications unreachable, using local DB:', err.message);
            }
        }
        const db = await readLocalDb();
        return db.certifications || [];
    },

    createCertification: async (certData) => {
        const cleanCert = {
            name: sanitizeString(certData.name, 150),
            issuing_organization: sanitizeString(certData.issuing_organization, 150),
            issue_date: sanitizeString(certData.issue_date, 50),
            credential_id: sanitizeString(certData.credential_id, 100),
            credential_url: sanitizeUrl(certData.credential_url),
            image_url: sanitizeUrl(certData.image_url)
        };

        if (isSupabaseActive()) {
            try {
                const { data, error } = await supabase.from('certifications').insert([cleanCert]).select().single();
                if (!error && data) return data;
                console.warn('[Supabase] createCertification failed, saving locally:', error?.message);
            } catch (err) {
                console.warn('[Supabase] createCertification unreachable, saving locally:', err.message);
            }
        }

        const db = await readLocalDb();
        if (!db.certifications) db.certifications = [];
        const newCert = {
            ...cleanCert,
            id: 'cert_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6)
        };
        db.certifications.push(newCert);
        await writeLocalDb(db);
        return newCert;
    },

    updateCertification: async (id, certData) => {
        const cleanCert = {
            name: sanitizeString(certData.name, 150),
            issuing_organization: sanitizeString(certData.issuing_organization, 150),
            issue_date: sanitizeString(certData.issue_date, 50),
            credential_id: sanitizeString(certData.credential_id, 100),
            credential_url: sanitizeUrl(certData.credential_url),
            image_url: sanitizeUrl(certData.image_url)
        };

        if (isSupabaseActive()) {
            try {
                const { data, error } = await supabase.from('certifications').update(cleanCert).eq('id', id).select().single();
                if (!error && data) return data;
                console.warn('[Supabase] updateCertification failed, updating locally:', error?.message);
            } catch (err) {
                console.warn('[Supabase] updateCertification unreachable, updating locally:', err.message);
            }
        }

        const db = await readLocalDb();
        if (!db.certifications) db.certifications = [];
        const index = db.certifications.findIndex(c => c.id === id);
        if (index === -1) throw new Error('Certification not found');
        db.certifications[index] = {
            ...db.certifications[index],
            ...cleanCert,
            id
        };
        await writeLocalDb(db);
        return db.certifications[index];
    },

    deleteCertification: async (id) => {
        if (isSupabaseActive()) {
            try {
                const { error } = await supabase.from('certifications').delete().eq('id', id);
                if (!error) return true;
                console.warn('[Supabase] deleteCertification failed, deleting locally:', error?.message);
            } catch (err) {
                console.warn('[Supabase] deleteCertification unreachable, deleting locally:', err.message);
            }
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
            try {
                const { data, error } = await supabase.from('messages').select('*').order('created_at', { ascending: false });
                if (!error && data) return data;
                if (error) console.warn('[Supabase] getMessages error, using local DB:', error.message);
            } catch (err) {
                console.warn('[Supabase] getMessages unreachable, using local DB:', err.message);
            }
        }
        const db = await readLocalDb();
        return [...(db.messages || [])].sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
    },

    createMessage: async (messageData) => {
        const enrichedMessage = {
            name: sanitizeString(messageData.name, 100),
            email: sanitizeString(messageData.email, 100),
            subject: sanitizeString(messageData.subject, 200),
            message: sanitizeString(messageData.message, 5000),
            read: false,
            created_at: new Date().toISOString()
        };

        if (isSupabaseActive()) {
            try {
                const { data, error } = await supabase.from('messages').insert([enrichedMessage]).select().single();
                if (!error && data) return data;
                console.warn('[Supabase] createMessage failed, saving locally:', error?.message);
            } catch (err) {
                console.warn('[Supabase] createMessage unreachable, saving locally:', err.message);
            }
        }

        const db = await readLocalDb();
        if (!db.messages) db.messages = [];
        const newMsg = {
            ...enrichedMessage,
            id: 'm_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6)
        };
        db.messages.push(newMsg);
        await writeLocalDb(db);
        return newMsg;
    },

    markMessageRead: async (id, isRead = true) => {
        if (isSupabaseActive()) {
            try {
                const { data, error } = await supabase.from('messages').update({ read: Boolean(isRead) }).eq('id', id).select().single();
                if (!error && data) return data;
                console.warn('[Supabase] markMessageRead failed, updating locally:', error?.message);
            } catch (err) {
                console.warn('[Supabase] markMessageRead unreachable, updating locally:', err.message);
            }
        }

        const db = await readLocalDb();
        const index = (db.messages || []).findIndex(m => m.id === id);
        if (index === -1) throw new Error('Message not found');
        db.messages[index].read = Boolean(isRead);
        await writeLocalDb(db);
        return db.messages[index];
    },

    deleteMessage: async (id) => {
        if (isSupabaseActive()) {
            try {
                const { error } = await supabase.from('messages').delete().eq('id', id);
                if (!error) return true;
                console.warn('[Supabase] deleteMessage failed, deleting locally:', error?.message);
            } catch (err) {
                console.warn('[Supabase] deleteMessage unreachable, deleting locally:', err.message);
            }
        }

        const db = await readLocalDb();
        const index = (db.messages || []).findIndex(m => m.id === id);
        if (index === -1) throw new Error('Message not found');
        db.messages.splice(index, 1);
        await writeLocalDb(db);
        return true;
    }
};
