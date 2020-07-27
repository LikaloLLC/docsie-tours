import React, { createContext, useReducer } from "react";
import axios from "axios";
import StepReducer from "./StepReducer";

let BlankArticle;
const initialState = {
  steps: [],
  user: null,
  books: null,
  shelfs: null,
};

export const StepContext = createContext(initialState);

export const StepProvider = ({ children }) => {
  const [state, dispatch] = useReducer(StepReducer, initialState);

  async function addStep(step) {
    try {
      dispatch({
        type: "ADD_STEP",
        payload: step,
      });
    } catch (err) {
      console.log(err);
    }
  }

  async function deleteStep(id) {
    try {
      dispatch({
        type: "DELETE_STEP",
        payload: id,
      });
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
      state.user = user.data;
      console.log(user, state.user);
    } catch (err) {
      console.log(err);
    }
  }

  /* async function getSteps(token) {
    //headers
    const config = {
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": token,
      },
    };

    try {
      const articles = await axios.get(
        "http://ec2-54-224-135-131.compute-1.amazonaws.com:8003/app/language/lan_E52CfvbK6NFdklD6v/articles/",
        config
      );
      console.log(articles);
    } catch (err) {
      console.log(err);
    }
  } */

  /* async function saveBook(token, data) {
    //headers
    const config = {
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": token,
      },
    };
    const body = data;
    try {
      const res = await axios.post(
        `http://ec2-54-224-135-131.compute-1.amazonaws.com:8003/app/documentation/doc_tMilaJbDpHHkDONkS/books/`,
        body,
        config
      ); 
      console.log(res);
    } catch (err) {
      console.log(err);
    }
  } */

  async function getBooks(token) {
    //headers
    const config = {
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": token,
      },
    };
    try {
      const books = await axios.get(
        `http://ec2-54-224-135-131.compute-1.amazonaws.com:8003/app/documentation/doc_tMilaJbDpHHkDONkS/books/`,
        config
      );
      console.log(books);
      books.data[0].language.id;
    } catch (err) {
      console.log(err);
    }
  }

  async function postSteps(token) {
    //headers
    const config = {
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": token,
      },
    };

    try {
      console.log(state.steps);
      state.steps.map(async (step) => {
        BlankArticle = {
          id: step.step,
          doc: step,
          tags: [],
          name: "Untitled article",
          description: null,
          documentation: null,
          order: 0,
          version: null,
          book: null,
          slug: "untitled",
          locked: false,
        };
        const articles = await axios.post(
          "http://ec2-54-224-135-131.compute-1.amazonaws.com:8003/app/language/lan_LrSZJL4jzEzP6JEcm/articles/",
          BlankArticle,
          config,
          { withCredentials: true }
        );

        console.log(articles);
      });
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <StepContext.Provider
      value={{
        steps: state.steps,
        user: state.user,
        addStep,
        deleteStep,
        editStep,
        getUser,
        getBooks,
        postSteps,
      }}
    >
      {children}
    </StepContext.Provider>
  );
};
