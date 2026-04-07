import { IconType } from "react-icons";
import {
  MdOutlinePayment,
  MdOutlineCategory,
  MdOutlineLocalShipping,
  MdOutlineVerified,
} from "react-icons/md";

interface FeatureItem {
  icon: IconType;
  title: string;
  description: string;
}

const features: FeatureItem[] = [
  {
    icon: MdOutlinePayment,
    title: "Secured Payments",
    description: "Make payment with ease",
  },
  {
    icon: MdOutlineCategory,
    title: "Shop for Anyone",
    description: "You can shop for any category",
  },
  {
    icon: MdOutlineLocalShipping,
    title: "Free Delivery",
    description: "Get 100% free delivery",
  },
  {
    icon: MdOutlineVerified,
    title: "Quality Products",
    description: "Made with highest care",
  },
];

const FeatureBanner: React.FC = () => {
  return (
    <div className="feature-banner border-top border-bottom py-3 bg-light">
      <div className="container">
        <div className="row justify-content-center align-items-center gy-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="col-6 col-md-3">
                <div className="d-flex align-items-center gap-3">
                  <div className="feature-icon flex-shrink-0">
                    <Icon size={32} className="text-dark" />
                  </div>
                  <div>
                    <p
                      className="mb-0 fw-semibold text-dark"
                      style={{ fontSize: "0.875rem" }}
                    >
                      {feature.title}
                    </p>
                    <p
                      className="mb-0 text-muted"
                      style={{ fontSize: "0.75rem" }}
                    >
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FeatureBanner;
