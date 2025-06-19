import React, { useEffect, useState } from "react";
import fetchDecisionDetails from "../Libs/API/fetchDecisionDetails";
import "./DecisionCard.css";

const DecisionCard = ({ selectedInferenceId }) => {
  const [decisionData, setDecisionData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await fetchDecisionDetails(selectedInferenceId);
        setDecisionData(response.data);
      } catch (err) {
        setError("Failed to fetch decision details. Please try again later.");
      }
    };

    if (selectedInferenceId) {
      fetchDetails();
    }

    if (selectedInferenceId === ""){
      setDecisionData(null);
    }
  }, [selectedInferenceId]);

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  // if (!decisionData) {
  //   return <div className="loading-message">Loading decision details...</div>;
  // }

  const {
    agent = null,
    inference_id = null,
    order = {}, // Default to an empty object
    valid = [false, null],
  } = decisionData || {}; // Default to an empty object if decisionData is null or undefined
  
  const {
    amount,
    current_position_side,
    leverage,
    limit_entry_price,
    side,
    stop_loss_price,
    symbol,
    take_profit_price,
    time,
    confidence_score,
    rr,
    type,
  } = order;

  if (decisionData) {
    return (
      <div className="credit-card">
        <div className="credit-card-header">
          <h2 className={`side-${side ? side.toLowerCase() : "unknown"}`}>
            {symbol || "N/A"} - {side ? side.toUpperCase() : "UNKNOWN"}
          </h2>
          { side !== "hold" && (
          <span className={valid[0] ? "validation-valid" : "validation-invalid"}>
            { valid[0] ? "Valid" : "Invalid"}
          </span> )}
        </div>
      
        <div className="credit-card-body">
          <p className="inference-id"><strong>Inference ID:</strong> <span>{inference_id || "N/A"}</span></p>
          <p><strong>Order Type:</strong> <span>{type || "N/A"}</span></p>
          <p><strong>Leverage:</strong> <span>{leverage || "N/A"}</span></p>
          <p><strong>Limit Entry Price:</strong> <span>{limit_entry_price || "N/A"}</span></p>
          <p><strong>Stop Loss Price:</strong> <span>{stop_loss_price || "N/A"}</span></p>
          <p><strong>Take Profit Price:</strong> <span>{take_profit_price || "N/A"}</span></p>
          {side === "neutral" ? (
            <>
              <p><strong>Confidence Score:</strong> <span>N/A</span></p>
              <p><strong>Return on Risk:</strong> <span>N/A</span></p>
            </>
          ) : (
            <>
              <p><strong>Confidence Score:</strong> <span>{confidence_score || "N/A"}</span></p>
              <p><strong>Return on Risk:</strong> <span>{rr || "N/A"}</span></p>
            </>
          )}
        </div>
      
        {!valid[0] && side !== "hold" && (
          <div className="credit-card-footer">
            <p className="validation-error"><em>{valid[1]}</em></p>
          </div>
        )}
      </div>
    );
  }
};

export default DecisionCard;
