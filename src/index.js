import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
        <button
            className={"square" + (props.light ? ' light' : '')}
            onClick={props.onClick}
        >
            {props.value}
        </button>
    )
}

class Board extends React.Component {

    renderSquare(i) {
        return (
            <Square
                key={i.toString()}
                light={this.isLight(i)}
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />
        );
    }

    isLight(index) {
        if (!this.props.line) {
            return false;
        }
        return this.props.line.some(item => item === index);
    }

    render() {
        const rows = [];
        for (let i = 0; i < 9; i += 3) {
            const squares = [];
            for (let j = 0; j < 3; j++) {
                squares.push(this.renderSquare(i + j));
            }
            rows.push(<div className="board-row" key={i.toString()}>{squares}</div>);
        }

        return (
            <div>
                {rows}
            </div>
        );
    }
}

class Game extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            history: [
                {
                    squares: Array(9).fill(null),
                    // 棋子坐标
                    chessCoordinate: [0, 0],
                },
            ],
            stepNumber: 0,
            xIsNext: true,
            historyOrder: 'asc',
        };
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares,
                chessCoordinate: getChessCoordinate(i),
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    reverseHistory() {
        this.setState({
            historyOrder: this.state.historyOrder === 'desc' ? 'asc' : 'desc',
        });
    }

    render() {
        let history = this.state.history.slice();
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        const moves = history.map((step, move) => {
            const desc = move ? `Go to move ${getPlayer(move)}: [${step.chessCoordinate.join(', ')}]` : 'Go to game start';
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>
                        {move === this.state.stepNumber ? (<b>{desc}</b>) : desc}
                    </button>
                </li>
            );
        });
        let status, line;
        if (winner) {
            status = 'Winner: ' + winner.player;
            ({ line } = winner);
            console.log('line', line);

        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }
        return (
            <div className="game">
                <div className="game-board">
                    <Board squares={current.squares} line={line} onClick={(i) => this.handleClick(i)} />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <button onClick={() => this.reverseHistory()}>
                        {this.state.historyOrder === 'asc' ? <b>asc</b> : 'asc'}
                        /
                        {this.state.historyOrder === 'desc' ? <b>desc</b> : 'desc'}
                    </button>
                    <ol reversed={this.state.historyOrder === 'desc' ? true : false}>
                        {this.state.historyOrder === 'desc' ? moves.reverse() : moves}
                    </ol>
                </div>
            </div>
        );
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
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return { player: squares[a], line: [...lines[i]] };
        }
    }
    return null;
}

function getPlayer(len) {
    return len % 2 !== 0 ? 'X' : 'O'
}

function getChessCoordinate(i) {
    const col = i % 3;
    const row = Math.floor(i / 3);
    return [row + 1, col + 1];

}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);
