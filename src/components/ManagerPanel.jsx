import React, { useState, useEffect, useContext } from "react";
import { StepContext } from "../context/StepState";
import missingNumbers from "../utils/stepnumber";
import Serialize from "../utils/serialize";

const ManagerPanel = () => {
  const { steps, addStep, deleteStep, editStep } = useContext(StepContext);

  const [title, setTitle] = useState("title 1");
  const [count, setCount] = useState(1);

  useEffect(() => {
    console.log(steps);
  }, [steps]);

  const step = {
    number: count,
    title: "title123",
    content: "test123",
    targetElement: "kappa213",
  };

  /* chrome.accessibilityFeatures.focusHighlight */
  const onSubmit = (e, id) => {
    e.preventDefault();
    editStep(id, Serialize(e.target));
    
  };
  return (
    <div id="main" className="d-flex flex-column">
      <div
        style={{ borderBottom: "1px solid" }}
        className="d-flex align-items-center"
      >
        <label htmlFor="title" style={{ margin: "0 10px 0 10px" }}>
          Title:
        </label>
        <input
          id="title"
          name="title"
          defaultValue={title}
          onChange={(e) => setTitle(e.target.value)}
        ></input>
        <div
          className="btn-group ml-auto"
          role="group"
          aria-label="Basic example"
        >
          <button>cancel</button>
          <button onClick={() => console.log(steps)}>save</button>
        </div>
      </div>
      <div
        className="d-flex flex-row align-items-center card-box"
      >
        <ul
          className="d-flex flex-row align-items-center"
          style={{ listStyleType: "none", margin: "0" }}
        >
          {Array.isArray(steps)
            ? steps.map((step) => {
                return (
                  <li key={step.number}>
                    <div
                      className="card"
                      style={{
                        width: "340px",
                        height: "220px",
                        marginRight: "20px",
                        border: "1px solid black",
                      }}
                    >
                      <div
                        className=" d-flex flex-row align-items-center"
                        style={{ margin: "10px 10px 10px 10px" }}
                      >
                        <div>{`Step ${step.number}`}</div>
                        <button
                          onClick={() => {
                            console.log(steps.indexOf(step));
                            deleteStep(steps.indexOf(step));
                            setCount(count+1);
                          }}
                          style={{ width: "15px", height: "15px" }}
                          className="ml-auto"
                        >
                          X
                        </button>
                      </div>
                      <div
                        style={{ margin: "0 10px 10px 10px", height: "160px" }}
                      >
                        <form
                          style={{ height: "160px", width: "100%" }}
                          onSubmit={(e) => onSubmit(e, steps.indexOf(step))}
                        >
                          <label htmlFor="title">Step title</label>
                          <input
                            name="title"
                            defaultValue={step.title}
                            className="form-input"
                          ></input>
                          <label htmlFor="conent">Step content</label>
                          <textarea
                            name="content"
                            defaultValue={step.content}
                            className="form-input form-input-content"
                          ></textarea>
                          <button>Submit card changes</button>
                        </form>
                      </div>
                    </div>
                  </li>
                );
              })
            : null}
        </ul>

        <button
          onClick={() => {
            addStep(step);
            setCount(count + 1);
          }}
        >
          X
        </button>
      </div>
    </div>
  );
};

export default ManagerPanel;
