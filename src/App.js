import React from 'react'
import Question from './Question'
import './style.css'
import {nanoid} from 'nanoid';

function App() {

  const [start, setStart] = React.useState(false);
  const [questions, setQuestions] = React.useState([]);  // state to save data object gotten from api
  const [questionsState, setQuestionsState] = React.useState([]);  // in this state i save data gotten from api which is saved in question state in a comfortable, managable format
  const [startQuiz, setStartQuiz] = React.useState(0);    // state for everytime quiz is started/restarted
  const [answersRight, setAnswersRight] = React.useState(0); // state to keep track of right answers
  const [countClick, setCountClick] = React.useState(0);
  const [shouldRestart, setShouldRestart] = React.useState(0);

  React.useEffect(()=> {
    fetch("https://opentdb.com/api.php?amount=5")
      .then(result => result.json())
        .then(data => setQuestions(data.results))
  }, [startQuiz, shouldRestart])   // getting api call everytime quiz is started/restarted
  
  function selectChoice(id) {
    setQuestionsState(prevQuestions => {
      return prevQuestions.map(eachQuestion => {
          return eachQuestion.map(eachChoice=> {
            if (eachChoice.id === id) {
              if (eachChoice.guessedRight !== undefined) {
                return {...eachChoice, isSelected: !eachChoice.isSelected, guessedRight: !eachChoice.guessedRight}
              }
              else {
                return {...eachChoice, isSelected: !eachChoice.isSelected, guessedWrong: !eachChoice.guessedWrong}
              }
            } else {
              return eachChoice;
            }
          })
      })
    })
  }


  React.useEffect(()=> {
    let numOfCorrect = 0;
    for (const question of questionsState) {
      for (const eachQuestion of question) {
        if (eachQuestion.guessedRight) {
          numOfCorrect++;   // if guessedRight propery is right, meaning that a right question was answered, increase amount of correct answers
        }
      }
    }
    setAnswersRight(numOfCorrect);
  }, [questionsState]);


  function checkRestart() {
    if(countClick%2!==0) {
      setShouldRestart(prevState => (prevState + 1));
    }
  }

  function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}



  React.useEffect(()=> {
    const customQuestion = questions.map(eachQuestion => {
      const choiceArr = [
        {
        id: nanoid(),
        answer: (eachQuestion.correct_answer),
        isTrue: true,
        isSelected: false,
        guessedRight: false
        },
        {
        id: nanoid(),
        answer: (eachQuestion.incorrect_answers[0]),
        isTrue: false,
        isSelected: false,
        guessedWrong: false
        },
        {
        id: nanoid(),
        answer: (eachQuestion.incorrect_answers[1]),
        isTrue: false,
        isSelected: false,
        guessedWrong: false
        },
        {
        id: nanoid(),
        answer: (eachQuestion.incorrect_answers[2]),
        isTrue: false,
        isSelected: false,
        guessedWrong: false
        }
    ];
    return shuffleArray(choiceArr);
    })
    setQuestionsState(customQuestion);
  }, [questions])   // everytime api call is gotten, save that data in our preffered format in this state


  console.log(questionsState);
  console.log(answersRight);
  return (
    <div className="container">
      {
      start===false ? 
      <>
        <h3 className="quizTitle">Quizzical</h3>
        <p className="quizDescription">Click Start Quiz and answer the questions</p>
        <button className="startButton" onClick={() => setStart(prevState=>prevState+1)}>Start Quiz</button> 
      </>
      :
      <>
        <div className="questions">
          <Question question={questions[0].question.replace(/&#039;/g, "'")} answers = {[...questionsState[0]]} select = {selectChoice}  countClick = {countClick} />
          <Question question={questions[1].question} answers = {[...questionsState[1]]} select = {selectChoice}  countClick = {countClick} />
          <Question question={questions[2].question} answers = {[...questionsState[2]]} select = {selectChoice}  countClick = {countClick} />
          <Question question={questions[3].question} answers = {[...questionsState[3]]} select = {selectChoice}  countClick = {countClick} />
          <Question question={questions[4].question} answers = {[...questionsState[4]]} select = {selectChoice}  countClick = {countClick} />
          <div className="result">
            {countClick%2===1 && <p className="ansRight">You got {answersRight}/5 correct questions</p>}
            <button onClick={()=> {
              setCountClick(state => state + 1);
              checkRestart();
              }
              } className="answer-button">{countClick%2===0 ? "View Answers" : "Play Again"}</button>
          </div>
        </div>
      </>
      }
    </div>
  );
}

export default App;
