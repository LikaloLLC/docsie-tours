import React, { useState, useEffect, useContext } from "react";
import Step from "./Step";
import { StepContext } from "../context/StepState";
import missingNumbers from "../utils/stepnumber";

const extensionId = "eokbffjgonmiogfjodfdbanbceahgogk";

/* global chrome */
const ManagerPanel = () => {
  const {
    steps,
    addStep,
    deleteStep,
    getUser,
    postSteps,
    getBooks
  } = useContext(StepContext);

  const [title, setTitle] = useState("title 1");
  const [token, setToken] = useState("");
  const [status, setStatus] = useState("minimize");
  const [cancel, setCancel] = useState(false);

  const port = chrome.runtime.connect(extensionId, { name: "iframe" });

  useEffect(() => {
    port.onMessage.addListener((msg) => {
      console.log("TESY",msg)
      if (msg.token) {        
        setToken(msg.token);
        getUser(msg.token);
      }
    });

    chrome.runtime.onMessage.addListener((msg) => {
      if (typeof msg.message === "object") {
        addStep({
          step: steps.length > 0 ? steps[steps.length - 1].step + 1 : 1,
          title: "title123",
          content: "test123",
          selector: msg.message,
        });
      }
    });

    return () => {
      port.disconnect();
    };
  }, []);

  const step = {
    step: steps.length > 0 ? steps[steps.length - 1].step + 1 : 1,
    title: "title123",
    content: "test123",
    selector: null,
  };

  const deleteButton = (step) => {
    deleteStep(steps.indexOf(step));
  };

  const cancelGuide = () => {
    port.postMessage({ message: "cancel" });
  };

  return (
    <div id="main" className="d-flex flex-column">
      <div className="navbar d-flex align-items-center">
        <label htmlFor="title" className="title">
          Title:
        </label>
        <input
          id="title"
          name="title"
          defaultValue={title}
          onChange={(e) => setTitle(e.target.value)}
        ></input>
        <div
          className="navbar-button btn-group ml-auto"
          role="group"
          aria-label="Basic example"
        >
          <button onClick={() => { 
            console.log(token)
            getBooks(token)}}>test</button>
          <button
            className="btn btn-secondary"
            onClick={() => {
              setStatus(status === "minimize" ? "maximize" : "minimize");
              chrome.tabs.getCurrent((tab) => {
                chrome.tabs.sendMessage(tab.id, { message: status });
              });
            }}
          >
            {status}
          </button>
          {cancel ? (
            <div class="btn-group" role="group" aria-label="Basic example">
              <button
                className="btn btn-secondary"
                onClick={() => cancelGuide()}
              >
                I want to discard all unsaved changes
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => setCancel(false)}
              >
                back
              </button>
            </div>
          ) : (
            <button
              className="btn btn-secondary"
              onClick={() => setCancel(true)}
            >
              cancel
            </button>
          )}
          <button
            className="btn btn-secondary"
            onClick={() => postSteps(token)}
          >
            save
          </button>
        </div>
      </div>
      <div className="d-flex flex-row align-items-center card-box">
        <ul className="card-list d-flex flex-row align-items-center">
          {Array.isArray(steps)
            ? steps.map((step) => {
                return (
                  <Step
                    key={step.step}
                    step={step}
                    deleteButton={deleteButton}
                  ></Step>
                );
              })
            : null}
        </ul>

        <svg
          width="1.5em"
          height="1.5em"
          viewBox="0 0 16 16"
          className="bi bi-plus-circle icons"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
          onClick={() => {
            addStep(step);
            console.log(steps);
          }}
        >
          <path
            fill-rule="evenodd"
            d="M8 3.5a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-.5.5H4a.5.5 0 0 1 0-1h3.5V4a.5.5 0 0 1 .5-.5z"
          />
          <path
            fill-rule="evenodd"
            d="M7.5 8a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1H8.5V12a.5.5 0 0 1-1 0V8z"
          />
          <path
            fill-rule="evenodd"
            d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"
          />
        </svg>
      </div>
    </div>
  );
};

export default ManagerPanel;
