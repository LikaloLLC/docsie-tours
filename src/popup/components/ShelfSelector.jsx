import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { UserContext } from "../context/UserState";

/* global chrome */
const ShelfSelector = () => {
  const { shelfs, bookUrl, getUser, getUrl } = useContext(UserContext);

  const [token, setToken] = useState()
  const [isOpen, setIsOpen] = useState(false);
  const [shelfId, setShelfId] = useState(null);
  const [shelfName, setShelfName] = useState("Select shelf");

  const port = chrome.runtime.connect("eokbffjgonmiogfjodfdbanbceahgogk", {
    name: "popup",
  });

  useEffect(() => {
    port.onMessage.addListener(async (msg) => {
      console.log("MSG", msg);
      if (msg.token) {
        setToken(msg.token)
        await getUser(msg.token);
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
          onClick={() => toggle()}
        >
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
                      getUrl(token, shelf.id);
                      setShelfName(shelf.name);
                      setIsOpen(false);
                    }}
                  >
                    {shelf.name}
                  </button>
                );
              })
            : null}
        </div>
      </div>
      <a
        className="btn elements btns btn-secondary"
        onClick={() => {
          bookUrl
            ? port.postMessage({
                message: bookUrl,
              })
            : null;
        }}
        href="#"
      >
        Record a guide
      </a>
      <a className="btn elements btns btn-secondary" href="#">
        Create a guided tour
      </a>
      <a
        className="btn elements btns btn-secondary"
        href="https://app.docsie.io/accounts/logout/"
      >
        Log out
      </a>
    </div>
  );
};

export default ShelfSelector;
