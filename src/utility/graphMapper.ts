import { Graph } from './graph'

/**
 Maps the database cluster item to a front end readable cluster item
 */
export class GraphMapper {
    private static instance: GraphMapper;
    private id: number;
    private groupId: number;

    private constructor () {
      this.id = 0
      this.groupId = 0
    }

    static getInstance (): GraphMapper {
      if (!GraphMapper.instance) {
        GraphMapper.instance = new GraphMapper()
      }

      return GraphMapper.instance
    }

    static mapAuthorName (cluster: Document) {
      const splitNameId = cluster.author.split(/\r?\n/)
      const authorId = splitNameId[0].match(/\d+/g)[0]
      const regStr = '"(.*?)"'
      const authorName = splitNameId[1].match(new RegExp(regStr))[1]
      return { authorId, authorName }
    }

    mapDocumentToGraph (clusters: Document[]): Graph {
      const nodes = []
      const links = []
      for (const cluster of clusters) {
        nodes.push(this.createNode(cluster))
        this.groupId++
        const edges = cluster.edges
        this.createEdges(edges, links, cluster)
      }
      this.createClusterGroups(links, nodes)
      return new Graph(nodes, links)
    }

    private createEdges (edges, links, cluster: Document) {
      for (const edge of edges) {
        this.id++
        links.push({ id: this.id, source: cluster._id.toString(), target: edge.toString() })
      }
    }

    private createNode (cluster: Document) {
      const { authorId, authorName } = GraphMapper.mapAuthorName(cluster)
      return {
        id: cluster._id.toString(),
        label: cluster.leader_url.toString(),
        size: cluster.size,
        group: this.groupId,
        marked: false,
        xy: cluster.eigenvalues,
        author: authorName,
        authorId: authorId,
        timestamp: cluster.timestamp,
        tweetLink: cluster.tweetId
      }
    }

    createClusterGroups (links: any[], nodes: any[]) {
      for (const link of links) {
        const nodeId = nodes.map(n => n.id)
        const source = nodes[nodeId.indexOf(link.source.valueOf())]
        const target = nodes[nodeId.indexOf(link.target.valueOf())]
        if (!!target && !!source) {
          if (source.marked && !target.marked) {
            target.marked = true
            target.group = source.group
          } else if (!source.marked && target.marked) {
            source.marked = true
            source.group = target.group
          } else if (source.marked && target.marked) {
            for (const node of nodes) {
              if (node.group === source.group) {
                node.group = target.group
              }
            }
          } else {
            source.marked = true
            target.marked = true
            source.group = target.group
          }
        }
      }
    }

    updateNodeGraph (next: any): Graph {
      const clusterId = next.documentKey._id
      const newClusterSize = next.updateDescription.updatedFields.size
      const links = []
      const nodes = []
      nodes.push({
        id: clusterId,
        size: newClusterSize
      })
      return new Graph(nodes, links)
    }

    insertNodeGraph (next: any): Graph {
      const cluster = next.fullDocument
      const edges = next.fullDocument.edges
      const nodes = [this.createNode(cluster)]
      const links = []
      this.createEdges(edges, links, cluster)
      return new Graph(nodes, links)
    }
}
