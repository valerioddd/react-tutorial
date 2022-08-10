import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

function Square(props) {
  return (
      <button
          className={(props.isWinner) ? "square winner" : "square"} 
          onClick={props.onClick}
          >
          {props.value}
      </button>
  );
}
  
class Board extends React.Component { 
  render() {
    let value = -1
    const values = [1, 2, 3];
    
    const valuesList = values.map((row, indexRow)=>{
      return <div className="board-row" key={row + indexRow}>{
        values.map((col, indexCol)=>{
          value++;
          let v = value;
          return <Square 
            key={v}
            value={this.props.squares[v]}
            col={col}
            row={row}
            isWinner={(this.props.comboWinner.includes(v)) ? true : false}
            onClick={() => this.props.onClick(v, col, row)}
            />;
        })
      }</div>
    });

    return (
      <div>
        {valuesList}
      </div>
    );
  }
}

function MoveList(props) { 
  let items = [];
  for(let move = 0; move < props.history.length; move++){
    let step = props.history[move];
    const desc = move ?
      'Go to move #' + move + " [" + step.movedLocation[0] + ", " + step.movedLocation[1] + "]":
      'Go to game start';
    
    items.push
    (
      <li key={move}>
        <button 
          className={(move === props.history.length-1) ? "selectedMove" : ""} 
          onClick={() => props.onClick(move)}>
            {desc}
        </button>
      </li>
    );
  }

  let correctedItems = props.sortedAsc ? items : [...items].reverse();

  return (
    <ol>
      {correctedItems}
    </ol>
  );
}
  
class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        movedLocation: Array(2),
        winnerTris: Array(3).fill(null)
      }],
      sortedAsc: true,
      stepNumber: 0,
      xIsNext: true
    };
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    let status;
    let isWinner;
    if(winner) {
      isWinner = true;
      status = 'Winner: ' + winner.cell;
    } else if(isDraw(history)){
      status = 'Is a draw!' ;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }
    
    const sort = (this.state.sortedAsc) ? "Sort ASC" : "Sort DESC";

    return (
      <div className="game">
        <h2>TicTacToe</h2>
        <div className="game-board">
          <Board 
            squares = {current.squares}
            comboWinner = {isWinner ? winner.combo : []}
            onClick = {(i, col, row) => this.handleClick(i, col, row)}
            />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <div>
            <button className="sortButton" onClick={() => this.reverseSort()}>{sort}</button>
          </div>
          <div>
            <MoveList
              history = {history}
              sortedAsc = {this.state.sortedAsc}
              onClick = {(step) => this.jumpTo(step)}
            />
          </div>
        </div>
      </div>
    );
  }

  //Gestione per il click sulla cella
  handleClick(i, col, row) {
    //Taglia l'history in base allo stepNumber
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    //Current è uguaule all'ultimo square
    const current = history[history.length - 1];
    //Square è l'ultimo current
    const squares = current.squares.slice();
    
    //Se c'è un vincintore, la cella è piena oppure è un pareggio allora non scrive
    if (calculateWinner(squares) || squares[i] || isDraw(history)) {
        return;
    }

    //Scrive la cella
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    
    const location = [col, row]
    this.setState({
      history: history.concat([{
        squares: squares,
        movedLocation: location
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
  }

  //Click per il bottone di ordinamento
  reverseSort(){
    this.setState({
      sortedAsc: !this.state.sortedAsc
    });
  }

  //Modifica lo state, così al click successivo si modifica la history
  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }
}
  
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    //Se le celle sono uguali, ritorna la combinazione vincete 
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
        cell: squares[a],
        combo: [a, b, c]
      };
    }
  }
  return null;
}

function isDraw(history) {
  return history.length === 10;
}

// ========================================
  
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);
  