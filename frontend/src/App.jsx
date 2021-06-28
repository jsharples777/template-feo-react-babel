import React from 'react';
import './css/App.css';
import Controller from "./Controller.js";
import logger from "./util/SimpleDebug.js";
import LinkToOtherSection from "./component/LinkToOtherSection.js";
import Timer from "./component/Timer.js";
import QuestionDisplay from "./component/QuestionDisplay.js";
import AnswerFeedback from "./component/AnswerFeedback.js";
import AddHighScore from "./component/AddHighScore.js";
import ScoreDisplay from "./component/ScoreDisplay.js";


class App extends React.Component {


    constructor() {
        super();

        /* set the debugging log */
        logger.setLevel(5);
        logger.setOff();
        logger.log("Setting starting state and context");

        this.controller = null;
        this.startingTime = 100;
        this.timePenalty = 10;
        this.currentRemainingTime = this.startingTime;
        this.quizState = -1; // showing quiz, not the high scores and we are not started
        this.state = {currentQuestion: {}, highScores: [], quizState: -1, answerFeedback: ""};

    }

    getController() {
        // lazy instantiation
        if (this.controller === null) {
            this.controller = new Controller(this, window.localStorage);
        }
        return this.controller;
    }


    updateQuestionDisplay(question) {
        /* remove any existing question */
        this.setState({currentQuestion: question, quizState: this.quizState});
    }

    callbackQuizStarted() {
        logger.log("Starting quiz", 1);
        /* the timer has been started by the controller */

        this.quizState = 1; // record the current state - quiz started

        /* now display the first question */
        let question = this.getController().getNextQuestion();
        logger.log("Getting first question", 2);
        logger.log(question, 2);
        this.updateQuestionDisplay(question);
    }


    callbackTimerRanOut() {
        logger.log("Timer ran out", 1);

        this.quizState = 2;  // quiz finished - out of time
        let score = 0;  // score is 0 is you run out of time
        this.callbackQuestionsFinished(score);
    }

    callbackShowNextQuestion() {
        logger.log("Display the next question", 1);
        this.quizState = 1; //started not yet finished

        /* ask for the next question from the controller */
        let question = this.getController().getNextQuestion();
        /*
          do we have anymore questions?  if so, proceed to update the display,
          the controller will let us know if we are done with a different callback
        */

        if (question != null) {
            this.updateQuestionDisplay(question);
        }

    }

    callbackQuestionsFinished(score = 0) {
        logger.log("Quiz Finished - no further questions", 1);
        this.quizState = 2;  // quiz finished - no more questions

        this.currentRemainingTime = score;

        /* clear the question display */
        this.updateQuestionDisplay(null);
        /* let the controller manage the user submission of a user added highscore */
        /* manage the view of the answer feedback from the last question */
        /*
           Another non-REACT rendering method
           remove the answer feedback after the last question
          */

        setTimeout(() => {
            try {
                document.getElementById("answerFeedBack").style.display = "none";
            }
            catch (e) {} // don't worry about errors here, it means the answer feedback has already gone
        }, 2000);
    }

    /* private */
    resetDisplay(showQuiz = true) {
        this.currentRemainingTime = this.startingTime;
        this.setState({currentQuestion: null, highScores: [], quizState: this.quizState, answerFeedback: ""});
    }

    /* private */
    showHighScores() {
        let highScores = this.getController().getHighScores();
        this.setState({currentQuestion: null, highScores: highScores, quizState: this.quizState, answerFeedback: ""})
    }


    callbackShowOtherSection() {
        logger.log("Show the other section", 1);
        if (this.state.quizState !== -10) {
            /* user wants to see the high scores */
            this.quizState = -10; // show the high scores

            logger.log("Showing highscores");
            this.resetDisplay(false);
            this.showHighScores();
        } else {
            this.quizState = -1; // no quiz started

            logger.log("Show quiz");
            /* user wants to go back to the quiz */
            this.resetDisplay(true);
        }
    }

