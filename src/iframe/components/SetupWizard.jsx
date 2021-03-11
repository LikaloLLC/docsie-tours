import React, { useState, useEffect, useContext, useRef } from 'react';
import Dropdown from './Dropdown';
import { StepContext } from '../context/StepState';

/* global chrome */
const SetupWizard = () => {
  const { setFlow, setTourTitle, setFlowId } = useContext(StepContext);

  const [shelfs, setShelfs] = useState();
  const [books, setBooks] = useState();
  const [languageId, setLanguageId] = useState();
  const [flows, setFlows] = useState();
  const [title, setTitle] = useState();
  const [newFlow, setNewFlow] = useState(false);
  const portRef = useRef(null);

  useEffect(() => {
    portRef.current = chrome.runtime.connect(chrome.runtime.id, {
      name: 'SetupWizard',
    });
    portRef.current.postMessage({ message: 'shelf request' });

    const onMessage = (msg) => {
      if (msg.shelfs) {
        setShelfs(msg.shelfs.data);
      }
      if (msg.flows) {
        setFlows(msg.flows.data);
      }
      if (msg.books) {
        setBooks(msg.books);
      }
    };
    portRef.current.onMessage.addListener(onMessage);

    return () => {
      portRef.current.onMessage.removeListener(onMessage);
      portRef.current.disconnect();
    };
  }, []);

  const closeExtension = () => {
    chrome.tabs.getCurrent((tab) => {
      portRef.current.postMessage({ message: 'cancel', tabId: tab.id });
    });
  };

  const setShelf = (shelfId) => {
    setBooks();
    setFlows();
    setNewFlow(false);
    setLanguageId();
    portRef.current.postMessage({ shelfId });
  };

  const setBook = (languageId) => {
    setFlows();
    setNewFlow(false);
    setLanguageId(languageId);
    portRef.current.postMessage({ languageId });
  };

  const ChooseFlow = (flowId) => {
    const flow = flows.find((f) => f.id === flowId);
    if (!flow) return;

    setFlowId(flow.id);
    setFlow(flow.doc.steps);
    setTourTitle(flow.name);
  };

  const createFlow = () => {
    portRef.current.postMessage({
      message: 'create new flow',
      title,
      languageId,
    });
    portRef.current.onMessage.addListener((msg) => {
      if (msg.flow) {
        setTourTitle(msg.flow.data.name);
        setFlow([]);
      }
    });
  };

  const newFlowButtonClass = `btn btn-secondary btn-lg btn-block ${
    !flows ? 'disabled' : null
  }`;
  return (
    <>
      <div className="navbar navbar-light border-bottom d-flex align-items-center main">
        <h1>Setup wizard</h1>
        <button
          className="btn btn-default ml-auto"
          onClick={() => closeExtension()}
        >
          Close
        </button>
      </div>
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
                      subjectName="shelf"
                    />
                  </div>
                  <div className="form-group">
                    <label for="exampleFormControlSelect1">
                      2. then select tour book to update
                    </label>
                    <Dropdown
                      subject={books}
                      setId={setBook}
                      subjectName="book"
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
                    <Dropdown
                      subject={flows}
                      setId={ChooseFlow}
                      subjectName="flow"
                    />
                  </div>
                  <div className="form-group">
                    <label for="exampleFormControlSelect1">or</label>
                    <button
                      className={newFlowButtonClass}
                      type="button"
                      onClick={() => setNewFlow(true)}
                    >
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
                    disabled={`${!newFlow ? 'true' : ''}`}
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
                    disabled={`${!title && !newFlow ? 'true' : ''}`}
                    onClick={() => createFlow()}
                  >
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
