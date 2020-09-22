import React, { useState, useContext } from "react";
import { StepContext } from "../context/StepState";

const Navbar = ({ cancelGuide, changeStatus, status, saveTour }) => {
  const { tourTitle, setTourTitle, shelfs, setShelf } = useContext(StepContext);
  const [isOpen, setIsOpen] = useState(false);
  const [shelfName, setShelfName] = useState("Select shelf");
  const [cancel, setCancel] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  const menuClass = `test dropdown-menu${isOpen ? " show" : ""}`;
  return (
    <div className="navbar navbar-light border-bottom d-flex align-items-center test">
      <form className="form-inline my-2 my-lg-0">
        <label htmlFor="title" className="col-form-label mr-2">
          Title:
        </label>
        <input
          id="title"
          name="title"
          className="form-control"
          placeholder="Tour title"
          defaultValue={tourTitle}
          onBlur={(e) => setTourTitle(e.target.value)}></input>
      </form>
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
            ? shelfs.map((shelf) => {
                return (
                  <button
                    class="dropdown-item item"
                    type="button"
                    key={shelf.id}
                    onClick={() => {
                      setShelfName(shelf.name);
                      setShelf(shelf.id);
                      setIsOpen(false);
                    }}>
                    {shelf.name}
                  </button>
                );
              })
            : null}
        </div>
      </div>
      <div className=" btn-group ml-auto" role="group">
        <button className="btn btn-default" onClick={() => changeStatus()}>
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
        <button className="btn btn-primary" onClick={() => saveTour()}>
          Save
        </button>
      </div>
    </div>
  );
};

export default Navbar;
