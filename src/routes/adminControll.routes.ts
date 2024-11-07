import { Router } from 'express';
import { login, getAllUser, changeUserStatus, addBank, removeBank, addCard} from '../controller/admin.controller';
// import { register, login} from '../controller/admin.controller';

const router = Router()


// router.post('/register', register)
router.post('/login', login)

router.get('/getAllUser', getAllUser)
router.put('/changestatus/:id', changeUserStatus)

router.post('/addbank', addBank)
router.post('/removebank', removeBank)

router.post('/addcard', addCard)

export default router;