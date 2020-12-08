import { URL_CONFIG } from '../config/serverConfig'
import { DB_CONFIG } from '../config/dbConfig'
import * as mongoClient from 'mongodb'

export default function findAll (res, collection, query) {
  mongoClient.connect(URL_CONFIG.launchUrl, { useUnifiedTopology: true }, function (err, client) {
    if (err) throw err
    const db = client.db(DB_CONFIG.name)
    db.collection(collection).find(query).toArray(function (err, docs) {
      if (err) throw err
      res.send(docs)
    })
  })
}
