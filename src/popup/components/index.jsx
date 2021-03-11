import React, { useState, useEffect, useRef } from 'react';
import Config from '../../config.json';

/* global chrome */
const ShelfSelector = () => {
  const [loginStatus, setLoginStatus] = useState();
  const portRef = useRef(null);
  const domain = Config.urls.base;

  useEffect(() => {
    portRef.current = chrome.runtime.connect(chrome.runtime.id, {
      name: 'popup',
    });
    const onMessage = (msg) => {
      if (msg.status) {
        setLoginStatus(msg.status);
      }
    };
    portRef.current.onMessage.addListener(onMessage);

    return () => {
      portRef.current.onMessage.removeListener(onMessage);
      portRef.current.disconnect();
    };
  }, []);

  return (
    <div className="main d-flex flex-column ">
      {loginStatus === 'logged in' ? (
        <>
          <a
            className="btn elements btns btn-secondary"
            onClick={() => {
              portRef.current.postMessage({
                message: 'start record',
              });
              window.close();
            }}
            href="#void"
          >
            Record a guide
          </a>
          <a className="btn elements btns btn-secondary" href="#void">
            Create a guided tour
          </a>
          <a
            className="btn elements btns btn-secondary"
            href={`${domain}accounts/logout`}
            rel="noopener noreferrer"
            target="_blank"
          >
            Log out
          </a>
        </>
      ) : (
        <a
          className="btn elements btns btn-secondary"
          href={`${domain}login`}
          rel="noopener noreferrer"
          target="_blank"
        >
          Log in
        </a>
      )}
    </div>
  );
};

export default ShelfSelector;
