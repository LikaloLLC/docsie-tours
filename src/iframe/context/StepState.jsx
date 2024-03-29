import React, { createContext, useReducer, useCallback } from 'react';
import StepReducer from './StepReducer';

const initialState = {
  tourTitle: null,
  steps: null,
  flowId: null,
};

export const StepContext = createContext(initialState);

export const StepProvider = ({ children }) => {
  const [state, dispatch] = useReducer(StepReducer, initialState);

  const setFlow = useCallback((flow) => {
    try {
      dispatch({
        type: 'SETTING_FLOW',
        payload: flow,
      });
    } catch (err) {
      console.log(err);
    }
  }, []);

  const setFlowId = useCallback((flowId) => {
    try {
      dispatch({
        type: 'SETTING_FLOW_ID',
        payload: flowId,
      });
    } catch (err) {
      console.log(err);
    }
  }, []);

  const setTourTitle = useCallback((title) => {
    try {
      dispatch({
        type: 'TITLE_CHANGE',
        payload: title,
      });
    } catch (err) {
      console.log(err);
    }
  }, []);

  const addStep = useCallback((step) => {
    try {
      dispatch({
        type: 'ADD_STEP',
        payload: step,
      });
    } catch (err) {
      console.log(err);
    }
  }, []);

  const deleteStep = useCallback(
    (id) => {
      let _steps = state.steps;
      let a = _steps.splice(id, 1);
      state.steps = [..._steps];
      console.log(id, _steps, a);

      //change order
      _steps.forEach((el) => {
        el.step = _steps.indexOf(el) + 1;
      });
      try {
        dispatch({
          type: 'DELETE_STEP',
          payload: _steps,
        });
      } catch (err) {
        console.log(err);
      }
    },
    [state]
  );

  const editStep = useCallback(
    (id, data, type) => {
      try {
        switch (type) {
          case 'title':
            state.steps[id].title = data;
            break;
          case 'content':
            state.steps[id].content = data;
            break;
          case 'selector':
            state.steps[id].selector = data;
            break;
          default:
            break;
        }
      } catch (err) {
        console.log(err);
      }
    },
    [state.steps]
  );

  return (
    <StepContext.Provider
      value={{
        steps: state.steps,
        tourTitle: state.tourTitle,
        flowId: state.flowId,
        setFlow,
        setFlowId,
        setTourTitle,
        addStep,
        deleteStep,
        editStep,
      }}
    >
      {children}
    </StepContext.Provider>
  );
};
