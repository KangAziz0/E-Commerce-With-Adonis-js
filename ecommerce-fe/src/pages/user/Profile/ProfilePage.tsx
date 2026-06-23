import { useState } from "react";
import { Col, Container, Nav, NavItem, NavLink, Row } from "react-bootstrap";
import {
  FaUser,
  FaLock,
  FaShieldAlt,
} from "react-icons/fa";

import ChangePassword from "./components/ChangePasswordTab";
import MyAccount from "./components/MyAccount";
import ProfileSidebar from "./components/ProfileSidebar";

type ProfileTab = "account" | "password";

const ProfilePage = () => {
  const [tab, setTab] = useState<ProfileTab>("account");

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #f5f7fa 0%, #e4e9f2 100%)",
        minHeight: "100vh",
      }}
    >
      <Container className="py-4 py-md-5" style={{ maxWidth: 1100 }}>
        {/* Page Header */}
        <Row className="mb-4">
          <Col>
            <div className="d-flex align-items-center gap-3 mb-1">
              <div
                className="d-flex align-items-center justify-content-center rounded-circle"
                style={{
                  width: 42,
                  height: 42,
                  background: "linear-gradient(135deg, #00AA5B, #00C96B)",
                }}
              >
                <FaShieldAlt size={18} color="#fff" />
              </div>
              <div>
                <h4 className="fw-bold mb-0" style={{ color: "#1a1a2e" }}>
                  Pengaturan Akun
                </h4>
                <p className="text-muted mb-0 small">
                  Kelola informasi profil dan keamanan akun Anda
                </p>
              </div>
            </div>
          </Col>
        </Row>

        <Row className="g-4">
          {/* Sidebar */}
          <Col xs={12} lg={4}>
            <ProfileSidebar activeTab={tab} onTabChange={setTab} />
          </Col>

          {/* Main Content */}
          <Col xs={12} lg={8}>
            <div
              className="bg-white rounded-4 shadow-sm overflow-hidden"
              style={{ border: "1px solid #e9ecef" }}
            >
              {/* Tab Navigation */}
              <div className="px-4 pt-3 border-bottom" style={{ background: "#fafbfc" }}>
                <Nav className="gap-3">
                  <NavItem>
                    <NavLink
                      onClick={() => setTab("account")}
                      className={`d-flex align-items-center gap-2 px-3 pb-3 fw-semibold border-0 ${
                        tab === "account"
                          ? "border-bottom border-3 border-success text-success"
                          : "text-muted"
                      }`}
                      style={{ cursor: "pointer", transition: "all 0.2s" }}
                    >
                      <FaUser size={14} />
                      Akun Saya
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      onClick={() => setTab("password")}
                      className={`d-flex align-items-center gap-2 px-3 pb-3 fw-semibold border-0 ${
                        tab === "password"
                          ? "border-bottom border-3 border-success text-success"
                          : "text-muted"
                      }`}
                      style={{ cursor: "pointer", transition: "all 0.2s" }}
                    >
                      <FaLock size={14} />
                      Ubah Sandi
                    </NavLink>
                  </NavItem>
                </Nav>
              </div>

              {/* Tab Content */}
              <div className="p-4 p-md-5">
                {tab === "account" && <MyAccount />}
                {tab === "password" && <ChangePassword />}
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ProfilePage;
