export default (state, action) => {
  switch (action.type) {
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
    case "TITLE_CHANGE":
      return {
        ...state,
        tourTitle: action.payload,
      };
    case "SHELFS_LOAD":
      return {
        ...state,
        shelfs: [...action.payload],
      };
    default:
      return state;
  }
};
