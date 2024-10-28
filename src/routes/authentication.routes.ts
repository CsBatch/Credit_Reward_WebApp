import {Router} from 'express';
import { register, login, forgetPassword } from '../controller/registration.controller';
import { UserValidation } from '../middleware/registrationValidation.middleware';
import { authenticateJWT } from '../middleware/jwtAuthentication.middleware';

const router = Router();

router.post('/register', UserValidation.createUser, register);
router.post('/login', UserValidation.login, login);
router.post('/forgetpassword', UserValidation.forgetPassword, authenticateJWT, forgetPassword);
router.post('/resetpassword', UserValidation.forgetPassword, authenticateJWT, forgetPassword);


export default router;