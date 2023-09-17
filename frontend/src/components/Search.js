import React, { useContext, useEffect, useState } from "react";
import ArticleContext from "../context/ArticleContext";
import { useParams } from "react-router-dom";

const Search = (props) => {
  const { query } = useParams();
  const queryWithoutPrefix = query.startsWith("tags=")
    ? query.substring(5)
    : query;
  const context = useContext(ArticleContext);
  const { articles, searchArticlesByTags, toggleLike } = context;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [likedArticles, setLikedArticles] = useState([]);
  const userToken = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        if (query) {
          if (!articles || articles.length === 0) {
            await searchArticlesByTags(query);
          }
        } else {
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const truncatedDescriptions = articles.map((article) => {
    const description =
      article.description && article.description.length > 54 ? (
        <>
          {article.description.split(" ").slice(0, 54).join(" ")}
          <span className="text-danger fw-semibold">...more</span>
        </>
      ) : (
        article.description
      );
    return description;
  });

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const openModal = (article) => {
    setSelectedArticle(article);
  };

  const isArticleLikedByUser = (article) => {
    const isLiked = likedArticles.includes(article._id);

    if (userToken) {
      const previouslyLikedArticles =
        JSON.parse(localStorage.getItem(`${userToken}_likedArticles`)) || [];

      if (previouslyLikedArticles.includes(article._id)) {
        return true;
      }
    }

    return isLiked;
  };

  const handleLikeToggle = async (article) => {
    try {
      if (!userToken) {
        props.showAlert("Please Login/Signup to Like the Article", "warning");
        return;
      }

      const liked = likedArticles.includes(article._id);
      const updatedArticle = await toggleLike(article._id, liked, userToken);

      let updatedLikedArticles;

      if (liked) {
        updatedLikedArticles = likedArticles.filter((id) => id !== article._id);
      } else {
        updatedLikedArticles = [...likedArticles, article._id];
      }

      setLikedArticles(updatedLikedArticles);
      localStorage.setItem(
        `${userToken}_likedArticles`,
        JSON.stringify(updatedLikedArticles)
      );
    } catch (error) {
      console.error("Error toggling like:", error.message);
    }
  };

  return (
    <>
      {loading ? (
        <div className="text-center mt-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <>
          <div className="row my-3">
            <div className="container text-danger fs-1 d-flex justify-content-center align-items-center mx-auto">
              {articles.length === 0 && "Search result not found!"}
            </div>
            {articles.length !== 0 && (
              <div className="container d-flex justify-content-center align-items-center mx-auto">
                <h3 className=" align-items-center text-danger text-decoration-underline">
                  Showing Results of&nbsp;
                  <span className="text-primary">"{queryWithoutPrefix}"</span>
                </h3>
              </div>
            )}
            {articles.map((article, index) => (
              <div
                key={article._id}
                className="col-my-3"
                style={{ width: "437px" }}
              >
                <div className="card my-3 border border-info-subtle">
                  <div
                    className="card-body"
                    role="button"
                    onClick={() => openModal(article)}
                  >
                    <h5
                      data-bs-toggle="modal"
                      data-bs-target="#exampleModal"
                      className="card-title"
                    >
                      {article.title}
                    </h5>
                    <p
                      data-bs-toggle="modal"
                      data-bs-target="#exampleModal"
                      className="card-text"
                    >
                      {truncatedDescriptions[index]}
                    </p>
                    <div className="card-text text-primary d-flex justify-content-between align-items-center">
                      <i
                        className={`fa-solid fa-heart fs-5 ${
                          isArticleLikedByUser(article)
                            ? "text-danger"
                            : "text-secondary"
                        }`}
                        onClick={() => handleLikeToggle(article)}
                      ></i>
                      <div className="d-flex">
                        <span className="card-text">
                          {article.category.join(", ")}
                        </span>
                      </div>
                    </div>
                    <div className="d-flex d-flex justify-content-between align-items-center">
                      <span className="card-text fw-semibold">
                        By: {article.user.name}
                      </span>
                      <span className="card-text">
                        {formatDate(article.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {error && (
            <div className="container text-danger fs-1">{`Error: ${error}`}</div>
          )}
        </>
      )}

      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
          <div className="modal-content">
            {selectedArticle && (
              <div>
                <div className="modal-header">
                  <h1 className="modal-title fs-5" id="exampleModalLabel">
                    {selectedArticle.title}
                  </h1>
                  <button
                    type="button"
                    className="btn-close btn btn-danger"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                    onClick={() => setSelectedArticle(null)}
                  ></button>
                </div>
                <div className="modal-body">{selectedArticle.description}</div>
                <div className="border-top d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-center">
                    <i
                      className={`fa-solid fa-heart fs-5 mt-1 ms-2 ${
                        isArticleLikedByUser(selectedArticle)
                          ? "text-danger"
                          : "text-secondary"
                      }`}
                      onClick={() => handleLikeToggle(selectedArticle)}
                    ></i>
                    <div className="d-flex" data-bs-dismiss="modal">
                      <span className="card-text text-primary me-2">
                        {selectedArticle.category.join(", ")}
                      </span>
                    </div>
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="card-text fw-semibold ms-2">
                      By: {selectedArticle.user.name}
                    </span>
                    <span className="card-text me-2 mb-2">
                      {formatDate(selectedArticle.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Search;
