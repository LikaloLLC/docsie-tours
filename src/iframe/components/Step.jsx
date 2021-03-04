import React, { useContext } from "react";
import { StepContext } from "../context/StepState";

const Step = ({ step, deleteButton, selectorRequest }) => {
  const { steps, editStep } = useContext(StepContext);
  return (
    <div className="card step">
      <form className="card-form">
        <div className="card-header d-flex">
          <div>Step {step.step}</div>
          <div class="ml-auto">
            <button
              class="btn btn-icon mr-2"
              type="button"
              onClick={() => selectorRequest(steps.indexOf(step))}
            >
              <svg
                className="icon-location"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill="none"
                  stroke="#000"
                  stroke-width="1.01"
                  d="M10,0.5 C6.41,0.5 3.5,3.39 3.5,6.98 C3.5,11.83 10,19 10,19 C10,19 16.5,11.83 16.5,6.98 C16.5,3.39 13.59,0.5 10,0.5 L10,0.5 Z"
                />
                <circle fill="none" stroke="#000" cx="10" cy="6.8" r="2.3" />
              </svg>
            </button>
            <button
              class="btn btn-secondary btn-icon"
              type="button"
              onClick={() => deleteButton(step)}
            >
              <svg
                class="icon-trash"
                width="20"
                height="20"
                viewBox="0 0 20 20"
              >
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
        <div className="card-body pb-0">
          <div className="form-group">
            <label htmlFor="title" className="sr-only">
              Step title
            </label>
            <input
              name="title"
              defaultValue={step.title}
              placeholder="Step title"
              onBlur={(e) =>
                editStep(steps.indexOf(step), e.target.value, "title")
              }
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label htmlFor="conent" className="sr-only">
              Step content
            </label>
            <textarea
              name="content"
              defaultValue={step.content}
              placeholder="Step content"
              onBlur={(e) =>
                editStep(steps.indexOf(step), e.target.value, "content")
              }
              className="form-control"
            />
          </div>
          <small
            className="d-inline-block text-truncate"
            style={{ maxWidth: "230px" }}
          >
            {step.selector || "[no selector]"}
          </small>
        </div>
      </form>
    </div>
  );
};

export default Step;
