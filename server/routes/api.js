import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import {
    getProfile,
    updateProfile
} from '../controllers/profileController.js';
import {
    getProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject
} from '../controllers/projectController.js';
import {
    getSkills,
    createSkill,
    updateSkill,
    deleteSkill
} from '../controllers/skillController.js';
import {
    getExperience,
    createExperience,
    updateExperience,
    deleteExperience
} from '../controllers/experienceController.js';
import {
    getEducation,
    createEducation,
    updateEducation,
    deleteEducation
} from '../controllers/educationController.js';
import {
    getCertifications,
    createCertification,
    updateCertification,
    deleteCertification
} from '../controllers/certificationController.js';
import {
    getMessages,
    createMessage,
    markMessageRead,
    deleteMessage
} from '../controllers/messageController.js';
import { login } from '../controllers/authController.js';

const router = express.Router();

// -- AUTHENTICATION RENDER --
router.post('/auth/login', login);

// -- PROFILE API --
router.get('/profile', getProfile);
router.put('/profile', requireAuth, updateProfile);

// -- PROJECTS API --
router.get('/projects', getProjects);
router.get('/projects/:id', getProjectById);
router.post('/projects', requireAuth, createProject);
router.put('/projects/:id', requireAuth, updateProject);
router.delete('/projects/:id', requireAuth, deleteProject);

// -- SKILLS API --
router.get('/skills', getSkills);
router.post('/skills', requireAuth, createSkill);
router.put('/skills/:id', requireAuth, updateSkill);
router.delete('/skills/:id', requireAuth, deleteSkill);

// -- EXPERIENCE API --
router.get('/experience', getExperience);
router.post('/experience', requireAuth, createExperience);
router.put('/experience/:id', requireAuth, updateExperience);
router.delete('/experience/:id', requireAuth, deleteExperience);

// -- EDUCATION API --
router.get('/education', getEducation);
router.post('/education', requireAuth, createEducation);
router.put('/education/:id', requireAuth, updateEducation);
router.delete('/education/:id', requireAuth, deleteEducation);

// -- CERTIFICATIONS API --
router.get('/certifications', getCertifications);
router.post('/certifications', requireAuth, createCertification);
router.put('/certifications/:id', requireAuth, updateCertification);
router.delete('/certifications/:id', requireAuth, deleteCertification);

// -- MESSAGES API --
router.post('/messages', createMessage);
router.get('/messages', requireAuth, getMessages);
router.put('/messages/:id/read', requireAuth, markMessageRead);
router.delete('/messages/:id', requireAuth, deleteMessage);

export default router;
