import React, { createContext, useReducer } from "react";
import axios from "axios";
import StepReducer from "./StepReducer";
import { URI } from "../../utils";
import Config from "../../config.json";

const initialState = {
  steps: [],
  user: null,
  book: null,
  shelf: null,
};

export const StepContext = createContext(initialState);

export const StepProvider = ({ children }) => {
  const [state, dispatch] = useReducer(StepReducer, initialState);

  function addStep(step) {
    try {
      dispatch({
        type: "ADD_STEP",
        payload: step,
      });
    } catch (err) {
      console.log(err);
    }
  }

  function deleteStep(id) {
    let _steps = state.steps;
    let a = _steps.splice(id, 1);
    state.steps = [..._steps];
    console.log(id, _steps, a);

    //change order
    _steps.map((el) => {
      el.step = _steps.indexOf(el) + 1;
    });
    try {
      dispatch({
        type: "DELETE_STEP",
        payload: _steps,
      });
    } catch (err) {
      console.log(err);
    }
  }

  function editStep(id, data, type) {
    try {
      switch (type) {
        case "title":
          state.steps[id].title = data;
          break;
        case "content":
          state.steps[id].content = data;
          break;
        case "selector":
          state.steps[id].selector = data;
          break;
      }
    } catch (err) {
      console.log(err);
    }
  }

  function setShelf(shelf) {
    try {
      dispatch({
        type: "SET_SHELF",
        payload: shelf,
      });
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
      const user = await axios.get(new URI(Config.urls.auth.user), config);
      state.user = user.data;
      console.log(user, state.user);
    } catch (err) {
      console.log(err);
    }
  }

  async function saveTour(token, title, url) {
    //headers
    const config = {
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": token,
      },
    };
    const body = {
      name: title,
      type: "tour",
    };
    const articleData = {
      name: "tour",
      description: url,
      doc: {
        v: 1,
        blocks: [],
        entityMap: {},
        meta: {
          autorun: true,
          linked: false,
        },
        steps: JSON.stringify(state.steps),
      },
      tags: [],
      template: "tour",
    };
    console.log(token);
    try {
      const books = await axios.get(
        new URI(Config.urls.book.all, { shelfId: state.shelf }),
        body,
        config
      );
      console.log(books);
      let tourBook;
      books.data.map(async (book) => {
        if (book.type === "tour") {
          tourBook = book;
          console.log(tourBook);
        }
      });
      if (tourBook) {
        axios.post(
          new URI(Config.urls.article.all, {
            languageId: tourBook.language.id,
          }),
          articleData,
          config
        );
      } else {
        const book = await axios.post(
          new URI(Config.urls.book.all, { shelfId: state.shelf }), //lan_5CugfAlCIlunJwcqY
          body,
          config
        );
        await axios.post(
          new URI(Config.urls.article.all, {
            languageId: book.data.book.language.id,
          }),
          articleData,
          config
        );
      }
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
        setShelf,
      }}>
      {children}
    </StepContext.Provider>
  );
};
