import axios from "axios";
import React, { useRef } from "react";
import { useEffect, useState } from "react";
import { urlQuestions } from "../../constants";
import "./ListQuestions.css";
import { removeDuplicateElement } from "../../utils";
import Result from "../Result";


function ListQuestions({setHome}) {
  const startTime = useRef(Date.now());
  const [questions, setQuestions] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const [lastIndex, setLastIndex] = useState(1);
  const [yourAnswerChoose, setYourAnswerChoose] = useState("");
  const [isChoose,setIsChoose] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFinish, setIsFinish] = useState(false);
  const [isShowMessage,setIsShowMessage] = useState(false);
  const allYourAnswers = useRef([]);
  const numberCorrect = useRef(0);
  const question = questions.slice(startIndex, lastIndex);
  const answerChoices = question?.[0]?.incorrect_answers;
  const correctChoice = question?.[0]?.correct_answer;
  const randomPosition = Math.floor(Math.random() * (questions.length + 1));
  answerChoices?.splice(randomPosition, 0, correctChoice);
  useEffect(() => {
    const controller = new AbortController();
    const fetchData = async () => {
      try {
        const res = await axios.get(urlQuestions, {
          signal: controller.signal,
        });
        setQuestions(res.data.results);
        setIsLoading(true);
      } catch (e) {
        console.log(e);
      }
    };
    fetchData();
    return () => {
      controller.abort();
    };
  }, []);

  const handleClick = () => {
    if(isChoose===true) {
        setStartIndex(startIndex + 1);
        if (lastIndex < questions.length) {
            setLastIndex(lastIndex + 1);
        } else {
            setIsFinish(true);
        }
    } else {
      setIsShowMessage(true);
    }
    allYourAnswers.current.push({question:question?.[0].question,yourAnswerChoose:yourAnswerChoose,correct_answer:correctChoice,incorrect_answers:answerChoices});
    setIsChoose(false);
  };

  const handleChoose = (choice) => {
    setIsShowMessage(false);
    setYourAnswerChoose(choice);
    setIsChoose(true);
    if (choice === correctChoice) numberCorrect.current++;
  };

  const activeClass = (choice) => {
    if (yourAnswerChoose === choice) return "item active";
    else return "item";
  };

  const showFeedBack = (choice) => {
    if (correctChoice === choice) return "Correct answer!";
    else return `The correct anwer: ${correctChoice}`;
  }

  return (
    <div className="wrap">
      {isLoading === true ? (
        <>
          {isFinish===false?<>
            <h3 className="question-tilte">
              Question {lastIndex}
              <sub>/{questions.length}</sub>
            </h3>
            <p className="question">{question?.[0]?.question}</p>
            {removeDuplicateElement(answerChoices)?.map((choice, index) => {
              return (
                <button
                  className={activeClass(choice)}
                  key={index}
                  onClick={() => handleChoose(choice)}
                  disabled={isChoose===false?false:true}
                >
                  <span className="answer">{choice}</span>
                </button>
              );
            })}
            {isChoose===true&&<>{showFeedBack(yourAnswerChoose).length===15?<p className="message-success">{showFeedBack(yourAnswerChoose)}</p>:<p className="message-success"><span style={{color:"#d01624"}}>Wrong anwer! </span> {showFeedBack(yourAnswerChoose)}</p>}</>}
            {isShowMessage===true&&<p className="message-warning">You must choose the answer</p>}
            <button className="btn-next" onClick={handleClick}>
              Next
            </button>
            <button className="btn-close" onClick={() => setHome(false)}>&times;</button>
          </>:<Result numberCorrect={numberCorrect}
                      startTime={startTime}
                      totalQuestions={questions.length}
                      allYourAnswerChoices={allYourAnswers.current}
              />}
        </>
      ) : (
        <div className="loader"></div>
      )}
    </div>
  );
}

export default React.memo(ListQuestions);
