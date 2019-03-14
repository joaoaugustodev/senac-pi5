const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    res.json({ name: 'USER!' })
})

router.get('/marcelo/:id', (req, res) => {
    res.json({ name: 'Marcelo Fodãol!', id: req.params.id })
})

module.exports = router

