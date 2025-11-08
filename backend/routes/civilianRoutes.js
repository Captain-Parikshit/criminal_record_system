const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('Civilian route working');
});

module.exports = router;
