const express = require('express');
const router = express.Router();

router.use('/api', require('./api'))


router.get('/', async(req, res)=>{
    return res.sendStatus(200)
})

module.exports = router;