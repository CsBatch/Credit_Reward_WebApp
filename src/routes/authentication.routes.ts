import { Router } from 'express';
import { register, login, forgetPassword, resetPassword, deleteAccount, logout } from '../controller/registration.controller';
import { UserValidation } from '../middleware/registrationValidation.middleware';
import { authenticateJWT } from '../middleware/jwtAuthentication.middleware';

const router = Router();

router.post('/register', UserValidation.createUser, register);
router.post('/login', UserValidation.login, login);
router.post('/forgetpassword', UserValidation.forgetPassword, authenticateJWT, forgetPassword);
router.put('/resetpassword', UserValidation.resetPassword, authenticateJWT, resetPassword);
router.delete('/deleteaccount', authenticateJWT, deleteAccount);
router.get('/logout', authenticateJWT, logout);


export default router;


/**
 * 
{
"FirstName": "Shubh",
"LastName": "Srivastava",
"PhoneNumber": "8881123879",
"Email": "shubh30@gmail.com",
"Password": "$2b$10$cNIM17krE2CGCCwui2xWVOhxl3p4tuXJ4g0jYnsV1FXb1OasuLyy2",
"Address": "H221 MobileCoderz",
"DateOfBirth": 2005-03-06T00:00:00.000+00:00,
"SSN": 4485,
"AnnualIncome": 1000000,
"SecurQue1": "Your Pet Name",
"SecurAns1": "Husky",
"SecurQue2": "Your Address",
"SecurAns2": "Home"
}

 */










