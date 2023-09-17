import React, { useContext, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import ArticleContext from "../context/ArticleContext";

const categories = [
  { name: "General", link: "/category/?category=General" },
  { name: "Business", link: "/category/?category=Business" },
  { name: "Entertainment", link: "/category/?category=Entertainment" },
  { name: "Health", link: "/category/?category=Health" },
  { name: "Sports", link: "/category/?category=Sports" },
  { name: "Science", link: "/category/?category=Science" },
  { name: "Technology", link: "/category/?category=Technology" },
];

export const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTags, setSearchTags] = useState("");
  const context = useContext(ArticleContext);
  const { searchArticlesByTags } = context;

  const selectedCategory =
    new URLSearchParams(location.search).get("category") || "";

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (searchTags) {
      try {
        const data = await searchArticlesByTags(searchTags.toLowerCase());
        navigate(`/search/tags=${searchTags.toLowerCase()}`);
        setSearchTags("");
      } catch (error) {
        console.error("Error searching articles:", error.message);
      }
    }
  };

  const renderCategories = () => {
    return categories.map((category) => (
      <li className="category nav-item fw-semibold" key={category.name}>
        <Link
          className={`nav-link ${
            selectedCategory === category.name ? "active" : ""
          }`}
          to={category.link}
        >
          {category.name}
        </Link>
      </li>
    ));
  };

  return (
    <>
      <nav
        className="navbar sticky navbar-expand-lg navbar-light"
        style={{ backgroundColor: "#40adfa" }}
      >
        <div className="container-fluid">
          <Link className="navbar-brand fs-3" to="/">
            <strong>airArticle</strong>
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarText"
            aria-controls="navbarText"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarText">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item fw-semibold">
                <Link
                  className={`nav-link ${
                    location.pathname === "/" ? "active" : ""
                  }`}
                  aria-current="page"
                  to="/"
                >
                  Home
                </Link>
              </li>
              {renderCategories()}
              <ul className="navbar-nav">
                <li className="nav-item dropdown">
                  <button
                    className="btn dropdown-toggle nav-link fw-semibold"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    Humanities
                  </button>
                  <ul className="dropdown-menu">
                    <li className="category nav-item fw-semibold">
                      <Link
                        className={`nav-link dropdown-item ${
                          selectedCategory === "Environment" ? "active" : ""
                        }`}
                        to="/category/?category=Environment"
                      >
                        Environment
                      </Link>
                    </li>
                    <li className="category nav-item fw-semibold">
                      <Link
                        className={`nav-link dropdown-item ${
                          selectedCategory === "History" ? "active" : ""
                        }`}
                        to="/category/?category=History"
                      >
                        History
                      </Link>
                    </li>
                    <li className="category nav-item fw-semibold">
                      <Link
                        className={`nav-link dropdown-item ${
                          selectedCategory === "Politics" ? "active" : ""
                        }`}
                        to="/category/?category=Politics"
                      >
                        Politics
                      </Link>
                    </li>
                  </ul>
                </li>
              </ul>
              {!localStorage.getItem("token") ? (
                <></>
              ) : (
                <>
                  <li className="nav-item fw-bold">
                    <Link
                      className={`nav-link ${
                        location.pathname === "/addarticle" ? "active" : ""
                      }`}
                      aria-current="page"
                      to="/addarticle"
                    >
                      Add Article
                    </Link>
                  </li>
                  <li className="nav-item fw-bold">
                    <Link
                      className={`nav-link ${
                        location.pathname === "/myarticles" ? "active" : ""
                      }`}
                      aria-current="page"
                      to="/myarticles"
                    >
                      My Articles
                    </Link>
                  </li>
                </>
              )}
            </ul>
            <form className="d-flex me-2" onSubmit={handleSubmit}>
              <input
                className="form-control me-2"
                type="text"
                placeholder="Search"
                aria-label="Search"
                value={searchTags}
                onChange={(e) => setSearchTags(e.target.value)}
              />
              <button className="btn btn-success fw-semibold" type="submit">
                Search
              </button>
            </form>
            {!localStorage.getItem("token") ? (
              <form className="d-flex">
                <Link
                  className="btn btn-danger mx-1 fw-semibold"
                  to="/login"
                  role="button"
                >
                  Login
                </Link>
                <Link
                  className="btn btn-danger mx-1 fw-semibold"
                  to="/signup"
                  role="button"
                >
                  Signup
                </Link>
              </form>
            ) : (
              <button
                onClick={handleLogout}
                className="btn btn-danger fw-semibold"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
