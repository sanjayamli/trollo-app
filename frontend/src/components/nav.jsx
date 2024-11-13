import { Button } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { toast } from "react-toastify";
import { useLocation, Link } from "react-router-dom";

function Menu() {
  const isAuthenticated = localStorage.getItem("token");
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Signout");
    window.location.reload();
  };

  const isRegisterPage = location.pathname === "/register";

  return (
    <>
      <Navbar bg="primary" data-bs-theme="dark">
        <Container>
          <Navbar.Brand href="#">
            <svg
              className="svg-icon"
              style={{
                width: "1em",
                height: "1em",
                verticalAlign: "middle",
                fill: "currentColor",
                overflow: "hidden",
              }}
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M122.048 933.76L121.664 133.632h135.488v43.968c0 49.28 40.32 89.344 89.856 89.344h360.576a89.664 89.664 0 0 0 89.856-89.344v-43.968l135.04-0.32 0.448 800.064-810.88 0.384zM707.392 89.6l0.192 88.448-360.384-0.448V89.664l-0.192-0.448 360.384 0.448z m224.896-44.8h-147.456a89.6 89.6 0 0 0-77.248-44.48H347.008A89.6 89.6 0 0 0 269.76 44.8H121.6C72.128 44.8 32 84.48 32 133.312V933.76c0 48.768 40.256 88.512 89.664 88.512h811.264c49.472-0.064 89.6-39.68 89.664-88.512V133.312A89.472 89.472 0 0 0 932.352 44.8z"
                fill="#ffffff"
              />
              <path
                d="M281.344 416.384H543.36c19.2 0 32-12.8 32-32 0-19.072-12.8-31.872-32-31.872H281.344c-12.8 0-32 12.8-32 31.936s19.2 31.936 32 31.936zM281.344 799.36H479.36c19.2 0 32-12.736 32-31.872 0-19.2-12.8-31.936-32-31.936H281.344c-19.2 0-32 12.8-32 31.936 0 19.2 19.2 31.936 32 31.936zM281.344 607.872h453.76c19.2 0 32-12.8 32-31.936s-12.8-31.872-25.6-31.872h-460.16c-12.8 0-32 12.736-32 31.872 0 19.2 19.2 32 32 32z"
                fill="#ffffff"
              />
            </svg>
          </Navbar.Brand>

          <Nav className="me-end">
            {isAuthenticated ? (
              <Button onClick={handleLogout} className="text-white bg-danger">
                Sign Out
              </Button>
            ) : (
              <>
                <Link to="/login" className="text-decoration-none">
                  <Button
                    className={`${
                      isRegisterPage ? "text-white" : "text-primary bg-white"
                    } fw-semibold text-decoration-none py-2 rounded btn-sm`}
                  >
                    Login
                  </Button>
                </Link>
                <Link
                  to="/register"
                  className={`text-decoration-none mx-3 ${
                    isRegisterPage ? "text-primary" : "text-white"
                  }`}
                >
                  <Button
                    className={`${
                      isRegisterPage ? "bg-white text-primary" : "text-white"
                    }`}
                  >
                    SignUp
                  </Button>
                </Link>
              </>
            )}
          </Nav>
        </Container>
      </Navbar>
    </>
  );
}

export default Menu;
