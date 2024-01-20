const express = require('express');
const router = express.Router()
const auth = require('../../../middleware/auth');

router.use("/auth", require('./auth'));
router.use('/notes', auth.verifyToken, require('./notes'))

// @desc    Server API Page
// @route   GET /api/v2

router.get("/", auth.verifyToken, (_, res) => {
    res.send(`Welcome to the server, you are at the Server API Page`);
})


module.exports = router