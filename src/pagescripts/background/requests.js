import axios from "axios";
import { URI } from "../../utils";
import Config from "../../config.json";

export async function getUser(token) {
  const config = {
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": token,
    },
  };
  try {
    const user = await axios.get(new URI(Config.urls.auth.user), config);
    return user;
  } catch (err) {
    console.log(err);
  }
}

export async function getShelfs(user, token) {
  //headers
  const config = {
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": token,
    },
  };

  try {
    const shelfs = await axios.get(
      new URI(Config.urls.library.all, { workspaceId: user.data.spaces[0].id }),
      config
    );
    return shelfs;
  } catch (err) {
    console.log(err);
  }
}

export async function saveTour(token, url, title, tour, shelf) {
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
      steps: JSON.stringify(tour),
    },
    tags: [],
    template: "tour",
  };
  console.log(token);
  try {
    const books = await axios.get(
      new URI(Config.urls.book.all, { shelfId: shelf }),
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
        new URI(Config.urls.book.all, { shelfId: shelf }), //lan_5CugfAlCIlunJwcqY
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
