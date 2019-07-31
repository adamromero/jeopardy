import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function BoardPopup({ clue, choices, onClick }) {
	const multiple = choices.map((choice, i) => {
		return (
			<div key={i}>
				<input id={i} type="radio" name="choice" />
				<label htmlFor={i}>{choice}</label>
			</div>
		)
	});
  return (
  	<div>
  		<div className="overlay" onClick={onClick}></div>
	    <div className="popup">
	      <div className="clue">{clue}</div>
	      {multiple}
	    </div>
    </div>
  );
}

function BoardClue({ value, clue, answer, onClick }) {
  return (
    <div className="board-clue" onClick={onClick}>
      <div>${value}</div>
      <div style={{display:'none'}}>{clue}</div>
      <div style={{display:'none'}}>{answer}</div>
    </div>
  );
}

function Board({ questions }) {
  const [popupState, setPopupState] = React.useState({ open: false });

  return (
    <div className="board">
      {questions.map((question, index) => (
        <BoardClue 
          key={index} 
          value={question.value} 
          clue={question.clue} 
          answer={question.answer} 
          onClick={showClue(question.clue, question.choices)} 
        />
      ))}
      {popupState.open === true && (
        <BoardPopup
          clue={popupState.clue}
          choices={popupState.choices}
          onClick={() => setPopupState({ open: false })}
        />
      )}
    </div>
  );

  function showClue(clue, choices) {
    return () => setPopupState({ open: true, clue, choices});
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      error: null,
      isLoaded: null
    }
    
  }
  componentDidMount() {
    fetch('./questions.json')
      .then(res => res.json())
      .then(data => 
        this.setState({ 
          isLoaded: true,
          data 
        }),
        error => this.setState({
          isLoaded: true,
          error
        })
      );
  }

  render() {
    const error = this.state.error;
    const isLoaded = this.state.isLoaded;
    const questions = this.state.data.questions;

    if (error) {
      return <div>Error {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>
    } else {
      return (
        <div className="jeopardy">
          <Board questions={questions} />
        </div>
      );
    }
  }
}

ReactDOM.render(<App />, document.getElementById('root'));

