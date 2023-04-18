import express from 'express';
const router = express.Router();

// homepage
router.get('/', (req, res) => {
    res.render('home');
    // res.redirect('/chat');
});

router.get('/chat', (req, res) => {
    res.render('chat');
});

router.get('/lobby', (req, res) => {
    res.render('lobby')
})


export default router;