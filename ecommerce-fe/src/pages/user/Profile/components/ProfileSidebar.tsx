import { Image } from "react-bootstrap";
import { FaUser, FaLock, FaCalendarAlt, FaCheckCircle } from "react-icons/fa";
import { useAppSelector } from "@/hooks/redux";

interface ProfileSidebarProps {
  activeTab: "account" | "password";
  onTabChange: (tab: "account" | "password") => void;
}

const ProfileSidebar = ({ activeTab, onTabChange }: ProfileSidebarProps) => {
  const user = useAppSelector((state) => state.auth.user);

  if (!user) return null;

  const memberSince = user.created_at
    ? new Date(user.created_at).toLocaleDateString("id-ID", {
        year: "numeric",
        month: "long",
      })
    : "-";

  return (
    <div className="bg-white rounded-4 shadow-sm overflow-hidden" style={{ border: "1px solid #e9ecef" }}>
      {/* Profile Card Header */}
      <div
        className="text-center p-4 position-relative"
        style={{
          background: "linear-gradient(135deg, #00AA5B 0%, #00C96B 100%)",
        }}
      >
        {/* Decorative circles */}
        <div
          className="position-absolute rounded-circle"
          style={{
            width: 80,
            height: 80,
            background: "rgba(255,255,255,0.08)",
            top: -20,
            right: -10,
          }}
        />
        <div
          className="position-absolute rounded-circle"
          style={{
            width: 50,
            height: 50,
            background: "rgba(255,255,255,0.06)",
            bottom: 10,
            left: 15,
          }}
        />

        <div className="position-relative d-inline-block mb-3">
          <Image
            src={user.avatar || "/images/default-avatar.jpg"}
            width={90}
            height={90}
            roundedCircle
            style={{
              objectFit: "cover",
              border: "4px solid rgba(255,255,255,0.9)",
              boxShadow: "0 4px 15px rgba(0,0,0,0.15)",
            }}
          />
          {user.is_active && (
            <div
              className="position-absolute d-flex align-items-center justify-content-center"
              style={{
                bottom: 2,
                right: 2,
                width: 24,
                height: 24,
                background: "#fff",
                borderRadius: "50%",
                boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
              }}
            >
              <FaCheckCircle size={16} color="#00AA5B" />
            </div>
          )}
        </div>

        <h5 className="fw-bold text-white mb-1">{user.name}</h5>
        <p className="mb-0 small" style={{ color: "rgba(255,255,255,0.85)" }}>
          {user.email}
        </p>
      </div>

      {/* Info Section */}
      <div className="px-4 py-3 border-bottom" style={{ background: "#f8fdf9" }}>
        <div className="d-flex align-items-center gap-2 text-muted small">
          <FaCalendarAlt size={12} />
          <span>Member sejak {memberSince}</span>
        </div>
      </div>

      {/* Navigation */}
      <div className="p-3">
        <div
          onClick={() => onTabChange("account")}
          className={`d-flex align-items-center gap-3 p-3 rounded-3 mb-2 ${
            activeTab === "account"
              ? "text-success fw-semibold"
              : "text-muted"
          }`}
          style={{
            cursor: "pointer",
            background: activeTab === "account" ? "#e8f8ef" : "transparent",
            transition: "all 0.2s ease",
          }}
        >
          <div
            className="d-flex align-items-center justify-content-center rounded-circle"
            style={{
              width: 36,
              height: 36,
              background: activeTab === "account" ? "#00AA5B" : "#e9ecef",
              transition: "all 0.2s ease",
            }}
          >
            <FaUser
              size={14}
              color={activeTab === "account" ? "#fff" : "#6c757d"}
            />
          </div>
          <div>
            <div style={{ fontSize: 14 }}>Akun Saya</div>
            <div className="text-muted" style={{ fontSize: 11 }}>
              Edit profil & foto
            </div>
          </div>
        </div>

        <div
          onClick={() => onTabChange("password")}
          className={`d-flex align-items-center gap-3 p-3 rounded-3 ${
            activeTab === "password"
              ? "text-success fw-semibold"
              : "text-muted"
          }`}
          style={{
            cursor: "pointer",
            background: activeTab === "password" ? "#e8f8ef" : "transparent",
            transition: "all 0.2s ease",
          }}
        >
          <div
            className="d-flex align-items-center justify-content-center rounded-circle"
            style={{
              width: 36,
              height: 36,
              background: activeTab === "password" ? "#00AA5B" : "#e9ecef",
              transition: "all 0.2s ease",
            }}
          >
            <FaLock
              size={14}
              color={activeTab === "password" ? "#fff" : "#6c757d"}
            />
          </div>
          <div>
            <div style={{ fontSize: 14 }}>Ubah Sandi</div>
            <div className="text-muted" style={{ fontSize: 11 }}>
              Keamanan akun
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSidebar;
