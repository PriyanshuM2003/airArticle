import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = (props) => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  let navigate = useNavigate();
  const SERVER = process.env.REACT_APP_SERVER;
  console.log("server", SERVER);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(`${process.env.REACT_APP_SERVER}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password,
      }),
    });
    const json = await response.json();
    if (json.success) {
      //* saving auth token and redirecting
      localStorage.setItem("token", json.authToken);
      props.showAlert("Logged in successfully", "success");
      navigate("/addarticle");
    } else {
      props.showAlert("Invalid Credentials", "danger");
    }
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/addarticle");
    }
  }, []);

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  return (
    <>
      <section>
        <div className="container-fluid h-custom">
          <div
            className="row d-flex justify-content-center align-items-center mx-auto"
            style={{ minHeight: "90vh" }}
          >
            <div className="col-md-9 col-lg-6 col-xl-5">
              <img
                src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
                className="img-fluid"
                alt="Sample image"
              />
            </div>
            <div className="col-md-8 col-lg-6 col-xl-4 offset-xl-1">
              <form onSubmit={handleSubmit}>
                <div className="form-outline mb-4">
                  <label className="form-label fw-semibold" htmlFor="email">
                    Email address
                  </label>
                  <input
                    type="email"
                    value={credentials.email}
                    name="email"
                    onChange={onChange}
                    id="email"
                    className="form-control form-control-lg"
                    placeholder="Enter your email address"
                    aria-describedby="emailHelp"
                  />
                </div>
                <label className="form-label fw-semibold" htmlFor="password">
                  Password
                </label>
                <div className="form-outline mb-3">
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={credentials.password}
                    onChange={onChange}
                    className="form-control form-control-lg"
                    placeholder="Enter password"
                  />
                </div>
                <div className="text-center d-flex justify-content-center text-lg-start mt-4 pt-2">
                  <button
                    type="submit"
                    onSubmit={handleSubmit}
                    className="btn btn-primary btn-lg fw-semibold"
                    style={{ paddingLeft: " 2.5rem", paddingRight: "2.5rem" }}
                  >
                    Login
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Login;
