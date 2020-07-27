import React, { useContext } from "react";
import { StepContext } from "../context/StepState";
import Serialize from "../utils/serialize";

/* global chrome */
const Step = ({ step, deleteButton }) => {
  const { steps, editStep } = useContext(StepContext);

  /* const addSelector =() => {
    port.sendMessage((msg) => {
      if (msg.token) {
        setToken(msg.token);
        getUser(msg.token)
      }
    });
  } */

  const onSubmit = (e, id) => {
    e.preventDefault();
    editStep(id, Serialize(e.target));
  };
  return (
    <li>
      <div className="card">
        <div className="card-bar d-flex flex-row align-items-center">
          <div>{`Step ${step.step}`}</div>
          <svg
            width="1.5em"
            height="1.5em"
            viewBox="0 0 16 16"
            className="bi bi-x-circle ml-auto"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
            onClick={() => deleteButton(step)}
          >
            <path
              fill-rule="evenodd"
              d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"
            />
            <path
              fill-rule="evenodd"
              d="M11.854 4.146a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708-.708l7-7a.5.5 0 0 1 .708 0z"
            />
            <path
              fill-rule="evenodd"
              d="M4.146 4.146a.5.5 0 0 0 0 .708l7 7a.5.5 0 0 0 .708-.708l-7-7a.5.5 0 0 0-.708 0z"
            />
          </svg>
        </div>
        <div className="card-content">
          <form
            className="card-form"
            onSubmit={(e) => onSubmit(e, steps.indexOf(step))}
          >
            <label htmlFor="title">Step title</label>
            <input
              name="title"
              defaultValue={step.title}
              className="card-form-input"
            ></input>
            <label htmlFor="conent">Step content</label>
            <textarea
              name="content"
              defaultValue={step.content}
              className="card-form-input card-form-input-content"
            ></textarea>
            <button>Submit card changes</button>
          </form>
        </div>
      </div>
    </li>
  );
};

export default Step;
