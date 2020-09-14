import React, { useState, useEffect, useContext } from "react";
import Step from "./Step";
import { StepContext } from "../context/StepState";

/* global chrome */
const ManagerPanel = () => {
  const { steps, addStep, deleteStep, saveTour, setShelf } = useContext(
    StepContext
  );

  const [title, setTitle] = useState("Tour");
  const [token, setToken] = useState("");
  const [url, setUrl] = useState();
  const [status, setStatus] = useState("Minimize");
  const [cancel, setCancel] = useState(false);
  const [selector, setSelector] = useState();
  const [count, setcount] = useState(0)

  const port = chrome.runtime.connect(chrome.runtime.id, { name: "iframe" });

  useEffect(() => {
    selector
      ? addStep({
          ...step,
          selector,
          step: steps.length > 0 ? steps[steps.length - 1].step + 1 : 1,
        })
      : null;
  }, [selector]);

  useEffect(() => {
    port.onMessage.addListener((msg) => {
      if (msg.token) {
        console.log("32132132", msg, msg.shelfId);
        setToken(msg.token);
        setUrl(msg.url);
        setShelf(msg.shelfId);
      }
    });

    chrome.runtime.onMessage.addListener((msg) => {
      if (typeof msg.message === "string") {
        setSelector(msg.message);
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
    console.log(steps.indexOf(step))
    deleteStep(steps.indexOf(step));
    setcount(count+1)
  };

  const cancelGuide = () => {
    chrome.tabs.getCurrent((id) => {
      console.log("getCurrent", id);
      port.postMessage({ message: "cancel", tabId: id.id });
    });
  };

  return (
    <div id="main" className="d-flex flex-column">
      <div className="navbar navbar-light border-bottom d-flex align-items-center test">
        <form className="form-inline my-2 my-lg-0">
          <label htmlFor="title" className="col-form-label mr-2">
            Title:
          </label>
          <input
            id="title"
            name="title"
            className="form-control"
            defaultValue={title}
            onChange={(e) => setTitle(e.target.value)}></input>
        </form>
        <div className=" btn-group ml-auto" role="group">
          <button
            className="btn btn-default"
            onClick={() => {
              setStatus(status === "Minimize" ? "Maximize" : "Minimize");
              chrome.tabs.getCurrent((tab) => {
                chrome.tabs.sendMessage(tab.id, { message: status });
              });
            }}>
            {status}
          </button>
          {cancel ? (
            <div class="btn-group" role="group">
              <button className="btn btn-default" onClick={() => cancelGuide()}>
                I want to discard all unsaved changes
              </button>
              <button
                className="btn btn-default"
                onClick={() => setCancel(false)}>
                Back
              </button>
            </div>
          ) : (
            <button className="btn btn-default" onClick={() => setCancel(true)}>
              Cancel
            </button>
          )}
          <button
            className="btn btn-primary"
            onClick={() => saveTour(token, title, url)}>
            Save
          </button>
        </div>
      </div>
      <div className="step-container container-fluid border-bottom">
        <div className="card-deck d-flex flex-row flex-nowrap">
          {Array.isArray(steps)
            ? steps.map((step) => {
                return (
                  <Step
                    key={Math.random()*10000}
                    step={step}
                    deleteButton={deleteButton}></Step>
                );
              })
            : null}
          <div className="card step">
            <button class="btn btn-icon h-100" onClick={() => addStep(step)}>
              <svg
                class="icon-plus-circle"
                width="48"
                height="48"
                viewBox="0 0 20 20">
                <g fill="none" stroke="currentColor">
                  <path d="M9 1h1v17H9z" />
                  <path d="M1 9h17v1H1z" />
                </g>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerPanel;
