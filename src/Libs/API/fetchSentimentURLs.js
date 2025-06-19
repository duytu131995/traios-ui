import axiosInstance from "../../config/axios";
import appConfig from "../../appConfig";

const fetchSentimentURLs = async (selectedInferenceId) => {
  try {
    const data = JSON.stringify({
        inference_id: selectedInferenceId,
      });
  
      const response = await axiosInstance.post(`${appConfig.API_BASE_URL}/inference/get_infer_url_history`, data);

    if (response.status === 200) {
      return response; // Return the formatted data
    } else {
      console.error(`Error: Received status code ${response.status}`);
      console.error(response.data);
      return [];
    }
  } catch (error) {
    console.error("An error occurred while fetching OHLC data:", error);
    return [];
  }
};

export default fetchSentimentURLs;