import { Router } from 'express';
import { addCard, showCards, transaction, getTransactions } from '../controller/cardData.controller';
import { authenticateJWT } from '../middleware/jwtAuthentication.middleware';
import { CardValidation } from '../middleware/cardDataValidation.middleware';
const router = Router();
router.post('/addcard', CardValidation.addCard, authenticateJWT, addCard);
router.get('/showcards', CardValidation.showCards, authenticateJWT, showCards);
router.post('/transaction', CardValidation.transaction, authenticateJWT, transaction);
router.post('/gettransactions', CardValidation.getTransactions, authenticateJWT, getTransactions);
export default router;