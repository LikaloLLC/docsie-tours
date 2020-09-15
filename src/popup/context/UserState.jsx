import React, { createContext, useReducer } from "react";
import axios from "axios";
import { URI } from "../../utils";
import Config from "../../config.json";
import UserReducer from "./UserReducer";

const initialState = {
  user: null,
  shelfs: null,
  bookUrl: null,
};

export const UserContext = createContext(initialState);

export const UserProvider = ({ children }) => {
  const [state, dispatch] = useReducer(UserReducer, initialState);

  async function getUser(token) {
    const config = {
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": token,
      },
    };
    try {
      const user = await axios.get(
        new URI(Config.urls.auth.user),
        config
      );
      dispatch({
        type: "LOGIN_SUCCESS",
        payload: user.data,
      });
      getShelfs(token, user.data)
    } catch (err) {
      console.log(err);
    }
  }

  async function getShelfs(token, user) {
    //headers
    const config = {
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": token,
      },
    };

    try {
      const shelfs = await axios.get(
        new URI(Config.urls.library.all, { workspaceId: user.spaces[0].id }),
        config
      );
      dispatch({
        type: "GET_SHELFS",
        payload: shelfs,
      });
      console.log(shelfs)
    } catch (err) {
      console.log(err);
    }
  }

  async function getUrl(token, shelfId) {
    //headers
    const config = {
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": token,
      },
    };
    try {
      const books = await axios.get(
        new URI(Config.urls.library.books, { shelfId })
        , config
      );
      const url = new URI(Config.urls.library.book, { bookId: books.data[0].id }).url
      dispatch({
        type: "GET_URL",
        payload: url,
      });
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <UserContext.Provider
      value={{
        user: state.user,
        shelfs: state.shelfs,
        bookUrl: state.bookUrl,
        getUser,
        getShelfs,
        getUrl
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
