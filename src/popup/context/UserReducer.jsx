export default (state, action) => {
  switch (action.type) {
    case "LOGIN_SUCCESS":
      return {
        ...state,
        user: action.payload,
      };
    case "GET_SHELFS":
      return {
        ...state,
        shelfs: action.payload,
      };
    case "GET_URL":
      return {
        ...state,
        bookUrl: action.payload,
      };
    default:
      return state;
  }
};
