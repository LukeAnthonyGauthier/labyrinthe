import React from "react";
import Graph from "react-graph-vis";
import { v4 as uuidv4 } from "uuid";
import GraphAfficher from "./class/graph";
import Route from "./class/route";
import Node from "./class/node";
import PriorityQueue from 'priorityqueuejs';

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

  }
  componentDidMount() {
    this.graphe.nodes[0].verifier = true;
    this.parcourirDijkstra(this.graphe.nodes[0], this.graphe.nodes[15]);
  }

  parcourirDijkstra(noeudDepart, noeudFin) {

    this.tableauDesChemins = this.creationTableauDistance(noeudDepart)

    let queue = this.creationQueue(noeudDepart);

    // pendant que la queue est encore pleine
    while (!queue.isEmpty()) {
      let noeud = queue.deq();
      noeud.verifier = true;


      let edgeNoeud = this.state.graphe.edges.filter(edge => (edge.to === noeud.id || edge.from === noeud.id));

      edgeNoeud.forEach(edge => {
        if (edge.to !== noeud.id && this.graphe.nodes[edge.to].verifier !== true) {
          let prochainNodeID = edge.to;
          let nouvelleDistance = this.tableauDesChemins[noeud.id].distance + edge.poid;
          if (this.compareDistance(prochainNodeID, nouvelleDistance, noeud)) {
            queue.enq(this.graphe.nodes[prochainNodeID]);
          }

        } else if (this.graphe.nodes[edge.from].verifier !== true) {
          let prochainNodeID = edge.from;
          let nouvelleDistance = this.tableauDesChemins[noeud.id].distance + edge.poid;
          if (this.compareDistance(prochainNodeID, nouvelleDistance, noeud)) {
            queue.enq(this.graphe.nodes[prochainNodeID]);
          }
        }
      });
    }
    let cheminFinal = this.faireLeChemin(noeudFin);

    this.afficherLeChemin(cheminFinal);

  }
  creationTableauDistance(noeudDepart) {
    return this.graphe.nodes.map(node => {
      if (node.id === noeudDepart.id) {
        return {
          noeud: node.id,
          distance: 0,
        }
      } else {
        return {
          noeud: node.id,
          distance: Number.MAX_VALUE,
          precedent: null,
        }
      }
    });
  }

  creationQueue(noeudDepart) {
    let queue = new PriorityQueue((a, b) => {
      return b.priorite - a.priorite;
    });
    noeudDepart.priorite = 0;
    queue.enq(noeudDepart);
    return queue;
  }

  compareDistance(prochainNodeID, nouvelleDistance, noeud) {
    if (this.tableauDesChemins[prochainNodeID].distance >= nouvelleDistance) {
      this.tableauDesChemins[prochainNodeID].distance = nouvelleDistance;
      this.tableauDesChemins[prochainNodeID].precedent = noeud.id;
      this.graphe.nodes[prochainNodeID].priorite = nouvelleDistance;
      return true;
    }
    return false;
  }
  faireLeChemin(noeudFin) {
    let pile = [];
 
    pile.push(noeudFin);
    
    let noeudPrecedent = this.tableauDesChemins[noeudFin.id].precedent;
    while (noeudPrecedent !== null) {
      pile.push(this.graphe.nodes[noeudPrecedent])
      if (this.tableauDesChemins[noeudPrecedent].precedent != undefined) {
        noeudPrecedent = this.tableauDesChemins[noeudPrecedent].precedent
      } else {
        noeudPrecedent = null;
      }
    }
   
    return pile;
  }
  afficherLeChemin(pileDuChemin) {
    while(pileDuChemin.length > 0){
      let noeud = pileDuChemin.pop();
      if (noeud.id != 15) {
        timer += 500;

        noeud.verifier = true;

        setTimeout(() => {
          if (noeud.id !== 0) {

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
        }, timer)
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
