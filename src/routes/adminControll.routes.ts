import { Router } from 'express';
import { login} from '../controller/admin.controller';
// import { register, login} from '../controller/admin.controller';

const router = Router()


// router.post('/register', register)
router.post('/login', login)

export default router;