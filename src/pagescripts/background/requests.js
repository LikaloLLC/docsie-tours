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
      new URI(Config.urls.library.all, {
        workspaceId: user.data.profile_details.workspace,
      }),
      config
    );
    return shelfs;
  } catch (err) {
    console.log(err);
  }
}

export async function getBooks(shelf, token) {
  //headers
  const config = {
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": token,
    },
  };

  try {
    const books = await axios.get(
      new URI(Config.urls.book.all, { shelfId: shelf }),
      config
    );
    let tourBooks = []
    books.data.map(book => {
      book.type === "tour" ? tourBooks.push(book): null
    })
    return tourBooks;
  } catch (err) {
    console.log(err);
  }
}

export async function getFlows(languageId, token) {
  //headers
  const config = {
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": token,
    },
  };
  try {
    const flows = await axios.get(
      new URI(Config.urls.article.all, {
        languageId: languageId,
      }),
      config
    );
    return flows;
  } catch (err) {
    console.log(err);
  }
}

export async function getFlow(flowId, token) {
  //headers
  const config = {
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": token,
    },
  };

  try {
    const flow = await axios.get(
      new URI(Config.urls.article.details, {
        articleId: flowId,
      }),
      config
    );
    return flow;
  } catch (err) {
    console.log(err);
  }
}

export async function newFlow(title, languageId, url, token){
  //headers
  const config = {
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": token,
    },
  };

  const articleData = {
    name: title,
    description: url,
    doc: {
      v: 1,
      blocks: [],
      entityMap: {},
      meta: {
        autorun: true,
        linked: false,
      },
      steps: "",
    },
    tags: [],
    template: "tour",
  };
  
  try {
    const flow = await axios.post(
      new URI(Config.urls.article.all, {
        languageId,
      }),
      articleData,
      config
    );
    return flow
  } catch (err) {
    console.log(err)    
  }

}

export async function saveFlow(token, url, title, tour, flowId) {
  //headers
  const config = {
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": token,
    },
  };
  const articleData = {
    name: title,
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
  try {
    axios.put(
      new URI(Config.urls.article.details, { articleId: flowId }),
      articleData,
      config
    );
  } catch (err) {
    console.log(err);
  }
}
