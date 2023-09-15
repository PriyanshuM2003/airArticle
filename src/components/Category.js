import React, { useContext, useEffect, useState } from "react";
import ArticleContext from "../context/ArticleContext";
import { useLocation } from "react-router-dom";

const Category = () => {
  const context = useContext(ArticleContext);
  const { getAllArticles, articles } = context;
  const location = useLocation();

  const selectedCategory =
    new URLSearchParams(location.search).get("category") || "";

  useEffect(() => {
    getAllArticles(selectedCategory || undefined);
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

  const [selectedArticle, setSelectedArticle] = useState(null);

  const openModal = (article) => {
    setSelectedArticle(article);
  };
  return (
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
                  data-bs-toggle="modal"
                  data-bs-target="#exampleModal"
                  onClick={() => openModal(article)}
                >
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="card-title">{article.title}</h5>
                    {article.category.includes(selectedCategory) && (
                      <span className="card-text text-primary">
                        {selectedCategory}
                      </span>
                    )}
                  </div>
                  <p className="card-text">{truncatedDescriptions[index]}</p>
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

export default Category;
