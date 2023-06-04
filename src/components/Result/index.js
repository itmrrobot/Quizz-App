import "./Result.css";
import amazing from "../../assets/img/amazing.png";
import completed from "../../assets/img/completed.png";
import { useState } from "react";
import ListQuestions from "../ListQuestions";

function Result({ ...props }) {
  const {
    numberCorrect,
    startTime,
    totalQuestions,
    allYourAnswerChoices
  } = props;
  const [isHide,setIsHide] = useState(false);
  console.log(allYourAnswerChoices);
  const millis = Date.now() - startTime.current;
  const seconds = Math.floor(millis / 1000);
  const check = numberCorrect.current >= Math.round(totalQuestions / 2);

  const handlePlayAgain = () => {
    setIsHide(true);
  };
  return (
    <>
    {isHide===false?<div className="wrapper">
      <img
        src={check === true ? amazing : completed}
        alt="amzing.png"
        className="img"
      />
      <h3 className="title-result">
        {check === true ? "Congratulations!!" : "Failed!"}
      </h3>
      <p className="sayings-result">
        {check === true ? "You are amazing!!" : "Better luck next time!"}
      </p>
      <p className="detail-result">
        {numberCorrect.current}/{totalQuestions} correct answer in {seconds}{" "}
        seconds
      </p>
      <button className="btn mb-32" onClick={handlePlayAgain}>
        Play Again
      </button>
      <div className="detail-questions">
        <h3 className="detail-title">Detail Answers</h3>
        {allYourAnswerChoices?.map((question, index) => {
          const uniqIncorrectAnswer = [...new Set(question.incorrect_answers)].filter(c => c!==question.correct_answer);
          return (
            <div className="detail-question" key={index}>
              <h3 className="detail-question-title">
                Question {index + 1}: {question.question}
              </h3>
              <div className="wrap-answer">
                <div className="your-answer">Your answer: {question.yourAnswerChoose}</div>
              <div className="correct-answer">
                Correct answer: {question.correct_answer}
              </div>
              <div className="incorrect-answers">
                Incorrect answers:
                <div className="wrap-incorrect-answer">
                  {uniqIncorrectAnswer.map((answer, index) => {
                    return (
                      <div className="incorrect-answer" key={index}>
                        {answer}
                      </div>
                    );
                  })}
                </div>
              </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>:<ListQuestions/>}
    </>
  );
}

export default Result;
