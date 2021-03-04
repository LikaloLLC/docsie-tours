import React, { useState, useContext } from "react";
import { StepContext } from "../context/StepState";

const Navbar = ({ cancelGuide, changeStatus, status, saveTour }) => {
  const { tourTitle, setTourTitle, setFlow } = useContext(StepContext);
  const [cancel, setCancel] = useState(false);

  return (
    <div className="navbar navbar-light border-bottom d-flex align-items-center">
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
          onBlur={(e) => setTourTitle(e.target.value)}
        />
      </form>
      <div className=" btn-group ml-auto" role="group">
        <button className="btn btn-default" onClick={() => changeStatus()}>
          {status}
        </button>
        <button className="btn btn-default" onClick={() => setFlow(null)}>
          Back to flow selector
        </button>
        {cancel ? (
          <div class="btn-group" role="group">
            <button className="btn btn-default" onClick={() => cancelGuide()}>
              I want to discard all unsaved changes
            </button>
            <button
              className="btn btn-default"
              onClick={() => setCancel(false)}
            >
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
