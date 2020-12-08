export class Graph {
    nodes: Nodes[];
    links: Links[];

    constructor (nodes: Nodes[], links: Links[]) {
      this.nodes = nodes
      this.links = links
    }
}

export interface Nodes {
    group: number;
    id: string;
    label: string;
    size: number;
    xy: string;
    author: string;
    authorId: string;
    timestamp: string;
    tweetLink: string;
}

export interface Links {
    id: string;
    source: string;
    target: string;
}
