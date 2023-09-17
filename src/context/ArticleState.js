import ArticleContext from "./ArticleContext";
import { useState } from "react";

const ArticleState = (props) => {
  const host = "http://localhost:5000";
  const articlesInitial = [];

  const [articles, setArticles] = useState(articlesInitial);

  //* Getting logged user articles
  const getAllArticles = async (category) => {
    try {
      const url = category
        ? `${host}/api/articles/fetchallarticles?category=${category}`
        : `${host}/api/articles/fetchallarticles`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const json = await response.json();

      setArticles(json);
    } catch (error) {
      console.error("Error fetching articles:", error.message);
    }
  };

  //* Function to like an article
  const toggleLike = async (articleId) => {
    try {
      const response = await fetch(
        `${host}/api/articles/togglelike/${articleId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem("token"),
          },
        }
      );

      if (!response.ok) {
        console.error("Error toggling like: HTTP error!");
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const responseData = await response.json();

      const newArticles = articles.map((article) =>
        article._id === articleId
          ? {
              ...article,
              liked: responseData.liked,
              likesCount: responseData.likesCount,
            }
          : article
      );

      setArticles(newArticles);

      if (responseData.liked) {
        console.log("Like toggled");
      } else {
        console.log("Dislike toggled");
      }
    } catch (error) {
      console.error("Error toggling like:", error.message);
    }
  };

  //* Function to search articles by tags
  const searchArticlesByTags = async (tags) => {
    try {
      const url = `${host}/api/articles/search?tags=${tags}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setArticles(data);
    } catch (error) {
      throw new Error(`Error fetching data: ${error.message}`);
    }
  };
  //* Getting logged user articles
  const getLoggedArticles = async () => {
    const response = await fetch(
      `${host}/api/articles/fetchloggeduserarticles`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
      }
    );
    const json = await response.json();
    setArticles(json);
  };

  //* Adding article
  const addArticle = async (title, description, tags, category) => {
    const response = await fetch(`${host}/api/articles/addarticle`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },

      body: JSON.stringify({ title, description, tags, category }),
    });
    const article = await response.json();
    setArticles(articles.concat(article));
  };

  //* Deleting article
  const deleteArticle = async (id) => {
    const response = await fetch(`${host}/api/articles/deletearticle/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
    });
    const json = response.json();
    console.log(json);

    console.log("Deleted the article having id " + id);
    const newArticles = articles.filter((article) => {
      return article._id !== id;
    });
    setArticles(newArticles);
  };

  //* Edit article

  const editArticle = async (id, title, description, tags, category) => {
    const response = await fetch(`${host}/api/articles/updatearticle/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },

      body: JSON.stringify({ title, description, tags, category }),
    });
    const json = await response.json();
    console.log(json);

    let newArticles = JSON.parse(JSON.stringify(articles));
    //* Edit logic
    for (let index = 0; index < newArticles.length; index++) {
      const element = newArticles[index];
      if (element._id === id) {
        newArticles[index].title = title;
        newArticles[index].description = description;
        newArticles[index].tags = tags;
        newArticles[index].category = category;
        break;
      }
    }
    setArticles(newArticles);
  };

  return (
    <ArticleContext.Provider
      value={{
        articles,
        addArticle,
        deleteArticle,
        editArticle,
        getAllArticles,
        getLoggedArticles,
        searchArticlesByTags,
        toggleLike,
      }}
    >
      {props.children}
    </ArticleContext.Provider>
  );
};

export default ArticleState;
