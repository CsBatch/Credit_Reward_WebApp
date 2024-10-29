import express from 'express';
import connectDB from './config/db.config';
import authenticationRoutes from './routes/authentication.routes'
import cardDataRoutes from './routes/cardData.routes'
import adminControll from './routes/adminControll.routes'
const app = express();

const PORT = process.env.PORT;

app.use(express());

app.use(express.json());

app.get('/', (req, res)=>{
    res.send('hello')
})

connectDB();

app.use('/auth', authenticationRoutes)
app.use('/card', cardDataRoutes)
app.use('/admin', adminControll)

app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});