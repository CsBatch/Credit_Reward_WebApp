import { Router } from 'express';
import { addCard, showCards, transaction, getTransactions } from '../controller/cardData.controller';
import { authenticateJWT } from '../middleware/jwtAuthentication.middleware';
const router = Router();
router.post('/addcard', authenticateJWT, addCard);
router.get('/showcards', authenticateJWT, showCards);
router.post('/transaction', authenticateJWT, transaction);
router.post('/gettransactions', authenticateJWT, getTransactions);
export default router;