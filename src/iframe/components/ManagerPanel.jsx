import React, { useState, useEffect, useContext } from "react";
import SetupWizard from "./SetupWizard";
import Step from "./Step";
import Navbar from "./Navbar";
import { StepContext } from "../context/StepState";

const ManagerPanel = () => {
  const {
    setFlow,
    setTourTitle,
    tourTitle,
    steps,
    flowId,
    addStep,
    deleteStep,
    editStep,
  } = useContext(StepContext);

  const [status, setStatus] = useState("Minimize");
  const [stepId, setStepId] = useState();
  const [selector, setSelector] = useState(null);

  const port = chrome.runtime.connect(chrome.runtime.id, {
    name: "ManagerPanel",
  });

  useEffect(() => {
    if (selector) {
      editStep(stepId, selector, "selector");
      changeStatus();
      setSelector(null);
    }
  }, [selector]);

  useEffect(() => {
    chrome.runtime.onMessage.addListener((msg) => {
      if (typeof msg.message === "string") {
        setSelector(msg.message);
      }
      if (msg.flow) {
        let steps = JSON.parse(msg.flow.data.doc.steps);
        setTourTitle(msg.flow.data.name);
        setFlow(steps);
      }
    });
    return () => {
      port.disconnect();
    };
  }, []);

  const step = {
    step: steps && steps.length > 0 ? steps[steps.length - 1].step + 1 : 1,
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
    console.log("object", flowId)
    port.postMessage({
      message: "save tour",
      tour: steps,
      title: tourTitle,
      flowId
    });
  };

  return (
    <>
      {steps ? (
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
                <button
                  class="btn btn-icon h-100"
                  onClick={() => addStep(step)}>
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
      ) : (
        <SetupWizard />
      )}
    </>
  );
};

export default ManagerPanel;
