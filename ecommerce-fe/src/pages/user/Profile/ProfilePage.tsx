import { useState } from "react";
import {
  Card,
  Col,
  Container,
  Nav,
  NavItem,
  NavLink,
  Row,
} from "react-bootstrap";

import ChangePassword from "./components/ChangePasswordTab";
import MyAccount from "./components/MyAccount";

type ProfileTab = "account" | "password";

const ProfilePage = () => {
  const [tab, setTab] = useState<ProfileTab>("account");

  return (
    <div style={{ background: "#f6f8fb", minHeight: "100vh" }}>
      <Container className="py-5" style={{ maxWidth: 1000 }}>
        <Row className="mb-4">
          <Col>
            <h4 className="fw-bold mb-1">Pengaturan Akun</h4>
            <p className="text-muted mb-0">
              Kelola informasi akun dan keamanan Anda
            </p>
          </Col>
        </Row>

        <Card className="border-0 shadow-sm rounded-4">
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

          <Card.Body className="p-4 p-md-5 bg-white rounded-bottom-4">
            {tab === "account" && <MyAccount />}
            {tab === "password" && <ChangePassword />}
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default ProfilePage;
