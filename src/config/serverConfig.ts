/**
 * Contains the urls that can be used to connect to the mongoDb (for example replica servers :r1,r2,r3)
 */
export const URL_CONFIG = {
  launchUrl: 'mongodb://10.34.58.133:27017/?replicaSet=rs0',
  r1: 'mongodb://10.34.58.133:27017/?replicaSet=rs0',
  r2: 'mongodb://10.34.58.133:27019/?replicaSet=rs0',
  primary: 'mongodb://10.34.58.133:27018/?replicaSet=rs0',
  local: 'mongodb://localhost'
}

export const WEBSOCKET_PORT = 8800
