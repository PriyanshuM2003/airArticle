import React, { useContext, useEffect, useState } from "react";
import ArticleContext from "../context/ArticleContext";
import { useNavigate } from "react-router-dom";

const AddArticle = ({ showAlert }) => {
  const { addArticle } = useContext(ArticleContext);
  const navigate = useNavigate();

  const [state, setState] = useState({
    article: {
      title: "",
      description: "",
      category: [],
    },
  });

  const { article } = state;

  const isSaveDisabled =
    article.title.length < 1 ||
    article.description.length < 1 ||
    article.category.length < 1;

  const handleSaveClick = (e) => {
    e.preventDefault();
    addArticle(article.title, article.description, article.category);
    setState({
      article: {
        title: "",
        description: "",
        category: [],
      },
    });
    showAlert("Added successfully", "success");
  };

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      const categoryName = name;
      setState((prevState) => ({
        ...prevState,
        article: {
          ...prevState.article,
          category: checked
            ? [...prevState.article.category, categoryName]
            : prevState.article.category.filter((cat) => cat !== categoryName),
        },
      }));
    } else {
      setState((prevState) => ({
        ...prevState,
        article: {
          ...prevState.article,
          [name]: value,
        },
      }));
    }
  };

  useEffect(() => {
    if (!localStorage.token) {
      navigate("/login");
    }
  }, []);

  return (
    <>
      <div className="container my-3">
        <h2 className="text-primary d-flex justify-content-center align-items-center text-decoration-underline">Add Article</h2>
        <form className="my-3">
          <div className="mb-3">
            <label htmlFor="title" className="form-label fw-semibold">
              Title
            </label>
            <input
              type="text"
              className="form-control"
              id="title"
              name="title"
              value={article.title}
              onChange={onChange}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="description" className="form-label fw-semibold">
              Description
            </label>
            <textarea
              type="text"
              className="form-control"
              id="description"
              name="description"
              value={article.description}
              onChange={onChange}
              style={{ height: "20rem" }}
            />
          </div>
          <div className="d-flex flex-column">
            <label htmlFor="category" className="form-label fw-semibold">
              Category
            </label>
            <div className="d-flex">
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
                    checked={article.category.includes(cat)}
                    onChange={onChange}
                  />
                  <label
                    className="btn btn-outline-primary me-2"
                    htmlFor={`btn-check-${cat.toLowerCase()}`}
                  >
                    {cat}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </form>
        <div className="d-flex mt-4 justify-content-center align-items-center">
          <button
            disabled={isSaveDisabled}
            type="button"
            className="btn btn-primary fs-5 fw-semibold px-4"
            onClick={handleSaveClick}
          >
            Save
          </button>
        </div>
      </div>
    </>
  );
};

export default AddArticle;
