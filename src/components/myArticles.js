import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import ArticleContext from "../context/ArticleContext";

export const MyArticles = (props) => {
  const context = useContext(ArticleContext);
  const { deleteArticle } = context;
  let navigate = useNavigate();
  const { articles, getLoggedArticles, editArticle } = context;

  useEffect(() => {
    if (localStorage.getItem("token")) {
      getLoggedArticles();
    } else {
      navigate("/login");
    }
    // eslint-disable-next-line
  }, []);
  const ref = useRef(null);
  const refClose = useRef(null);

  const [article, setArticle] = useState({
    id: "",
    etitle: "",
    edescription: "",
    etags: [],
    ecategory: [],
  });

  const [inputTag, setInputTag] = useState("");

  const updateArticle = (currentArticle) => {
    ref.current.click();
    setArticle({
      id: currentArticle._id,
      etitle: currentArticle.title,
      edescription: currentArticle.description,
      etags: currentArticle.tags,
      ecategory: currentArticle.category,
    });
  };

  const handleSaveClick = () => {
    editArticle(
      article.id,
      article.etitle,
      article.edescription,
      article.etags,
      article.ecategory
    );
    refClose.current.click();
    setInputTag("");
    props.showAlert("Updated successfully", "success");
  };

  const onChange = (e) => {
    if (e.target.type === "checkbox") {
      const categoryName = e.target.name;
      if (e.target.checked) {
        setArticle((prevArticle) => ({
          ...prevArticle,
          ecategory: [...prevArticle.ecategory, categoryName],
        }));
      } else {
        setArticle((prevArticle) => ({
          ...prevArticle,
          ecategory: prevArticle.ecategory.filter(
            (cat) => cat !== categoryName
          ),
        }));
      }
    } else {
      setArticle({ ...article, [e.target.name]: e.target.value });
    }
  };

  const handleTagInputChange = (e) => {
    setInputTag(e.target.value);
  };

  const handleTagInputKeyDown = (e) => {
    if (e.key === "Enter" && inputTag) {
      const lowercaseTag = inputTag.toLowerCase();
      setArticle({
        ...article,
        etags: [...article.etags, lowercaseTag],
      });
      setInputTag("");
    }
  };

  const handleRemoveTag = (index) => {
    const updatedTags = [...article.etags];
    updatedTags.splice(index, 1);
    setArticle({ ...article, etags: updatedTags });
  };

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

  return (
    <>
      <div className="row my-3">
        <h2 className="text-primary text-decoration-underline">My Articles</h2>
        <div className="container text-danger fs-1 d-flex justify-content-center align-items-center mx-auto">
          {articles.length === 0 && "No articles to display!"}
        </div>
        {articles.map((article, index) => {
          return (
            <div
              key={article._id}
              className="col-my-3"
              style={{ width: "437px" }}
            >
              <div className="card my-3 border border-info-subtle">
                <div
                  className="card-body"
                  role="button"
                  onClick={() => {
                    updateArticle(article);
                  }}
                >
                  <h5 className="card-title">{article.title}</h5>
                  <p className="card-text">{truncatedDescriptions[index]}</p>
                  <span className="d-flex justify-content-end align-items-center card-text text-primary">
                    {article.category.join(", ")}
                  </span>
                  <span className="d-flex justify-content-end align-items-center card-text">
                    {formatDate(article.createdAt)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div
        className="modal fade"
        id="exampleModalToggle"
        aria-hidden="true"
        aria-labelledby="exampleModalToggleLabel"
        tabIndex="-1"
      >
        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalToggleLabel">
                {article.etitle}
              </h1>
              &nbsp;(
              <span className="card-text text-primary">
                {article.ecategory.join(", ")}
              </span>
              )
              <button
                type="button"
                className="btn-close btn btn-danger"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">{article.edescription}</div>
            <div className="modal-footer">
              <button
                className="btn btn-primary fw-semibold"
                data-bs-target="#exampleModalToggle2"
                data-bs-toggle="modal"
              >
                Edit Article
              </button>
            </div>
          </div>
        </div>
      </div>
      <div
        className="modal fade"
        id="exampleModalToggle2"
        aria-hidden="true"
        aria-labelledby="exampleModalToggleLabel2"
        tabIndex="-1"
      >
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalToggleLabel2">
                Edit Article
              </h1>
              <button
                type="button"
                className="btn-close btn btn-danger"
                data-bs-dismiss="modal"
                aria-label="Close"
                ref={refClose}
              ></button>
            </div>
            <div className="modal-body">
              <form className="my-3">
                <div className="mb-3">
                  <label htmlFor="title" className="form-label fw-semibold">
                    Title
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="etitle"
                    name="etitle"
                    value={article.etitle}
                    onChange={onChange}
                  />
                </div>
                <div className="mb-3">
                  <label
                    htmlFor="description"
                    className="form-label fw-semibold"
                  >
                    Description
                  </label>
                  <textarea
                    type="text"
                    className="form-control"
                    id="edescription"
                    name="edescription"
                    value={article.edescription}
                    onChange={onChange}
                    style={{ height: "15rem" }}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="etags" className="form-label fw-semibold">
                    Tags
                  </label>
                  <div className="d-flex align-items-center">
                    <input
                      type="text"
                      className="form-control w-25 me-2"
                      id="etags"
                      name="etags"
                      value={inputTag}
                      onChange={handleTagInputChange}
                      onKeyDown={handleTagInputKeyDown}
                    />
                    <div className="tags-list">
                      {article.etags.map((tag, index) => (
                        <button
                          key={index}
                          type="button"
                          className="tag-badge btn btn-primary btn-sm me-1 mt-1 fw-semibold"
                          onClick={() => handleRemoveTag(index)}
                        >
                          {tag}{" "}
                          <span className="badge badge-light">&times;</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="d-flex flex-column">
                  <label htmlFor="category" className="form-label fw-semibold">
                    Category
                  </label>
                  <div className="d-flex flex-wrap">
                    {[
                      "General",
                      "Business",
                      "Entertainment",
                      "Environment",
                      "History",
                      "Politics",
                      "Health",
                      "Sports",
                      "Science",
                      "Technology",
                    ].map((cat) => (
                      <div className="btn-group" key={cat}>
                        <input
                          type="checkbox"
                          className="btn-check"
                          id={`btn-check-${cat.toLowerCase()}`}
                          name={cat}
                          checked={article.ecategory.includes(cat)}
                          onChange={onChange}
                        />
                        <label
                          className="btn btn-outline-primary me-2 mt-1"
                          htmlFor={`btn-check-${cat.toLowerCase()}`}
                        >
                          {cat}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </form>
            </div>
            <div className="modal-footer d-flex justify-content-between">
              <i
                data-bs-dismiss="modal"
                className="far fa-trash-alt fs-5 mx-2 btn btn-danger"
                onClick={() => {
                  deleteArticle(article.id);
                  props.showAlert("Deleted successfully", "success");
                }}
              ></i>
              <button
                type="button"
                className="btn btn-primary fw-semibold"
                onClick={handleSaveClick}
              >
                Update Article
              </button>
            </div>
          </div>
        </div>
      </div>

      <button
        ref={ref}
        className="btn btn-primary d-none"
        data-bs-target="#exampleModalToggle"
        data-bs-toggle="modal"
      ></button>
    </>
  );
};

export default MyArticles;
