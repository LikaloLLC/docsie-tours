import React, { createContext, useReducer } from "react";
import axios from "axios";
import StepReducer from "./StepReducer";

const initialState = {
  steps: [],
  user: null,
  book: null,
  shelf: null,
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

  async function setShelf(shelf){
    try {
      dispatch({
        type:"SET_SHELF",
        payload:shelf
      })      
    } catch (err) {
      console.log(err)      
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

  async function setBook(bookId) {
    try {
      dispatch({
        type: "SET_BOOK",
        payload: bookId,
      });
      const versions = await axios.get(
        `http://ec2-54-224-135-131.compute-1.amazonaws.com:8003/app/book/${bookId}/versions/`
      );

      versions.data.map(async (version) => {
        if (version.active) {
          const languages = await axios.get(
            `http://ec2-54-224-135-131.compute-1.amazonaws.com:8003/app/version/${version.id}/languages/`
          );
          languages.data.map(async (language) => {
            if (language.active) {
              const articles = await axios.get(
                `http://ec2-54-224-135-131.compute-1.amazonaws.com:8003/app/language/${language.id}/articles/`
              );
              console.log(articles)
              articles.data.map((article)=>{
                article.description === state.book? console.log('MATCH'):console.log(article)
              })
              const res = await axios.get(
                `http://ec2-54-224-135-131.compute-1.amazonaws.com:8003/app/language/${language.id}/articles/`
              );
              dispatch({
                type: "SET_SHELF",
                payload: res.data[0].documentation
              });
            }
          });
        }
      });
    } catch (err) {
      console.log(err);
    }
  }

  async function getBooks(){
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    try {
      const books = await axios.get(
        `https://app.docsie.io/app/documentation/doc_BGFUc59YU1zdGma5t/books/`,
        config
      );
      console.log(books)
    } catch (err) {
      console.log(err)      
    }
  }

  async function saveTour(token, title) {
    //headers
    const config = {
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": token
      },
    };
    const body = {
      name: title,
      description: "",
      type: "tour",
      primary: null,
      locale: {},
      published: false,
      collection: [],
      style: {},
      url_path: "",
      tags: [],
      total_stars: 0,
      version: "0.0.1",
      language: "en",
      meta: {},
    };
    try {
      /* const books = await axios.get(
        `http://ec2-54-224-135-131.compute-1.amazonaws.com:8003/app/documentation/${state.shelf}/books/`,
        body,
        config
      );
      console.log(books) */
      const book = await axios.post(
        `https://app.docsie.io/app/documentation/doc_BGFUc59YU1zdGma5t/books/`,
        body,
        config
      );
      console.log(state.book)

      /* let data = {
        name: "testname",
        description: state.book,
        tags: [],
        doc: {
          v: 1,
          meta: {
            autorun: true,
            linked: false,
          },
          steps: JSON.stringify(state.steps),
        },
        book: book.data.book.id,
        documentation: "doc_tMilaJbDpHHkDONkS",
        template: "tour",
        revision: 0,
        updators: [],
        updated_by: null,
        locked: false,
      };
      const articles = await axios.get(
        `http://ec2-54-224-135-131.compute-1.amazonaws.com:8003/app/language/${book.data.book.language.id}/articles/`,
      );
      articles.data.map(async (article)=>{
        if(article.description===data.description){
          await axios.put(
            `http://ec2-54-224-135-131.compute-1.amazonaws.com:8003/app/language/${book.data.book.language.id}/articles/`,
            data,
            config
          );
        } else{
          await axios.post(
            `http://ec2-54-224-135-131.compute-1.amazonaws.com:8003/app/language/${book.data.book.language.id}/articles/`,
            data,
            config
          );
        }
      }) */
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <StepContext.Provider
      value={{
        steps: state.steps,
        user: state.user,
        book: state.book,
        addStep,
        deleteStep,
        editStep,
        getUser,
        saveTour,
        setBook,
        getBooks,
        setShelf,
      }}>
      {children}
    </StepContext.Provider>
  );
};
