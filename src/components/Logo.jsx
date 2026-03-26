import logoSvg from "../assets/logo.svg";

const Logo = ({ size = 40, showText = true }) => (
  <div style={{ display: "flex", alignItems: "center" }}>
    <img
      src={logoSvg}
      alt="TableTap"
      style={{
        height: showText ? size * 1.4 : size * 1.8,
        width: "auto",
        display: "block"
      }}
    />
  </div>
);

export default Logo;
