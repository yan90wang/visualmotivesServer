export const getClusters = {
  tags: ['Clusters'],
  description: 'Returns all existing clusters',
  operationId: 'getClusters',
  responses: {
    200: {
      description: 'A list of all clusters.',
      content: {
        json: {
          schema: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                _id: {
                  type: 'string'
                },
                leader: {
                  type: 'array',
                  items: {
                    type: 'integer'
                  }
                },
                size: {
                  type: 'integer'
                },
                edges: {
                  type: 'array',
                  items: {
                    type: 'string'
                  }
                },
                leader_url: {
                  type: 'string'
                }
              }
            }
          }
        }
      }
    }
  }
}
