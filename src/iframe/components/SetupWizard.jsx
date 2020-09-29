import React, { useState, useEffect, useContext } from "react";
import Dropdown from "./Dropdown";
import { StepContext } from "../context/StepState";

const SetupWizard = () => {
  const { setFlow, setTourTitle } = useContext(StepContext);

  const [shelfs, setShelfs] = useState();
  const [books, setBooks] = useState();
  const [languageId, setLanguageId] = useState();
  const [flows, setFlows] = useState();
  const [title, setTitle] = useState();
  const [newFlow, setNewFlow] = useState(false);

  const port = chrome.runtime.connect(chrome.runtime.id, {
    name: "SetupWizard",
  });

  useEffect(() => {
    port.postMessage({ message: "shelf request" });
    port.onMessage.addListener((msg) => {
      if (msg.shelfs) {
        setShelfs(msg.shelfs.data);
      }
    });
    return () => {
      port.disconnect();
    };
  }, []);

  const setShelf = (shelfId) => {
    setBooks();
    setFlows();
    setNewFlow(false);
    setLanguageId();
    port.postMessage({ shelfId });
    port.onMessage.addListener((msg) => {
      if (msg.books) {
        setBooks(msg.books.data);
      }
    });
  };
  const setBook = (languageId) => {
    setFlows();
    setNewFlow(false);
    setLanguageId(languageId);
    port.postMessage({ languageId });
    port.onMessage.addListener((msg) => {
      if (msg.flows) {
        setFlows(msg.flows.data);
      }
    });
  };
  const ChooseFlow = (flowId) => {
    port.postMessage({ flowId });
    port.onMessage.addListener((msg) => {
      if (msg.flow) {
        let steps = JSON.parse(msg.flow.data.doc.steps);
        setTourTitle(msg.flow.data.name);
        setFlow(steps);
      }
    });
  };

  const createFlow = () => {
    port.postMessage({ message: "create new flow", title, languageId });
    port.onMessage.addListener((msg) => {
      if (msg.flow) {
        setTourTitle(msg.flow.data.name);
        setFlow([]);
      }
    });
  };

  const newFlowButtonClass = `btn btn-secondary btn-lg btn-block ${
    !flows ? "disabled" : null
  }`;
  return (
    <>
      <h1>Setup wizard</h1>
      <div id="main" className="d-flex flex-column">
        <div className="step-container container-fluid border-bottom">
          <div className="card-group my-3">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Getting started</h5>
                <form>
                  <div className="form-group">
                    <label for="exampleFormControlSelect1">
                      1. To get started, please select a product shelf
                    </label>
                    <Dropdown
                      subject={shelfs}
                      setId={setShelf}
                      _subjectName="shelfs"
                    />
                  </div>
                  <div className="form-group">
                    <label for="exampleFormControlSelect1">
                      2. then select tour book to update
                    </label>
                    <Dropdown
                      subject={books}
                      setId={setBook}
                      _subjectName="books"
                    />
                  </div>
                </form>
              </div>
            </div>
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Choose a tourguide</h5>
                <form>
                  <div className="form-group">
                    <label for="exampleFormControlSelect1">
                      3. Select a flow to update
                    </label>
                    <Dropdown subject={flows} setId={ChooseFlow} />
                  </div>
                  <div className="form-group">
                    <label for="exampleFormControlSelect1">or</label>
                    <button
                      className={newFlowButtonClass}
                      type="button"
                      onClick={() => setNewFlow(true)}>
                      Start a new flow
                    </button>
                  </div>
                </form>
              </div>
            </div>
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Starting a new flow</h5>
                <div className="form-group">
                  <label for="exampleFormControlSelect1">
                    4. Set flow title
                  </label>
                  <input
                    type="email"
                    disabled={`${!newFlow ? "true" : ""}`}
                    className="form-control"
                    id="exampleInputEmail1"
                    aria-describedby="emailHelp"
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label for="exampleFormControlSelect1">and</label>
                  <button
                    className="btn btn-primary btn-lg btn-block"
                    disabled={`${!title && !newFlow ? "true" : ""}`}
                    onClick={() => createFlow()}>
                    Define flow steps
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SetupWizard;
