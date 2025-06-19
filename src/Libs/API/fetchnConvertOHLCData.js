import axiosInstance from "../../config/axios";

const fetchnConvertOHLCData = async (symbol, start, end, period, selectedTimeframe) => {
  const FLASH_SHARE_API = "https://cicada-poetic-narwhal.ngrok-free.app";

  // Format start and end dates if necessary
  const formattedStart = start.replace("T", " ");
  const formattedEnd = end.replace("T", " ");

  try {
    const response = await axiosInstance.get(`${FLASH_SHARE_API}/prices/get_ohclv_data`, {
      params: {
        symbol: symbol.toUpperCase(), // Symbol in uppercase (e.g., BTC/USDT)
        start: formattedStart,        // Start date
        end: formattedEnd,            // End date
        period: period,               // Period to subtract
        timeframe: selectedTimeframe
      },
    });

    if (response.status === 200) {
      // Map response data into the desired structure
      const data = response.data.map((item) => ({
        open: item.o,
        high: item.h,
        low: item.l,
        close: item.c,
        volume: item.volume,
        tick: new Date(item.tick), // Convert tick to Date object
      }));

      return data; // Return the formatted data
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

export default fetchnConvertOHLCData;
