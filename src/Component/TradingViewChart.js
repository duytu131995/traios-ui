import React, { useEffect, useRef } from "react";

const TradingViewChart = ({ symbol }) => {
  const containerRef = useRef(null);

  // Function to transform the symbol for Binance and XAU/USD support
  const formatSymbol = (inputSymbol) => {
    if (inputSymbol === "XAU/USD" || inputSymbol === "XAUUSD" || inputSymbol === "XAU") {
      return "OANDA:XAUUSD"; // Sử dụng OANDA làm nguồn dữ liệu cho XAU/USD
    }

    return `BINANCE:${inputSymbol}USDT`; // Add "BINANCE" prefix and "USDT" suffix
  };

  const createWidget = (formattedSymbol) => {
    if (containerRef.current) {
      containerRef.current.innerHTML = ""; // Clear the container before creating a new widget

      new window.TradingView.widget({
        symbol: formattedSymbol, // Use the formatted Binance symbol
        container_id: containerRef.current.id,
        width: "100%",
        height: 500,
        theme: "light",
        interval: "D",
        timezone: "Etc/UTC",
        style: "1",
        locale: "en",
        toolbar_bg: "#f1f3f6",
        enable_publishing: false,
        withdateranges: true,
        hide_side_toolbar: false,
        studies: ["ATR@tv-basicstudies", "RSI@tv-basicstudies", "BB@tv-basicstudies"], // Default indicators
        // saved_timeframes: ["240", "480", "1D"],
        autosize: true,
      });
    }
  };

  useEffect(() => {
    const formattedSymbol = formatSymbol(symbol); // Transform the symbol for Binance
    if (!window.TradingView) {
      const script = document.createElement("script");
      script.src = "https://s3.tradingview.com/tv.js";
      script.onload = () => createWidget(formattedSymbol);
      document.body.appendChild(script);
    } else {
      createWidget(formattedSymbol);
    }
  }, [symbol]); // Recreate the widget whenever the symbol changes

  return <div id="tradingview_widget" ref={containerRef} className="tradingview-widget-container"></div>;
};

export default TradingViewChart;
