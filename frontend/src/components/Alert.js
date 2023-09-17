// Alert.js
import React from "react";

function Alert({ alert }) {
  const capitalize = (word) => {
    if (word === "danger") {
      word = "error";
    }
    const lower = word.toLowerCase();
    return lower.charAt(0).toUpperCase() + lower.slice(1);
  };

  return (
    <div className="alert-container">
      {alert && (
        <div
          className={`alert alert-${alert.type} alert-dismissible fade show d-flex justify-content-center`}
          role="alert"
        >
          <strong>{capitalize(alert.type)}</strong>: {alert.msg}
        </div>
      )}
    </div>
  );
}

export default Alert;
