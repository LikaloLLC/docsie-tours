export default (state, action) => {
  switch (action.type) {
    case "ADD_STEP":
      let _steps = state.steps.push(action.payload)
      console.log(state.steps)
      return {
        ...state,
        steps: [...state.steps],
      };
    case "DELETE_STEP":
      let steps = state.steps.splice(action.payload, 1)
      return {
        ...state,
        steps: [...steps]
      };
    case "SET_SHELF":
      return {
        ...state,
        shelf: action.payload,
      };
    case "SET_BOOK":
      return {
        ...state,
        book: action.payload,
      };
    default:
      return state;
  }
};
