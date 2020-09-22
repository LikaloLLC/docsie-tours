import React, { useState, useEffect, useContext } from "react";
import Step from "./Step";
import Navbar from "./Navbar";
import { StepContext } from "../context/StepState";

/* global chrome */
const ManagerPanel = () => {
  const {
    tourTitle,
    shelf,
    steps,
    setShelfs,
    addStep,
    deleteStep,
    editStep,
  } = useContext(StepContext);

  const [status, setStatus] = useState("Minimize");
  const [stepId, setStepId] = useState();
  const [selector, setSelector] = useState(null);

  const port = chrome.runtime.connect(chrome.runtime.id, { name: "iframe" });

  useEffect(() => {
    if (selector) {
      editStep(stepId, selector, "selector");
      changeStatus();
      setSelector(null);
    }
  }, [selector]);

  useEffect(() => {
    port.onMessage.addListener((msg) => {
      console.log(msg);
      if (msg.shelfs) {
        setShelfs(msg.shelfs.data);
      }
    });

    chrome.runtime.onMessage.addListener((msg) => {
      if (typeof msg.message === "string") {
        setSelector(msg.message);
      }
    });

    return () => {
      port.disconnect();
    };
  }, []);

  const step = {
    step: steps.length > 0 ? steps[steps.length - 1].step + 1 : 1,
    title: null,
    content: null,
    selector: null,
  };

  const selectorRequest = (stepId) => {
    setStepId(stepId);
    typeof stepId === "number"
      ? chrome.tabs.getCurrent((tab) => {
          chrome.tabs.sendMessage(tab.id, { message: "selector request" });
          changeStatus();
        })
      : null;
  };

  const deleteButton = (step) => {
    deleteStep(steps.indexOf(step));
  };

  const changeStatus = () => {
    setStatus(status === "Minimize" ? "Maximize" : "Minimize");
    chrome.tabs.getCurrent((tab) => {
      chrome.tabs.sendMessage(tab.id, { message: status });
    });
  };

  const cancelGuide = () => {
    chrome.tabs.getCurrent((tab) => {
      port.postMessage({ message: "cancel", tabId: tab.id });
    });
  };

  const saveTour = () => {
    port.postMessage({
      message: "save tour",
      tour: steps,
      shelf: shelf,
      title: tourTitle,
    });
  };

  return (
    <div id="main" className="d-flex flex-column">
      <Navbar
        cancelGuide={cancelGuide}
        changeStatus={changeStatus}
        status={status}
        saveTour={saveTour}
      />
      <div className="step-container container-fluid border-bottom">
        <div className="card-deck d-flex flex-row flex-nowrap">
          {Array.isArray(steps)
            ? steps.map((step) => {
                return (
                  <Step
                    key={Math.random() * 10000}
                    step={step}
                    deleteButton={deleteButton}
                    selectorRequest={selectorRequest}></Step>
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
