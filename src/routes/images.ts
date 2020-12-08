import { DB_CONFIG } from '../config/dbConfig'
import findAll from './crudCalls'

export const router = require('express').Router()

router.get('/images', function (req, res) {
  findAll(res, DB_CONFIG.imgColl, {})
})

router.get('/imagesFromCluster', function (req, res) {
  var ObjectID = require('mongodb').ObjectID
  findAll(res, DB_CONFIG.imgColl, { clusterId: new ObjectID(req.query.id) })
})

module.exports = router
