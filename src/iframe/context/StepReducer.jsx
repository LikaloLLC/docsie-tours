export default (state, action) => {
  switch (action.type) {
    case "ADD_STEP":
      return {
        steps: state.steps.push(action.payload),
        ...state,
      };
    case "DELETE_STEP":
      return {
        steps: state.steps.splice(action.payload, 1),
        ...state,
      };
    default:
      return state;
  }
};
