const stepReducer = (state, action) => {
  switch (action.type) {
    case "SETTING_FLOW":
      return {
        ...state,
        steps: action.payload,
      };
    case "SETTING_FLOW_ID":
      return {
        ...state,
        flowId: action.payload,
      };
    case "ADD_STEP":
      let _steps = [...state.steps];
      _steps.push(action.payload);
      return {
        ...state,
        steps: [..._steps],
      };
    case "DELETE_STEP":
      return {
        ...state,
        steps: [...action.payload],
      };
    case "TITLE_CHANGE":
      return {
        ...state,
        tourTitle: action.payload,
      };
    case "SET_SUBJECT":
      return {
        ...state,
        subjectName: action.payload,
      };
    default:
      return state;
  }
};

export default stepReducer;
