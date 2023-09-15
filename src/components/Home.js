import React, { useContext, useEffect, useState } from "react";
import ArticleContext from "../context/ArticleContext";

export const Home = () => {
  const context = useContext(ArticleContext);
  const { getAllArticles, articles } = context;

  useEffect(() => {
    getAllArticles();
  }, [getAllArticles]);

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

  const [selectedArticle, setSelectedArticle] = useState(null);

  const openModal = (article) => {
    setSelectedArticle(article);
  };

  return (
    <>
      <div className="row my-3">
        <div className="container text-danger fs-1 d-flex justify-content-center align-items-center mx-auto">
          {articles.length === 0 && "No articles to display!"}
        </div>
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
                  data-bs-toggle="modal"
                  data-bs-target="#exampleModal"
                  onClick={() => openModal(article)}
                >
                  <h5 className="card-title">{article.title}</h5>
                  <p className="card-text">{truncatedDescriptions[index]}</p>
                  <span className="card-text text-primary d-flex justify-content-end align-items-center">
                    {article.category.join(", ")}
                  </span>
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
                  <span className="card-text text-primary d-flex justify-content-end align-items-center">
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

export default Home;
