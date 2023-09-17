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
      tags: [],
      category: [],
    },
    inputTag: "",
  });

  const { article, inputTag } = state;

  const isSaveDisabled =
    article.title.length < 1 ||
    article.description.length < 1 ||
    article.tags.length < 1 ||
    article.category.length < 1;

  const handleSaveClick = (e) => {
    e.preventDefault();
    addArticle(
      article.title,
      article.description,
      article.tags,
      article.category
    );
    setState({
      article: {
        title: "",
        description: "",
        tags: [],
        category: [],
      },
      inputTag: "",
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

  const handleTagInputChange = (e) => {
    setState({ ...state, inputTag: e.target.value });
  };

  const handleTagInputKeyDown = (e) => {
    if (e.key === "Enter" && inputTag) {
      const lowercaseTag = inputTag.toLowerCase();
      setState((prevState) => ({
        ...prevState,
        article: {
          ...prevState.article,
          tags: [...prevState.article.tags, lowercaseTag],
        },
        inputTag: "",
      }));
    }
  };

  const handleRemoveTag = (index) => {
    setState((prevState) => ({
      ...prevState,
      article: {
        ...prevState.article,
        tags: [
          ...prevState.article.tags.slice(0, index),
          ...prevState.article.tags.slice(index + 1),
        ],
      },
    }));
  };

  useEffect(() => {
    if (!localStorage.token) {
      navigate("/login");
    }
  }, []);

  return (
    <>
      <div className="container my-3">
        <div className="d-flex justify-content-between">
          <h2 className="d-flex align-items-center text-primary text-decoration-underline">
            Add Article
          </h2>
          <button
            disabled={isSaveDisabled}
            type="button"
            className="btn btn-primary d-inline-flex fs-5 fw-semibold px-4 align-items-center"
            onClick={handleSaveClick}
          >
            Save
          </button>
        </div>
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
              style={{ height: "14rem" }}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="tags" className="form-label fw-semibold">
              Tags
            </label>
            <div className="d-flex align-items-center">
              <input
                type="text"
                className="form-control w-25 me-2"
                id="tags"
                placeholder="Press Enter to add Tag"
                name="tags"
                value={inputTag}
                onChange={handleTagInputChange}
                onKeyDown={handleTagInputKeyDown}
              />
              <div className="tags-list">
                {article.tags.map((tag, index) => (
                  <button
                    key={index}
                    type="button"
                    className="tag-badge btn btn-primary btn-sm me-1 mt-1 fw-semibold"
                    onClick={() => handleRemoveTag(index)}
                  >
                    {tag} <span className="badge badge-light">&times;</span>
                  </button>
                ))}
              </div>
              {article.tags.length === 0 && (
                <p className="text-danger fw-bold">
                  /*Enter relevant Tags. These tags will be used for searching
                  your article.*/
                </p>
              )}
            </div>
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
      </div>
    </>
  );
};

export default AddArticle;
