import React from "react";

const InferenceSelect = ({ data, selectedValue, onOptionSelect }) => {
    const handleChange = (event) => {
      const selectedId = event.target.value;
      onOptionSelect(selectedId); // Trigger the handler when an option is selected
    };
  
    // Check if data is valid and non-empty
    const isDataValid = Array.isArray(data) && data.length > 0;
  
    return (
      <select
        value={selectedValue}
        onChange={handleChange}
        disabled={!isDataValid} // Disable the select if data is invalid
        className="select-box"
      >
        <option value="">
          {isDataValid ? "Select Decision" : "No Options Available"}
        </option>
        {isDataValid &&
          [...data]
            .sort((a, b) => {
              const dateA = new Date(a.inference_id.split('_')[1]); // Extract and parse the timestamp
              const dateB = new Date(b.inference_id.split('_')[1]);
              return dateB - dateA; // Sort in descending order
            })
            .map((item) => (
              <option key={item.inference_id} value={item.inference_id}>
                {item.inference_id}
              </option>
            ))}
      </select>
    );
};

export default InferenceSelect;
