import React, { useState, useContext, useEffect } from "react";
import { UserContext } from "../context/UserState";

/* global chrome */
const ShelfSelector = () => {
  const { shelfs, bookUrl, getUser, getUrl } = useContext(UserContext);

  const [token, setToken] = useState();
  const [isOpen, setIsOpen] = useState(false);
  const [shelfId, setShelfId] = useState(null);
  const [shelfName, setShelfName] = useState("Select shelf");

  const port = chrome.runtime.connect(chrome.runtime.id, {
    name: "popup",
  });

  useEffect(() => {
    port.onMessage.addListener((msg) => {
      if (msg.token) {
        setToken(msg.token);
        getUser(msg.token);
      }
    });

    return () => {
      port.disconnect();
    };
  }, []);

  const toggle = () => setIsOpen(!isOpen);

  const menuClass = `test dropdown-menu${isOpen ? " show" : ""}`;
  return (
    <div className="main d-flex flex-column ">
      <div className="menu dropdown">
        <button
          className="btn btn-outline-secondary dropdown-toggle elements"
          type="button"
          id="dropdownMenu2"
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="false"
          onClick={() => toggle()}>
          {shelfName}
        </button>
        <div className={menuClass} aria-labelledby="dropdownMenuLink">
          {shelfs
            ? shelfs.data.map((shelf) => {
                return (
                  <button
                    class="dropdown-item item"
                    type="button"
                    key={shelf.id}
                    onClick={() => {
                      setShelfName(shelf.name);
                      setShelfId(shelf.id);
                      setIsOpen(false);
                    }}>
                    {shelf.name}
                  </button>
                );
              })
            : null}
        </div>
      </div>
      <a className="btn elements btns btn-secondary"
        onClick={() => {
          if (shelfId) {
            port.postMessage({
              message: shelfId,
            });
            window.close();
          }
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
    </div>
  );
};

export default ShelfSelector;
