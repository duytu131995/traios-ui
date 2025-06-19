import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function LanguageSwitcher() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const currentPath = location.pathname;
  const availableLangs = ["en", "vi"];

  const handleLangChange = (newLang) => {
    const pathParts = currentPath.split("/");
    if (pathParts[1]) {
      pathParts[1] = newLang; // Replace the language in the URL
    } else {
      pathParts.splice(1, 0, newLang); // Insert the language if it's missing
    }
    const newPath = pathParts.join("/");
    navigate(newPath); // Update the URL
    setIsDropdownOpen(false); // Close the dropdown
  };

  return (
    <div style={{ position: "relative" }}>
      {/* Icon Button */}
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        style={iconButtonStyles}
        title="Switch Language"
      >
        <i className="fas fa-globe" style={iconStyles}></i> {/* Replace 🌐 */}
      </button>

      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <ul style={dropdownStyles}>
          {availableLangs.map((lang) => (
            <li
              key={lang}
              onClick={() => handleLangChange(lang)}
              style={dropdownItemStyles}
            >
              {lang === "en" ? "English" : "Tiếng Việt"}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

const iconButtonStyles = {
  fontSize: "24px",
  background: "none",
  border: "none",
  cursor: "pointer",
  color: "#333",
  position: "relative",
};

const iconStyles = {
  fontSize: "24px",
  color: "#333", // Icon color
};

const dropdownStyles = {
  position: "absolute",
  top: "40px",
  right: "0px",
  background: "#fff",
  border: "1px solid #ccc",
  borderRadius: "5px",
  boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
  listStyle: "none",
  margin: 0,
  padding: "10px 0",
  zIndex: 1000,
  width: "150px",
};

const dropdownItemStyles = {
  padding: "8px 15px",
  cursor: "pointer",
  color: "#333",
  textAlign: "right",
  fontSize: "14px",
  background: "transparent",
  borderBottom: "1px solid #eee",
};

export default LanguageSwitcher;
