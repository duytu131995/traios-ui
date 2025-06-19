import React, { useState, useEffect } from "react";
import ReactGA from 'react-ga4';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // Import DatePicker styles
import { format } from "date-fns";

import ReactMarkdown from "react-markdown";
import remarkGfm from 'remark-gfm';
import { useNavigate, useParams, useLocation, Link } from 'react-router-dom';
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import "../App.css";
import fetchnConvertOHLCData from "../Libs/API/fetchnConvertOHLCData";
import fetchDetailForDatenAsset from "../Libs/API/fetchDetailForDatenAsset";
import fetchSentimentURLs from "../Libs/API/fetchSentimentURLs";
import fetchSentimentDetail from "../Libs/API/fetchSentimentDetail";

import InferenceSelect from "./InferenceSelect";
import DecisionCard from "./DecisionCard";
import TradingViewChart from "./TradingViewChart";
import LanguageSwitcher from "./LanguageSwitcher"; 
import Chat from "./Chat";

const TradingBoard = () => {
  const [ohlcData, setOhlcData] = useState([]);
  const [sentiment, setSentiment] = useState("");
  const [technical, setTechnical] = useState("");
  const [managerReasoning, setManagerReasoning] = useState("");
  const [managerDecision, setManagerDecision] = useState({});
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const [sentimentLinks, setSentimentLinks] = useState([]);
  const [selectedInferenceId, setSelectedInferenceId] = useState("");

  const [isSidePanelSentDetailOpen, setIsSidePanelSentDetailOpen] = useState(false);
  const [sentimentDetail, setSentimentDetail] = useState([]);

  const [selectedDate, setSelectedDate] = useState(() => new Date()); // Defaults to today's date

  const {lang} = useParams();
  const {asset} = useParams();
  const {infid } = useParams();

  const [selectedPath, setSelectedPath] = useState(`/${lang}/btc/123`); 
  const [selectedTimeframe, setSelectedTimeframe] = useState('1d');

  const navigate = useNavigate();

  const location = useLocation();

  const CustomTable = ({ node, ...props }) => (
    <div style={{ overflowX: 'auto' }}>
      <table {...props} />
    </div>
  );

  useEffect(() => {
    document.title = "Traios";
    ReactGA.send({ hitType: 'pageview', page: location.pathname + location.search });
    setSelectedDate(new Date())
    fetchData();
  }, [navigate, location]);

  const fetchData = async () => {
    console.log(asset)
    console.log(infid)

    var dateParam = ""
    var inferParam = ""
    if(infid) {
      inferParam = infid.replace("%20", " ")
      const [, datePart] = inferParam.split("_");
      if (datePart) {
        [dateParam] = datePart.split(" ");
      }
    }
      
    const today = new Date().toISOString().split("T")[0];
    const currentDate = dateParam || today;

    fetchOHLCData();
    await fetchDetailsForDate(currentDate);
    if (dateParam && dateParam !== '123') {
      setSelectedInferenceId(inferParam);
      const { datePart, dateObject } = parseDateFromString(infid);
      setSelectedDate(datePart)
    }

    // Check if asset is "xau/usd" and use the URL encoded version for the path
    if (asset.toLowerCase() === "xau/usd" || asset.toLowerCase() === "xauusd") {
      setSelectedPath(`/${lang}/xau%2fusd/123`);
    } else {
      setSelectedPath(`/${lang}/${asset}/123`);
    }
  };

  // Format the dates as required
  const formatDate = (date) => {
    return date.toISOString().split("T")[0] + "T00:00:00";
  };

  const parseDateFromString = (input) => {
    // Match the date and time part using a regular expression
    const match = input.match(/(\d{4}-\d{2}-\d{2}) (\d{2}:\d{2}:\d{2})/);
  
    if (match) {
      const datePart = match[1]; // Extracted "yyyy-MM-dd"
      const timePart = match[2].replace(/%20/g, " "); // Replace %20 with space if necessary
  
      // Combine date and time
      const fullDateString = `${datePart}T${timePart}`;
      
      // Convert to a Date object
      const dateObject = new Date(fullDateString);
  
      return { datePart, dateObject };
    } else {
      throw new Error("Invalid date format in string");
    }
  };

  const handleAssetChange = (event) => {
    const path = event.target.value;
    console.log(path);

    setSelectedPath(path); // Update the selected path
    console.log(selectedPath)
    navigate(path); // Navigate to the selected path
    setSelectedDate(new Date())
  };

  const handleTimeframeChange = async(event) => {
    const timeframe = event.target.value;
    console.log(timeframe);

    setSelectedTimeframe(timeframe);

    const today = new Date(); // Get today's date
    const oneDaysAgo = new Date(); // Clone today's date
    oneDaysAgo.setDate(today.getDate() - 1); // Subtract 5 days

    const tomorrow = new Date(today); // Clone today's date
    tomorrow.setDate(today.getDate() + 1); // Add 1 day to get tomorrow

    const start = formatDate(oneDaysAgo); // Start date: 30 days ago
    const end = formatDate(tomorrow); // End date: Tomorrow

    var period = "30"; 
    switch (timeframe) {
      case '4h':
        period = "5"
        break;
      case '8h':
        period = "10"
        break;
      default:
        period = "30"
    }

    const data = await fetchnConvertOHLCData(asset.toUpperCase(), start, end, period, timeframe);
    setOhlcData(data);
  }

  const fetchOHLCData = async () => {
    try {
      const today = new Date(); // Get today's date
      const oneDaysAgo = new Date(); // Clone today's date
      oneDaysAgo.setDate(today.getDate() - 1); // Subtract 30 days

      const tomorrow = new Date(today); // Clone today's date
      tomorrow.setDate(today.getDate() + 1); // Add 1 day to get tomorrow

      const start = formatDate(oneDaysAgo); // Start date: 30 days ago
      const end = formatDate(tomorrow); // End date: Tomorrow

      console.log(asset)

      var period = "30"; 
      switch (selectedTimeframe) {
        case '4h':
          period = "5"
          break;
        case '8h':
          period = "10"
          break;
        default:
          period = "30"
      }

      const data = await fetchnConvertOHLCData(asset.toUpperCase(), start, end, period, selectedTimeframe);
      setOhlcData(data);
    } catch (error) {
      console.error("Error fetching OHLC data:", error);
    }
  };

  const handleInferenceOptionSelect = (selectedId) => {
    console.log("Selected Inference ID:", selectedId);
    if (!Array.isArray(managerDecision) || managerDecision.length === 0) {
      console.error("Invalid or empty serverData array.");
    }
  
    const result = managerDecision.find(
      (item) => item.inference_id === selectedId
    );
  
    if (!result) {
      console.warn(`No element found with inference_id: ${selectedId}`);
    } else {
      setSelectedInferenceId(selectedId);
      setSentiment(result.agent.sentiment_agent.replace(/<br>/g, " "));
      setTechnical(result.agent.technical_agent.replace(/<br>/g, " "));
      setManagerReasoning(result.agent.manager_agent);
    }
  };

  const fetchDetailsForDate = async (date) => {
    try {
      const response = await fetchDetailForDatenAsset(date, asset, lang)
      
      if(response.data.inf.inf.length > 0){
        const infer = response.data.inf.inf[0]
        setSentiment(infer.agent.sentiment_agent.replace(/<br>/g, " "));
        setTechnical(infer.agent.technical_agent.replace(/<br>/g, " "));
        setManagerReasoning(infer.agent.manager_agent);
        setSentimentLinks([]);
        setManagerDecision(response.data.inf.inf)
        setSelectedInferenceId(infer.inference_id);
      } else {
        setSentiment(`No ${asset} Analysis for ${date} yet. Analysis will be provided at 00:02, 04:02, 08:02, 12:02, 16:02, and 20:02 UTC.`);
        setTechnical(`No ${asset} Analysis for ${date} yet. Analysis will be provided at 00:02, 04:02, 08:02, 12:02, 16:02, and 20:02 UTC.`);
        setManagerReasoning(`No ${asset} Analysis for ${date} yet.`);
        setSentimentLinks([]);
        setManagerDecision(`No ${asset} Analysis for ${date} yet. Analysis will be provided at 00:02, 04:02, 08:02, 12:02, 16:02, and 20:02 UTC.`)
        setSelectedInferenceId("");
      }
      
    } catch (error) {
      console.error("Error fetching details:", error);
    }
  };

  const handleCandleClick = (date) => {
    fetchDetailsForDate(date);
  };

  const handleDateChange = (date) => {
    
    console.log("Selected Date:", date); // You can add additional logic here for selected date
    setSelectedDate(date);
    const dateString = format(date, "yyyy-MM-dd");
    fetchDetailsForDate(dateString);
  };

  const handleSentimentURLsClick = async (date) => {
    console.log("handleSentimentURLsClick");
    const response = await fetchSentimentURLs(selectedInferenceId);

    setSentimentLinks(response.data.agent.sentiment_agent);
    setIsSidePanelOpen(true);
  };

  const handleSentimentDetailClick = async (date) => {
    console.log("handleSentimentURLsClick");
    const response = await fetchSentimentDetail(selectedInferenceId);

    console.log(response)

    setSentimentDetail(response.data.llm_input);
    setIsSidePanelSentDetailOpen(true);
  };

  const CustomInput = React.forwardRef(({ value, onClick }, ref) => (
    <button
      type="button"
      className="custom-input"
      onClick={onClick}
      ref={ref}
    >
      {value || "Select a date"}
    </button>
  ));
  
  return (
    <div className="app">
      <header className="top-menu">
        <div className="logo-container">
          <Link to={`/${lang}/btc/123`}>
            <img src="/logo512.png" alt="App Icon" className="header-logo" />
          </Link>
          <h1 className="tech-text">Trade AI OS</h1>
        </div>
        <div className="language-switcher">
          <LanguageSwitcher />
        </div>
      </header>
      <Chat asset={asset} lang={lang}/>
      <div className="content">
      <div className="left-section">
          <div className="select-asset-inf">
            <div>
              <label htmlFor="page-select"><b>Asset: </b></label>
              <select className="select-box" id="page-select-asset" value={selectedPath} onChange={handleAssetChange}>
                  <option value="">Select Asset</option>
                  <option value={`/${lang}/btc/123`}>BTC</option>
                  <option value={`/${lang}/eth/123`}>ETH</option>
                  <option value={`/${lang}/xau%2fusd/123`}>XAU/USD</option>
              </select>
            </div>
            <div>
              <label>
                <b>Date: </b>
              </label>
              <DatePicker
                selected={selectedDate}
                onChange={handleDateChange}
                dateFormat="yyyy-MM-dd" // Format the date as required
                maxDate={new Date()} // Prevent future dates
                className="select-box"
                customInput={<CustomInput />}
              />
            </div>
            <div>
              <label><b>Analysis ID: </b></label>
              <InferenceSelect data={managerDecision} selectedValue={selectedInferenceId} onOptionSelect={handleInferenceOptionSelect} />
            </div>
          </div>
          <div className="manager-reasoning">
            <h2>Manager Reasoning</h2>
            <div>
              <DecisionCard selectedInferenceId={selectedInferenceId} />
            </div>
            <div>
              <p className="center-symbol">
                <span>※</span> Analysis will be provided at 00:02, 04:02, 08:02, 12:02, 16:02, and 20:02 UTC.
              </p>
            </div>
            <div>
              <ReactMarkdown
                children={managerReasoning}
                components={{
                  code({ inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || "");
                    return !inline && match ? (
                      <SyntaxHighlighter
                        style={materialDark}
                        language={match[1]}
                        PreTag="div"
                        {...props}
                      >
                        {String(children).replace(/\n$/, "")}
                      </SyntaxHighlighter>
                    ) : (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    );
                  },
                }}
              />
            </div>
          </div>
        </div>
        <div className="right-section">
          <div className="chart">
            <TradingViewChart symbol={asset}/>
          </div>
          <div className="info-boxes">
            <div className="info-box">
              <h2>Sentiment Analysis</h2>
              <ReactMarkdown remarkPlugins={[remarkGfm]}
                children={sentiment}
                components={{
                  table: CustomTable,
                  code({ inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || "");
                    return !inline && match ? (
                      <SyntaxHighlighter
                        style={materialDark}
                        language={match[1]}
                        PreTag="div"
                        {...props}
                      >
                        {String(children).replace(/\n$/, "")}
                      </SyntaxHighlighter>
                    ) : (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    );
                  },
                }}
              />
              <button onClick={handleSentimentURLsClick}>View Links</button>
              <button onClick={handleSentimentDetailClick}>Sentiment Detail</button>
            </div>
            <div className="info-box">
              <h2>Technical Analysis</h2>
              <ReactMarkdown remarkPlugins={[remarkGfm]}
                children={technical}
                components={{
                  code({ inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || "");
                    return !inline && match ? (
                      <SyntaxHighlighter
                        style={materialDark}
                        language={match[1]}
                        PreTag="div"
                        {...props}
                      >
                        {String(children).replace(/\n$/, "")}
                      </SyntaxHighlighter>
                    ) : (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    );
                  },
                }}
              />
            </div>
          </div>
        </div>
      </div>
      {isSidePanelOpen && (
        <div className="side-panel">
          <div className="side-panel-header">
            <h2>Sentiment Links</h2>
            <button onClick={() => setIsSidePanelOpen(false)}>Close</button>
          </div>
          <div className="side-panel-content">
            <ul className="wrapped-list">
              {sentimentLinks.map((link, index) => (
                <li key={index}>
                  <a href={link} target="_blank" rel="noopener noreferrer">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {isSidePanelSentDetailOpen && (
        <div className="side-panel">
          <div className="side-panel-header">
            <h2>Sentiment Detail</h2>
            <button onClick={() => setIsSidePanelSentDetailOpen(false)}>Close</button>
          </div>
          <div className="side-panel-content">
            <ReactMarkdown remarkPlugins={[remarkGfm]}
                children={sentimentDetail}
                components={{
                  code({ inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || "");
                    return !inline && match ? (
                      <SyntaxHighlighter
                        style={materialDark}
                        language={match[1]}
                        PreTag="div"
                        {...props}
                      >
                        {String(children).replace(/\n$/, "")}
                      </SyntaxHighlighter>
                    ) : (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    );
                  },
                }}
              />
          </div>
        </div>
      )}
    </div>
  );
};

export default TradingBoard;
