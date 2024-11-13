import { useState } from "react";
import { toast } from "react-toastify";
import api from "../services/api";
import Menu from "../components/nav.jsx";
import { Button } from "react-bootstrap";
import GoogleLoginButton from "../components/googleLogin/googleAuth.jsx";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      await api.post("/users/register", {
        name,
        email,
        password,
      });

      window.location.href = "/login";
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Registration failed. Ensure validation.");
      }
    }
  };

  return (
    <>
      <Menu />
      <div className="d-flex justify-content-center align-items-center mt-5">
        <div className="col-md-6 col-lg-5">
          <h3 className="fw-bold text-primary text-center">Sign Up</h3>
          <div className="border border-primary px-5 py-5 rounded border-3">
            <form onSubmit={handleRegister}>
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <input
                  type="email"
                  className="form-control"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <input
                  type="password"
                  className="form-control"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <input
                  type="password"
                  className="form-control"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <Button
                type="submit"
                variant="primary"
                className="btn-md w-100 mb-3"
                style={{ borderRadius: "0" }}
              >
                Sign Up
              </Button>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span>Already have an account?</span>
                <a href="/login" className="text-decoration-none">
                  Login
                </a>
              </div>
              <GoogleLoginButton />
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
