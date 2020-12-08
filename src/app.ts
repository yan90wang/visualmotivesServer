import * as bodyParser from 'body-parser'
import * as mongoClient from 'mongodb'
import * as WebSocket from 'ws'
import * as clusterRoutes from './routes/clusters'
import * as imagesRoutes from './routes/images'
import * as graphRoutes from './routes/graph'
import { URL_CONFIG, WEBSOCKET_PORT } from './config/serverConfig'
import { DB_CONFIG } from './config/dbConfig'
import { swaggerDocument } from './swagger'
import { GraphMapper } from './utility/graphMapper'
import * as express from 'express'
import * as cors from 'cors'

class App {
    public app: express.Application

    constructor () {
      this.app = express()
      this.config()
      this.establishWebSocket()
    }

    private config (): void {
      this.app.use(cors())
      this.app.use(bodyParser.json())
      this.app.use(bodyParser.urlencoded({ extended: false }))
      this.app.use(clusterRoutes)
      this.app.use(imagesRoutes)
      this.app.use(graphRoutes)
      this.app.use(graphRoutes)
      const swaggerUi = require('swagger-ui-express')
      this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
    }

    private establishWebSocket (): void {
      const webSocket = new WebSocket.Server({ port: WEBSOCKET_PORT })
      console.log('Websocket started on port: ' + WEBSOCKET_PORT)

      const interval = setInterval(function ping () {
        console.log('clients: ' + webSocket.clients.size)
        webSocket.clients.forEach(function each (ws) {
          ws.send(JSON.stringify('ping'))
        })
      }, 30000)

      webSocket.on('close', function close () {
        clearInterval(interval)
      })

      mongoClient.connect(URL_CONFIG.launchUrl, { useUnifiedTopology: true }, function (err, client) {
        if (err) throw err
        const clusterCollection = client.db(DB_CONFIG.name).collection(DB_CONFIG.clustersColl)
        const changeStream = clusterCollection.watch()
        changeStream.on('change', (next) => {
          console.log(next)
          webSocket.clients.forEach(function each (ws) {
            if (next.operationType === 'update') {
              console.log('update')
              ws.send(JSON.stringify({ type: 'update', data: GraphMapper.getInstance().updateNodeGraph(next) }))
            }
            if (next.operationType === 'insert') {
              console.log('insert')
              ws.send(JSON.stringify({ type: 'insert', data: GraphMapper.getInstance().insertNodeGraph(next) }))
            }
          })
        })
      })
    }
}

export default new App().app
