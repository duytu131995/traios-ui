import axiosInstance from "../../config/axios";
import appConfig from "../../appConfig";

const fetchSentimentDetail = async (selectedInferenceId) => {
  const lang = localStorage.getItem('preferredLanguage') || 'en';

  try {
    const response = await axiosInstance.get(`${appConfig.API_BASE_URL}/inference/get_sentiment_detail?inference_id=${selectedInferenceId}&lang=${lang}`);

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

export default fetchSentimentDetail;