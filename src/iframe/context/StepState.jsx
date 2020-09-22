import React, { createContext, useReducer } from "react";
import StepReducer from "./StepReducer";

const initialState = {
  tourTitle: null,
  steps: [],
  shelfs: [],
  shelf: null,
};

export const StepContext = createContext(initialState);

export const StepProvider = ({ children }) => {
  const [state, dispatch] = useReducer(StepReducer, initialState);

  function setTourTitle(title) {
    try {
      dispatch({
        type: "TITLE_CHANGE",
        payload: title,
      });
    } catch (err) {
      console.log(err);
    }
  }

  function setShelfs(shelfs) {
    try {
      dispatch({
        type: "SHELFS_LOAD",
        payload: shelfs,
      });
    } catch (err) {
      console.log(err);
    }
  }

  function addStep(step) {
    try {
      dispatch({
        type: "ADD_STEP",
        payload: step,
      });
    } catch (err) {
      console.log(err);
    }
  }

  function deleteStep(id) {
    let _steps = state.steps;
    let a = _steps.splice(id, 1);
    state.steps = [..._steps];
    console.log(id, _steps, a);

    //change order
    _steps.map((el) => {
      el.step = _steps.indexOf(el) + 1;
    });
    try {
      dispatch({
        type: "DELETE_STEP",
        payload: _steps,
      });
    } catch (err) {
      console.log(err);
    }
  }

  function editStep(id, data, type) {
    try {
      switch (type) {
        case "title":
          state.steps[id].title = data;
          break;
        case "content":
          state.steps[id].content = data;
          break;
        case "selector":
          state.steps[id].selector = data;
          break;
      }
    } catch (err) {
      console.log(err);
    }
  }

  function setShelf(shelf) {
    try {
      dispatch({
        type: "SET_SHELF",
        payload: shelf,
      });
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <StepContext.Provider
      value={{
        steps: state.steps,
        tourTitle: state.tourTitle,
        shelfs: state.shelfs,
        shelf: state.shelf,
        setTourTitle,
        addStep,
        deleteStep,
        editStep,
        setShelf,
        setShelfs,
      }}>
      {children}
    </StepContext.Provider>
  );
};
