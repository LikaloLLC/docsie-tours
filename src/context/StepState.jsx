import React, { createContext, useReducer } from "react";
import StepReducer from "./StepReducer";

const initialState = {
  steps: [],
  shelves: [],
};

export const StepContext = createContext(initialState);

export const StepProvider = ({ children }) => {
  const [state, dispatch] = useReducer(StepReducer, initialState);

  async function addStep(step) {
    try {
      state.steps.push(step);
    } catch (err) {
      console.log(err);
    }
  }
  async function deleteStep(id) {
    try {
      state.steps.splice(id, 1);
    } catch (err) {
      console.log(err);
    }
  }

  async function editStep(id, data) {
    try {
      state.steps[id].title = data.title;
      state.steps[id].content = data.content;
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <StepContext.Provider
      value={{
        steps: state.steps,
        shelves: state.shelves,
        addStep,
        deleteStep,
        editStep
      }}
    >
      {children}
    </StepContext.Provider>
  );
};