    callbackUpdateTimerDisplay(timeRemaining) {
        /*
          This is a naughty method that is bypassing the usual REACT rendering for performance
          accessing the timer element directly.  We are trying to avoid the page re-rendering for each
          timer countdown, but need to store the time remaining for later re-render calls.
         */
        logger.log("Update timer display " + timeRemaining, 5);
        this.currentRemainingTime = timeRemaining;  // save what the timer should be showing for later re-render calls
        document.getElementById("timer").innerHTML = timeRemaining + " s";
    }

    callbackResetQuizDisplay() {
        logger.log("Resetting quiz display", 1);
        this.quizState = -1;  // quiz not started
        /* show the base test and button to start the quiz */
        this.resetDisplay(true);
    }

    callbackProvideAnswerFeedback(isCorrect = false) {
        logger.log("Showing answer feedback", 1);
        let answerFeedback = (isCorrect) ? "Previous answer was Correct" : " Previous answer was Incorrect";
        this.setState({answerFeedback: answerFeedback});
    }


    /*
      The quiz has multiple states (an enumeration would be useful)
      1.  Quiz not started - VALUE -1;
      2.  Quiz started, not yet finished - VALUE 1;
      3.  Quiz finished - VALUE 2;
      4.  Not showing Quiz, but showing high scores - VALUE -10;
     */
    render() {
        logger.log("render called with state (question, highscores, quizstate, answerfeedback, answerfeedbacktimeout)", 5);
        logger.log(this.state.question, 5);
        logger.log(this.state.highScores, 5);
        logger.log(this.state.quizState, 5);
        logger.log(this.state.answerFeedback, 5);

        /* all viewing logic needs to be here for the various view components to render correctly*/
        // firstly, are we showing a quiz or high scores
        let areWeShowingTheQuiz = (this.state.quizState !== -10);

        // has the quizStarted?
        let hasTheQuizStarted = (this.state.quizState === 1);
        let hasQuizFinished = (this.state.quizState === 2);

        let hasAnswerFeedback = (this.state.answerFeedback !== "");

        // if we have started the quiz add the user feedback area
        const renderAnswerFeedBack = () => {
            if ((hasTheQuizStarted || hasQuizFinished) && hasAnswerFeedback) {
                return <AnswerFeedback>{this.state.answerFeedback}</AnswerFeedback>;
            }
        }
        // if we have finished the quiz add the ability to let the user enter into the high scores
        const renderAddHighScore = () => {
            if (hasQuizFinished) {
                return <AddHighScore score={this.currentRemainingTime} handler={this.getController().handleAddScore}>You
                    score was {this.currentRemainingTime}. You may enter your details to be added to the High Scores
                    list.</AddHighScore>
            }
        }

        const renderQuestionDisplay = () => {
            if (areWeShowingTheQuiz && !hasQuizFinished) {
                return <QuestionDisplay question={this.state.currentQuestion}
                                        hasQuizStarted={this.state.quizState === 1}
                                        startQuizHandler={this.getController().handleStartQuiz}
                                        answerSelectionHandler={this.getController().handleAnswerSelection}>A series of
                    coding questions about Javascript, please press Start Quiz to begin</QuestionDisplay>;
            }
        }

        const renderHighScores = () => {
            if (!areWeShowingTheQuiz) {
                return <ScoreDisplay scores={this.state.highScores} handler={this.getController().handleResetScores}/>
            }
        }


        return (
            <div id="App" className="App">
                <header className="container-fluid">
                    <div className="row">
                        <LinkToOtherSection className={"linkToOtherSection col-sm-2"}
                                            handler={this.getController().handleGotoSection}>{areWeShowingTheQuiz ? "View High Scores" : "Show Quiz"}</LinkToOtherSection>
                        <h1 className="col-sm-8">Coding Quiz</h1>
                        <Timer
                            className={areWeShowingTheQuiz ? "timer col-sm-2" : "timer col-sm-2 hidden"}>Time: {this.currentRemainingTime}s</Timer>
                    </div>
                </header>
                <div className="container-fluid">
                    <div className="row">
                        <div id="content" className="content col-sm-12 container-fluid">
                            <div className="col">
                                {renderQuestionDisplay()}
                                {renderAddHighScore()}
                                {renderAnswerFeedBack()}
                                {renderHighScores()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}


export default App;
