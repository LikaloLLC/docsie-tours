import React, { useState, useEffect } from "react";

/* global chrome */
const ShelfSelector = () => {
  const port = chrome.runtime.connect(chrome.runtime.id, {
    name: "popup",
  });
  const [loginStatus, setLoginStatus] = useState();

  useEffect(() => {
    port.onMessage.addListener((msg) => {
      if (msg.status) {
        console.log(msg.status);
        setLoginStatus(msg.status);
      }
    });

    return () => {
      port.disconnect();
    };
  }, []);
  return (
    <div className="main d-flex flex-column ">
      {loginStatus === "logged in" ? (
        <>
          <a
            className="btn elements btns btn-secondary"
            onClick={() => {
              port.postMessage({
                message: "start record",
              });
              window.close();
            }}
            href="#void">
            Record a guide
          </a>
          <a className="btn elements btns btn-secondary" href="#void">
            Create a guided tour
          </a>
          <a
            className="btn elements btns btn-secondary"
            href="https://app.docsie.io/accounts/logout/">
            Log out
          </a>
        </>
      ) : (
        <a
          className="btn elements btns btn-secondary"
          href="https://app.docsie.io/organization/docsie/#/">
          Log in
        </a>
      )}
    </div>
  );
};

export default ShelfSelector;
