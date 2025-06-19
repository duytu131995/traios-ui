import axiosInstance from "../../config/axios";
import appConfig from "../../appConfig";

const fetchDetailForDatenAsset = async (date, asset, lang) => {
  try {
    const dateOnly = date.split(" ")[0];
    const response = await axiosInstance.get(`${appConfig.API_BASE_URL}/inference/get_inferences?date=${dateOnly}&asset=${asset}&lang=${lang}`);

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

export default fetchDetailForDatenAsset;
