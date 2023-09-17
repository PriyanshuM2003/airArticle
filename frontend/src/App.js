import "./App.css";
import { Navbar } from "./components/Navbar";
import { Home } from "./components/Home";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ArticleState from "./context/ArticleState";
import Alert from "./components/Alert";
import Login from "./components/Login";
import Signup from "./components/Signup";
import { useState } from "react";
import MyArticles from "./components/myArticles";
import AddArticle from "./components/addArticle";
import Category from "./components/Category";
import Search from "./components/Search";

function App() {
  const [alert, setAlert] = useState(null);

  const showAlert = (message, type) => {
    setAlert({
      msg: message,
      type: type,
    });
    setTimeout(() => {
      setAlert(null);
    }, 1500);
  };

  return (
    <>
      <ArticleState>
        <Router>
          <Navbar />
          <Alert alert={alert} />
          <div className="container">
            <Routes>
              <Route exact path="/" element={<Home showAlert={showAlert} />} />
              <Route
                exact
                path="/category"
                element={<Category showAlert={showAlert} />}
              />
              <Route
                path="/search/:query"
                element={<Search showAlert={showAlert} />}
              />
              <Route
                exact
                path="/login"
                element={<Login showAlert={showAlert} />}
              />
              <Route
                exact
                path="/signup"
                element={<Signup showAlert={showAlert} />}
              />
              <Route
                exact
                path="/myarticles"
                element={<MyArticles showAlert={showAlert} />}
              />
              <Route
                exact
                path="/addarticle"
                element={<AddArticle showAlert={showAlert} />}
              />
            </Routes>
          </div>
        </Router>
      </ArticleState>
    </>
  );
}

export default App;
