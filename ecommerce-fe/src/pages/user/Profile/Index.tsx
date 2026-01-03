import React from "react";
import { Nav, NavItem, NavLink, Container, Row, Col } from "react-bootstrap";
import { Card, CardBody } from "reactstrap";
import MyAccount from "./components/MyAccount";
import ChangePassword from "./components/ChangePasswordTab";

type TTab = "account" | "password";

const ProfilePage = () => {
  const [tab, setTab] = React.useState<TTab>("account");

  return (
    <div style={{ background: "#f6f8fb", minHeight: "100vh" }}>
      <Container className="py-5" style={{ maxWidth: 1000 }}>
        {/* PAGE TITLE */}
        <Row className="mb-4">
          <Col>
            <h4 className="fw-bold mb-1">Pengaturan Akun</h4>
            <p className="text-muted mb-0">
              Kelola informasi akun dan keamanan Anda
            </p>
          </Col>
        </Row>

        {/* CARD */}
        <Card className="border-0 shadow-sm rounded-4">
          {/* TAB HEADER */}
          <div className="px-4 pt-4 border-bottom bg-white rounded-top-4">
            <Nav className="gap-4">
              <NavItem>
                <NavLink
                  onClick={() => setTab("account")}
                  className={`px-0 pb-3 fw-semibold ${
                    tab === "account"
                      ? "border-bottom border-3 border-success text-success"
                      : "text-muted"
                  }`}
                  style={{ cursor: "pointer" }}
                >
                  Akun Saya
                </NavLink>
              </NavItem>

              <NavItem>
                <NavLink
                  onClick={() => setTab("password")}
                  className={`px-0 pb-3 fw-semibold ${
                    tab === "password"
                      ? "border-bottom border-3 border-success text-success"
                      : "text-muted"
                  }`}
                  style={{ cursor: "pointer" }}
                >
                  Ubah Sandi
                </NavLink>
              </NavItem>
            </Nav>
          </div>

          {/* CONTENT */}
          <CardBody className="p-4 p-md-5 bg-white rounded-bottom-4">
            {tab === "account" && <MyAccount />}
            {tab === "password" && <ChangePassword />}
          </CardBody>
        </Card>
      </Container>
    </div>
  );
};

export default ProfilePage;
