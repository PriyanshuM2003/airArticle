import React, { useContext, useEffect, useState } from "react";
import ArticleContext from "../context/ArticleContext";
import { useLocation } from "react-router-dom";

const Category = (props) => {
  const context = useContext(ArticleContext);
  const { getAllArticles, articles, toggleLike, fetchLikeState } = context;
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userToken = localStorage.getItem("token");
  const location = useLocation();
  const [fetching, setFetching] = useState(true);

  const selectedCategory =
    new URLSearchParams(location.search).get("category") || "";

  useEffect(() => {
    setLoading(true);
    getAllArticles(selectedCategory || undefined)
      .then(() => {
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, [selectedCategory]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (userToken && fetching) {
        fetchLikeState();
        setFetching(false);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [fetchLikeState, userToken, fetching]);

  useEffect(() => {
    setFetching(true);
  }, [selectedCategory]);

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

  const handleLikeToggle = async (article) => {
    if (!userToken) {
      props.showAlert("Please Login/Signup to Like the Article", "warning");
      return;
    }

    await toggleLike(article._id);
    fetchLikeState();
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
            {articles.length === 0 && (
              <div className="container text-danger fs-1 d-flex justify-content-center align-items-center mx-auto">
                No articles to display!
              </div>
            )}
            {articles.length !== 0 &&
              articles.some((article) =>
                article.category.includes(selectedCategory)
              ) && (
                <div className="container d-flex justify-content-center align-items-center mx-auto">
                  <h3 className=" align-items-center text-danger text-decoration-underline">
                    Showing Articles of&nbsp;
                    <span className="text-primary">{selectedCategory}</span>
                    &nbsp;Category
                  </h3>
                </div>
              )}
            {articles && articles.length > 0 ? (
              articles.map((article, index) => (
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
                            article.liked ? "text-danger" : "text-secondary"
                          }`}
                          onClick={() => handleLikeToggle(article)}
                        ></i>
                        <div className="d-flex">
                          {article.category.includes(selectedCategory) && (
                            <span className="card-text text-primary">
                              {selectedCategory}
                            </span>
                          )}
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
              ))
            ) : (
              <></>
            )}
          </div>
          {error && (
            <div className="container text-danger fs-1">{`Error: ${error.message}`}</div>
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
                        selectedArticle.liked ? "text-danger" : "text-secondary"
                      }`}
                      onClick={() => handleLikeToggle(selectedArticle)}
                    ></i>
                    <div className="d-flex" data-bs-dismiss="modal">
                      {selectedArticle.category.includes(selectedCategory) && (
                        <span className="card-text text-primary me-2">
                          {selectedCategory}
                        </span>
                      )}
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

export default Category;
