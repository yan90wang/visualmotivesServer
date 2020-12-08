import { getClusters } from './openAPI/clusters.swagger'

export const swaggerDocument = {
  openapi: '3.0.1',
  info: {
    version: '1.0.0',
    title: 'APIs Document',
    description: 'Documentation for visual motives services'
  },
  servers: [
    {
      url: '10.34.58.133:27017',
      description: 'Primary Replica Server'
    },
    {
      url: '10.34.58.133:27018',
      description: 'Secondary Replica Server 1'
    },
    {
      url: '10.34.58.133:27019',
      description: 'Secondary Replica Server 2'
    }
  ],
  tags: [{
    name: 'Clusters'
  }],
  paths: {
    '/clusters': {
      get: getClusters
    }
  },
  schemas: {
    Clusters: {
      type: 'object',
      properties: {
        _id: 'string',
        leader: {
          type: 'array',
          items: {
            type: 'integer'
          }
        },
        size: 'integer',
        edges: {
          type: 'array',
          items: {
            type: 'string'
          }
        },
        leader_url: 'string'
      }
    }
  }
}
