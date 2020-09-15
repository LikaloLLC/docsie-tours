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
    <div className="card step">
      <form
        className="card-form"
        onSubmit={(e) => onSubmit(e, steps.indexOf(step))}>
        <div className="card-header d-flex">
          <div>{`Step ${step.step}`}</div>
          <div class="ml-auto">
            <button class="btn btn-icon mr-2">
              <svg class="icon-save" width="20" height="20" viewBox="0 0 20 20">
                <path
                  d="M1.5 1.5H16L18.5 4v14.5h-17z"
                  fill="none"
                  stroke="currentColor"
                />
                <path
                  d="M4.5 18.5v-8h11v8M14.5 2v5.5h-9V2M12 3v3M7 13h6M7 15h4"
                  fill="none"
                  stroke="currentColor"
                />
              </svg>
            </button>
            <button class="btn btn-secondary btn-icon" type="button" onClick={() => deleteButton(step)}>
              <svg
                class="icon-trash"
                width="20"
                height="20"
                viewBox="0 0 20 20">
                <path
                  d="M6.5 3V1.5h7V3M4.5 4v14.5h11V4"
                  fill="none"
                  stroke="currentColor"
                />
                <path
                  fill="currentColor"
                  d="M8 7h1v9H8zM11 7h1v9h-1zM2 3h16v1H2z"
                />
              </svg>
            </button>
          </div>
        </div>
        <div className="card-body">
          <div className="form-group">
            <label htmlFor="title" className="sr-only">
              Step title
            </label>
            <input
              name="title"
              defaultValue={step.title}
              className="form-control"></input>
          </div>
          <div className="form-group">
            <label htmlFor="conent" className="sr-only">
              Step content
            </label>
            <textarea
              name="content"
              defaultValue={step.content}
              className="form-control"></textarea>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Step;
