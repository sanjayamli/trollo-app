import React, { useState } from "react";
import { toast } from "react-toastify";
import api from "../services/api";
import Menu from "../components/nav.jsx";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { Button } from "react-bootstrap";
import GoogleLoginButton from "../components/googleLogin/googleAuth.jsx";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/users/login", { email, password });
      localStorage.setItem("token", response.data.token);
      window.location.href = "/tasks";
    } catch (error) {
      toast.error("Login failed. Please check your credentials.",error);
    }
  };

  return (
    <>
      <Menu />
      <div className="d-flex justify-content-center align-items-center mt-5">
  <div className="col-md-6 col-lg-5"> 
    <h3 className="fw-bold text-primary text-center">Login</h3>
    <div className="border border-primary px-5 py-5 rounded border-3">
      <form onSubmit={handleLogin}>
        <Form.Group className="mb-3" controlId="formEmail">
          <Form.Control
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
        </Form.Group>
        <Form.Group as={Row} className="mb-3" controlId="formPassword">
          <Col>
            <Form.Control
              className="w-100"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Password"
              required
            />
          </Col>
        </Form.Group>
        <Button
          type="submit"
          variant="primary"
          className="btn-md w-100 mb-3"
          style={{ borderRadius: '0' }}
        >
                <a href="/register" className="text-decoration-none text-white">Login</a>
        </Button>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <span>{`Don't have an account?`}</span>
          <a href="/register" className="text-decoration-none font-">Signup</a>
        </div>

          {/* <span>Login with Google</span> */}
          <GoogleLoginButton />

      </form>
    </div>
  </div>
</div>

    </>
  );
};

export default Login;
