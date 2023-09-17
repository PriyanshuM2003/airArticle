import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = (props) => {
  const [credentials, setCredentials] = useState({
    name: "",
    email: "",
    password: "",
    cpassword: "",
  });
  let navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, cpassword } = credentials;
    const response = await fetch(`${process.env.REACT_APP_SERVER}/api/auth/createuser`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
      }),
    });

    const json = await response.json();
    if (json.success) {
      localStorage.setItem("token", json.authToken);
      props.showAlert("Account created successfully", "success");
      navigate("/addarticle");
    } else {
      props.showAlert("Invalid details", "danger");
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
            className="row d-flex justify-content-center align-items-center"
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
                  <label className="form-label fw-semibold" htmlFor="name">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    onChange={onChange}
                    id="name"
                    className="form-control form-control-lg"
                    placeholder="Enter your Name"
                    required
                  />
                </div>
                <div className="form-outline mb-4">
                  <label className="form-label fw-semibold" htmlFor="email">
                    Email address
                  </label>
                  <input
                    type="text"
                    name="email"
                    onChange={onChange}
                    id="email"
                    className="form-control form-control-lg"
                    placeholder="Enter your email address"
                    aria-describedby="emailHelp"
                    required
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
                    onChange={onChange}
                    className="form-control form-control-lg"
                    placeholder="Enter password"
                    minLength={8}
                    required
                  />
                </div>
                <label className="form-label fw-semibold" htmlFor="cpassword">
                  Confirm Password
                </label>
                <div className="form-outline mb-3">
                  <input
                    type="password"
                    id="cpassword"
                    name="cpassword"
                    className="form-control form-control-lg"
                    placeholder="Confirm password"
                    minLength={8}
                    required
                  />
                </div>
                <div className="text-center d-flex justify-content-center text-lg-start mt-4 pt-2">
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg fw-semibold"
                    style={{ paddingLeft: " 2.5rem", paddingRight: "2.5rem" }}
                  >
                    Signup
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

export default Signup;
