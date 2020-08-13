export default (state, action) => {
  switch (action.type) {
    case "ADD_STEP":
      let _steps = [...state.steps]
      _steps.push(action.payload)
      return {
        ...state,
        steps: [..._steps],
      };
    case "DELETE_STEP":
      state.steps.splice(action.payload, 1)
      console.log(state.steps)
      return {
        ...state,
        steps: [...state.steps]
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
