import { DB_CONFIG } from '../config/dbConfig'
import { URL_CONFIG } from '../config/serverConfig'
import * as mongoClient from 'mongodb'
import { GraphMapper } from '../utility/graphMapper'

export const router = require('express').Router()

router.get('/graph', function (req, res) {
  mongoClient.connect(URL_CONFIG.launchUrl, { useUnifiedTopology: true }, function (err, client) {
    if (err) throw err
    const db = client.db(DB_CONFIG.name)
    db.collection(DB_CONFIG.clustersColl).find({}).toArray(function (err, docs) {
      if (err) throw err
      res.send({ data: GraphMapper.getInstance().mapDocumentToGraph(docs) })
    })
  })
})

module.exports = router
