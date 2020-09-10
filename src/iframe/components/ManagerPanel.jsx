import React, { useState, useEffect, useContext } from "react";
import Step from "./Step";
import { StepContext } from "../context/StepState";

/* global chrome */
const ManagerPanel = () => {
  const {
    steps,
    addStep,
    deleteStep,
    saveTour,
    setShelf,
  } = useContext(StepContext);

  const [title, setTitle] = useState("Tour");
  const [token, setToken] = useState("");
  const [url, setUrl] = useState()
  const [status, setStatus] = useState("minimize");
  const [cancel, setCancel] = useState(false);
  const [selector, setSelector] = useState()

  const port = chrome.runtime.connect(chrome.runtime.id, { name: "iframe" });

  useEffect(()=>{
    selector? addStep({...step, selector, step: steps.length > 0 ? steps[steps.length - 1].step + 1 : 1}): null
  }, [selector])

  useEffect(() => {
    port.onMessage.addListener((msg) => {
      if (msg.token) {
        console.log("32132132", msg, msg.shelfId);
        setToken(msg.token);
        setUrl(msg.url)
        setShelf(msg.shelfId);
      }
    });

    chrome.runtime.onMessage.addListener((msg) => {
      if (typeof msg.message === "string") {        
        setSelector(msg.message)
      } else {
      }
    });

    return () => {
      port.disconnect();
    };
  }, []);

  const step = {
    step: steps.length > 0 ? steps[steps.length - 1].step + 1 : 1,
    title: "Step title",
    content: "Step content",
    selector: null,
  };

  const deleteButton = (step) => {
    deleteStep(steps.indexOf(step));
  };

  const cancelGuide = () => {
    chrome.tabs.getCurrent((id) => {
      console.log("getCurrent", id);
      port.postMessage({ message: "cancel", tabId: id.id });
    });
  };

  const printTour = () => {
    console.log(steps)
  }

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
          onChange={(e) => setTitle(e.target.value)}></input>
        <div
          className="navbar-button btn-group ml-auto"
          role="group"
          aria-label="Basic example">
          <button
            className="btn btn-secondary"
            onClick={() => {
              setStatus(status === "minimize" ? "maximize" : "minimize");
              chrome.tabs.getCurrent((tab) => {
                chrome.tabs.sendMessage(tab.id, { message: status });
              });
            }}>
            {status}
          </button>
          {cancel ? (
            <div class="btn-group" role="group" aria-label="Basic example">
              <button
                className="btn btn-secondary"
                onClick={() => cancelGuide()}>
                I want to discard all unsaved changes
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => setCancel(false)}>
                back
              </button>
            </div>
          ) : (
            <button
              className="btn btn-secondary"
              onClick={() => setCancel(true)}>
              cancel
            </button>
          )}
          <button
            className="btn btn-secondary"
            onClick={() => saveTour(token, title, url)}>
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
                    deleteButton={deleteButton}></Step>
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
          }}>
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
