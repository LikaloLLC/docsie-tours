import React, { createContext, useReducer } from "react";
import axios from "axios";
import UserReducer from "./UserReducer";

const initialState = {
  user: null,
  shelfs: null,
  bookUrl:null,
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
        "http://ec2-54-224-135-131.compute-1.amazonaws.com:8003/rest-auth/user/",
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
        `http://ec2-54-224-135-131.compute-1.amazonaws.com:8003/app/documentation/?workspace=${user.profile_details.workspace}`,
        config
      );
      console.log(shelfs)
      dispatch({
        type: "GET_SHELFS",
        payload: shelfs,
      });
    } catch (err) {
      console.log(err);
    }
  }
  
  async function getUrl(token, shelfId){
    //headers
    const config = {
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken":token,
      },
    };
    try {
      const books = await axios.get(`http://ec2-54-224-135-131.compute-1.amazonaws.com:8003/app/documentation/${shelfId}/books/`, config)   
      const url = `http://ec2-54-224-135-131.compute-1.amazonaws.com:8003/organization/docsie/#/book/${books.data[0].id}/`
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
