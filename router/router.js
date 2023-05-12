import express from 'express';
const router = express.Router();

// homepage
router.get('/', (req, res) => {
    res.render('lobby');
});




export default router;