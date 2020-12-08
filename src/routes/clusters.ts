import { DB_CONFIG } from '../config/dbConfig'
import findAll from './crudCalls'

export const router = require('express').Router()

router.get('/clusters', function (req, res) {
  findAll(res, DB_CONFIG.clustersColl, {})
})

module.exports = router
