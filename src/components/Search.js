import React, { useContext, useEffect, useState } from "react";
import ArticleContext from "../context/ArticleContext";
import { useParams } from "react-router-dom";

const Search = () => {
  const { query } = useParams();
  const context = useContext(ArticleContext);
  const { articles, searchArticlesByTags } = context;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedArticle, setSelectedArticle] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    const fetchArticles = async () => {
      try {
        await searchArticlesByTags(query);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (query) {
      fetchArticles();
    } else {
      setLoading(false);
    }
  }, [query, searchArticlesByTags]);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const openModal = (article) => {
    setSelectedArticle(article);
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
                  Showing most relevant Results
                </h3>
              </div>
            )}
            {articles.map((article) => (
              <div
                key={article._id}
                className="col-my-3"
                style={{ width: "437px" }}
              >
                <div className="card my-3 border border-info-subtle">
                  <div
                    className="card-body"
                    role="button"
                    data-bs-toggle="modal"
                    data-bs-target="#exampleModal"
                    onClick={() => openModal(article)}
                  >
                    <div className="d-flex justify-content-between align-items-center">
                      <h5 className="card-title">{article.title}</h5>
                      <span className="card-text text-primary">
                        {article.category.join(", ")}
                      </span>
                    </div>
                    <p className="card-text">
                      {article.description && article.description.length > 54
                        ? article.description
                            .split(" ")
                            .slice(0, 54)
                            .join(" ") +
                          (
                            <span className="text-danger fw-semibold">
                              ...more
                            </span>
                          )
                        : article.description}
                    </p>
                    <div className="d-flex justify-content-between">
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
                  &nbsp;(
                  <span className="card-text text-primary">
                    {selectedArticle.category.join(", ")}
                  </span>
                  )
                  <button
                    type="button"
                    className="btn-close btn btn-danger"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                    onClick={() => setSelectedArticle(null)}
                  ></button>
                </div>
                <div className="modal-body">{selectedArticle.description}</div>
                <div className="modal-footer d-flex justify-content-between align-items-center">
                  <span className="card-text fw-semibold">
                    By: {selectedArticle.user.name}
                  </span>
                  <span className="card-text">
                    At: {formatDate(selectedArticle.createdAt)}
                  </span>
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
