import React from "react";
import Graph from "react-graph-vis";
import { v4 as uuidv4 } from "uuid";
import GraphAfficher from "./class/graph";
import Route from "./class/route";
import Node from "./class/node";


const options = {
  nodes: {
    shape: "square",
    size: 40,
  },
  layout: {
    hierarchical: false,
    randomSeed: 0,
  },
  interaction: {
    dragNodes: false,
    dragView: false,
  },
  physics: {
    enabled: false,
  },
  edges: {
    color: "#000000",
    arrows: {
      to: false,
    },
  },
  height: "500px",

};

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.graphe = new GraphAfficher(
      [
        new Node(0, 0, 0, "green"),
        new Node(1, 0, 100, "gray"),
        new Node(2, 0, 200, "gray"),
        new Node(3, 0, 300, "gray"),
        new Node(4, 0, 400, "gray"),
        new Node(5, 100, 200, "gray"),
        new Node(6, 100, 400, "gray"),
        new Node(7, 200, 0, "gray"),
        new Node(8, 200, 100, "gray"),
        new Node(9, 200, 200, "gray"),
        new Node(10, 200, 300, "gray"),
        new Node(11, 200, 400, "gray"),
        new Node(12, 300, 0, "gray"),
        new Node(13, 300, 400, "gray"),
        new Node(14, 400, 0, "gray"),
        new Node(15, 400, 100, "red"),
        new Node(16, 400, 200, "gray"),
        new Node(17, 400, 300, "gray"),
        new Node(18, 400, 400, "gray"),
      ],
      [
        new Route(0, 1),
        new Route(1, 2),
        new Route(2, 3),
        new Route(3, 4),
        new Route(2, 5),
        new Route(4, 6),
        new Route(5, 9),
        new Route(6, 11),
        new Route(9, 8),
        new Route(9, 10),
        new Route(10, 11),
        new Route(8, 7),
        new Route(7, 12),
        new Route(12, 14),
        new Route(14, 15),
        new Route(11, 13),
        new Route(13, 18),
        new Route(18, 17),
        new Route(17, 16),
        new Route(16, 15),

      ]
    )
    this.state = {
      graphe: this.graphe
    }
    this.fin = undefined;
    this.fileDeNodes = [];
  }

  componentDidMount() {
    this.fileDeNodes.push(this.state.graphe.nodes[0])// parce que cest le premier 
    this.state.graphe.nodes[0].verifier = true;
    this.fin = 15;
    this.timerID = setInterval(
      () => this.tick(),
      1000
    );
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  tick() {
    
    if (this.fileDeNodes.length !== 0 && this.state.graphe.nodes[this.fin].verifier !== true) {
      
      let noeud = this.fileDeNodes.shift();
     
      let edgeNoeud = this.state.graphe.edges.filter(edge => (edge.to === noeud.id || edge.from === noeud.id));

      edgeNoeud.forEach(edge => {
        if(edge.to !== noeud.id && this.graphe.nodes[edge.to].verifier !== true){
          this.graphe.nodes[edge.to].verifier = true
          this.fileDeNodes.push(this.state.graphe.nodes[edge.to]);
        }else if(this.graphe.nodes[edge.from].verifier !== true){
          this.graphe.nodes[edge.from].verifier = true
          this.fileDeNodes.push(this.state.graphe.nodes[edge.from]);
        }
      });
      if(noeud.id !== 0){
        this.setState(prevState => ({
          graphe: {
            ...prevState.graphe, nodes: prevState.graphe.nodes.map(node =>
              node.id === noeud.id
                  ? { ...node, color: "blue" }
                : node
            )
          }
        })); 
      }    
  }
}
render() {
  return (
    <div>
      <Graph
        key={uuidv4()}
        graph={this.state.graphe}
        options={options}
      />
    </div>
  );
}

}
