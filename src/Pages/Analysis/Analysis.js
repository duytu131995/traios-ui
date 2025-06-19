import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, useLocation, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import axiosInstance from '../../config/axios';

// UI Components
import MarketContent from '../../Components/Analysis/MarketContent';
import MainContent from '../../Components/Analysis/MainContent';
import SideMenu from '../../Components/Analysis/SideMenu';
import MobileMenu from '../../Components/Analysis/MobileMenu';
import MobileLanding from '../../Components/Layout/MobileLanding';

// Charts và Data Visualization
import "react-datepicker/dist/react-datepicker.css";

// Markdown và code hiển thị
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from 'remark-gfm';

// API Services
import fetchDecisionDetails from '../../Libs/API/fetchDecisionDetails';
import fetchDetailForDatenAsset from "../../Libs/API/fetchDetailForDatenAsset";
import fetchSentimentURLs from "../../Libs/API/fetchSentimentURLs";
import fetchSentimentDetail from "../../Libs/API/fetchSentimentDetail";

// Utils & Config
import { format } from "date-fns";
import appConfig from '../../appConfig';

// Styles
import '../../styles/Analysis.css';

// Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCalendar,
  faTimes
} from '@fortawesome/free-solid-svg-icons';

function Analysis() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { lang } = useParams();
  const [searchParams] = useSearchParams();
  const { currentUser, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(lang || 'en');
  const [activeTab, setActiveTab] = useState('historyAnalysis');
  const [activeMarket, setActiveMarket] = useState('crypto-futures');
  const languageDropdownRef = useRef(null);
  const [selectedCrypto, setSelectedCrypto] = useState({ name: 'Bitcoin', symbol: 'BTC', icon: '/bitcoin-icon.svg' });
  const [selectedMetric, setSelectedMetric] = useState('Cumulative PnL');
  const [selectedTimePeriod, setSelectedTimePeriod] = useState('7days');
  const [listPositionHistories, setListPositionHistories] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showMobileUserDropdown, setShowMobileUserDropdown] = useState(false);
  const userDropdownRef = useRef(null);
  const userMobileDropdownRef = useRef(null);

  // Thêm state cho dữ liệu màn AI Info
  const [cryptoData, setCryptoData] = useState({
    stats: {
      daysTrading: 0,
      copiers: 0,
      profitSharing: 0
    },
    performance: {
      roi: 0,
      pnl: 0,
      winRate: 0,
      winPosition: 0,
      totalPosition: 0
    }
  });

  // Thêm state cho chart data
  const [chartData, setChartData] = useState([]);

  const cryptoList = [
    { name: 'Bitcoin', symbol: 'BTC', icon: '/bitcoin-icon.svg' },
    { name: 'Ethereum', symbol: 'ETH', icon: '/ethereum-icon.png' }
  ];

  const forexList = [
    { name: 'XAU/USD', symbol: 'XAU/USD', icon: '/xau-usd.jpeg' }
  ];

  const [selectedInferenceId, setSelectedInferenceId] = useState("");
  const [decisionData, setDecisionData] = useState(null);
  const [managerReasoning, setManagerReasoning] = useState("");
  const [inferenceSummary, setInferenceSummary] = useState("");
  const [technical, setTechnical] = useState("");
  const [sentiment, setSentiment] = useState("");
  const [error, setError] = useState(null);
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const [sentimentLinks, setSentimentLinks] = useState([]);
  const [isSidePanelSentDetailOpen, setIsSidePanelSentDetailOpen] = useState(false);
  const [sentimentDetail, setSentimentDetail] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeAnalysisTab, setActiveAnalysisTab] = useState('summary');
  const [messages, setMessages] = useState(() => {
    return JSON.parse(localStorage.getItem('chatMessages')) || [];
  });
  const [loading, setLoading] = useState(false);
  const [showChatTitle, setShowChatTitle] = useState(true);
  const messagesEndRef = useRef(null);
  const hasGuideBeenAdded = useRef(false);

  const [cumulativeAPR, setCumulativeAPR] = useState([]);
  const [cumulativePnL, setCumulativePnL] = useState([]);

  // Thêm state cho forex
  const [selectedForex, setSelectedForex] = useState({ name: 'XAU/USD', symbol: 'XAU/USD', icon: '/xau-usd.jpeg' });
  const [isForexDropdownOpen, setIsForexDropdownOpen] = useState(false);

  // Auto-scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Save messages to localStorage
  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(messages));
  }, [messages]);

  // Add guide message only the first time the panel is opened
  useEffect(() => {
    if (activeTab === 'liveChat' && !hasGuideBeenAdded.current) {
      const guideMessage = {
        en: {
          type: 'bot',
          text: `Hello! I'm here to help you understand the latest analysis of ${selectedCrypto.symbol}. Here are some questions you might ask:\n\n- Why is ${selectedCrypto.symbol} price rising?\n- What market sentiment factors affect ${selectedCrypto.symbol}?\n- Should I go long or short on ${selectedCrypto.symbol}?`,
        },
        vi: {
          type: 'bot',
          text: `Xin chào! Tôi ở đây để giúp bạn hiểu về phân tích mới nhất về ${selectedCrypto.symbol}. Dưới đây là một số câu hỏi bạn có thể hỏi:\n\n- Tại sao giá ${selectedCrypto.symbol} đang tăng?\n- Yếu tố tâm lý thị trường nào ảnh hưởng đến ${selectedCrypto.symbol}?\n- Tôi nên đi Long hay Short ${selectedCrypto.symbol}?`,
        }
      };

      if (
        messages.length === 0 || // No messages yet
        (messages[messages.length - 1]?.type !== 'bot' && // Last message isn't a bot message
        messages[messages.length - 1]?.text !== guideMessage[lang]) // Last bot message isn't the guide
      ) {
        setMessages((prevMessages) => [...prevMessages, guideMessage[lang]]);
        hasGuideBeenAdded.current = true;
      }
    }
  }, [activeTab, selectedCrypto.symbol, lang]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!chatInput) return;

    const userMessage = { type: 'user', text: chatInput };
    setMessages([...messages, userMessage]);
    setChatInput('');
    setLoading(true);
    setShowChatTitle(false);

    try {
      // Select the newest 4 messages, excluding the guide message
      const recentMessages = messages
        .filter((msg) => msg.text && typeof msg.text === 'string' && !msg.text.includes('Hello!') && !msg.text.includes('Xin chào!'))
        .slice(-4);

      const response = await axiosInstance.post('/chat/chat_w_manager', { 
        asset: selectedCrypto.symbol.toLowerCase(), 
        question: chatInput,
        messageslog: recentMessages,
      });

      const botMessage = { type: 'bot', text: response.data.answer };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.log("error", error)
      const errorMessage = { type: 'bot', text: 'Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau.' };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  // Thêm custom input component cho DatePicker
  const CustomInput = React.forwardRef(({ value, onClick }, ref) => (
    <button
      type="button"
      className="calendar-btn"
      onClick={onClick}
      ref={ref}
    >
      <FontAwesomeIcon icon={faCalendar} />
    </button>
  ));

  const fetchDetailsForDate = async (date, symbol = null, inferenceId = null) => {
    const assetSymbol = symbol ? symbol.toLowerCase() : selectedCrypto.symbol.toLowerCase();
    try {
      const response = await fetchDetailForDatenAsset(date, assetSymbol, selectedLanguage)

      // Thực hiện map data
      if (response?.data?.inf?.inf?.length > 0) {
        const result = response.data.inf.inf;
        // Danh sách Position Histories.
        setListPositionHistories(result);
        console.log("1111111", inferenceId)
        if (inferenceId) {
          const findInferenceIndexById = (array, inferenceId) => {
            return array.findIndex(item => item.inference_id === inferenceId);
          }

          const index = findInferenceIndexById(result, inferenceId);
          if (index !== -1) {
            // Giá trị đầu tiên decision-card tương ứng.
            setSelectedInferenceId(result[index].inference_id)

            // Giá trị đầu tiên analysis-content: Sentiment analysis - Technical Analysis - Reasoning Analysis
            setManagerReasoning(result[index].agent.manager_agent);
            setInferenceSummary(result[index].inference_summary);
            setSentiment(result[index].agent.sentiment_agent.replace(/<br>/g, " "))
            setTechnical(result[index].agent.technical_agent.replace(/<br>/g, " "))
          } else {
            // Giá trị đầu tiên decision-card tương ứng.
            setSelectedInferenceId(result[0].inference_id)

            // Giá trị đầu tiên analysis-content: Sentiment analysis - Technical Analysis - Reasoning Analysis
            setManagerReasoning(result[0].agent.manager_agent);
            setInferenceSummary(result[0].inference_summary);
            setSentiment(result[0].agent.sentiment_agent.replace(/<br>/g, " "))
            setTechnical(result[0].agent.technical_agent.replace(/<br>/g, " "))
          }
        } else {
          // Giá trị đầu tiên decision-card tương ứng.
          setSelectedInferenceId(result[0].inference_id)

          // Giá trị đầu tiên analysis-content: Sentiment analysis - Technical Analysis - Reasoning Analysis
          setManagerReasoning(result[0].agent.manager_agent);
          setInferenceSummary(result[0].inference_summary);
          setSentiment(result[0].agent.sentiment_agent.replace(/<br>/g, " "))
          setTechnical(result[0].agent.technical_agent.replace(/<br>/g, " "))
        }
      } else {
        setListPositionHistories([]);
        setTechnical('');
        setSentiment('');
        setManagerReasoning('');
        setInferenceSummary('');
        setSelectedInferenceId('');
      }
    } catch (error) {
      console.error("Error fetching details:", error);
      setListPositionHistories([]);
    }
  };

  // Thêm hàm xử lý khi thay đổi ngày ở Position Histories
  const handleDateChange = (date) => {
    setSelectedDate(date);
    const dateString = format(date, "yyyy-MM-dd");
    // Thêm logic fetch dữ liệu theo ngày ở đây
    console.log("Selected date:", dateString);
    fetchDetailsForDate(dateString);
  };

  // Thêm useEffect để fetch decision data
  useEffect(() => {
    console.log("==== useEffect [selectedInferenceId]", selectedInferenceId)
    const fetchDetails = async () => {
      try {
        const response = await fetchDecisionDetails(selectedInferenceId);
        setDecisionData(response.data);
      } catch (err) {
        setError("Failed to fetch decision details. Please try again later.");
      }
    };

    if (selectedInferenceId) {
      console.log(9001)
      console.log("Thay đổi giá trị selectedInferenceId UPDATE bên phải", selectedInferenceId)
      if (listPositionHistories.length > 0) {
        const result = listPositionHistories.find(item => item.inference_id === selectedInferenceId);

        if (result?.agent?.manager_agent) {
          setManagerReasoning(result.agent.manager_agent)
          setInferenceSummary(result.inference_summary);
          setSentiment(result.agent.sentiment_agent.replace(/<br>/g, " "))
          setTechnical(result.agent.technical_agent.replace(/<br>/g, " "))
        }
      }
      fetchDetails();
    }

    if (selectedInferenceId === "") {
      setDecisionData(null);
    }
    console.log("+++ end")
  }, [selectedInferenceId]);

  // Xử lý URL parameters
  useEffect(() => {
    console.log("### URL parameters")
    const assetParam = searchParams.get('asset');
    const infParam = searchParams.get('inf');

    if (assetParam) {
      const assetUpper = assetParam.toUpperCase();
      
      // Tìm trong danh sách crypto hoặc forex
      let foundAsset = null;
      
      // Tìm trong cryptoList
      foundAsset = cryptoList.find(crypto => 
        crypto.symbol.toLowerCase() === assetParam.toLowerCase()
      );
      
      // Nếu không tìm thấy trong cryptoList, tìm trong forexList
      if (!foundAsset) {
        foundAsset = forexList.find(forex => 
          forex.symbol.toLowerCase() === assetParam.toLowerCase()
        );
        
        // Nếu tìm thấy trong forexList, cập nhật activeMarket
        if (foundAsset) {
          setActiveMarket('forex');
          setSelectedForex(foundAsset);
        }
      } else {
        // Nếu tìm thấy trong cryptoList
        setActiveMarket('crypto-futures');
        setSelectedCrypto(foundAsset);
      }
    }

    if (infParam) {
      setActiveTab('historyAnalysis');

      try {
        const dateTimeString = infParam.replace('inf_', '');
        const decodedDateTime = decodeURIComponent(dateTimeString);
        const inferenceDate = new Date(decodedDateTime);
        
        // Kiểm tra nếu là ngày hợp lệ
        if (!isNaN(inferenceDate.getTime())) {
          console.log("URL: setSelectedDate: ", setSelectedDate)
          setSelectedDate(inferenceDate);
          
          // Gọi API để lấy chi tiết theo ngày được trích xuất
          const dateString = format(inferenceDate, "yyyy-MM-dd");
          fetchDetailsForDate(dateString, assetParam, infParam);
        }
      } catch (error) {
        console.error("Lỗi khi phân tích ngày từ inference ID:", error);
      }
    }

    // Xóa query parameters sau khi đã xử lý
    if (assetParam || infParam) {
      const newUrl = `${window.location.pathname}`;
      window.history.replaceState({}, '', newUrl);
    }

    console.log("# End")
  }, [searchParams]);

  // Destructure decision data
  const {
    agent = null,
    inference_id = null,
    order = {},
    valid = [false, null],
  } = decisionData || {};

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

  // Kiểm tra đăng nhập và chuyển hướng
  useEffect(() => {
    const checkAuth = async () => {
      if (!currentUser) {
        // Nếu chưa đăng nhập, cho phép xem nhưng hiển thị UI khác
        return;
      }
    };
    checkAuth();
  }, [currentUser, lang, navigate]);

  // Thêm useEffect để xử lý click outside cho language dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (languageDropdownRef.current && !languageDropdownRef.current.contains(event.target)) {
        setShowLanguageDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [languageDropdownRef]);

  // Thêm useEffect để xử lý click outside cho user dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setShowUserDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [userDropdownRef]);

  // Thêm useEffect để xử lý click outside cho user dropdown mobile
  useEffect(() => {
    function handleClickOutside(event) {
      if (userMobileDropdownRef.current && !userMobileDropdownRef.current.contains(event.target)) {
        setShowMobileUserDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [userMobileDropdownRef]);

  // Thêm hàm fetchAIInfoData để lấy dữ liệu cho tab aiInfo từ API
  const fetchAIInfoData = async (asset) => {
    try {
      // Tính toán startDate dựa trên selectedTimePeriod
      let days = 7;
      switch(selectedTimePeriod) {
        case '30days':
          days = 30;
          break;
        case '90days':
          days = 90;
          break;
        case '180days':
          days = 180;
          break;
        default:
          days = 7;
      }
      
      const startDate = format(new Date(Date.now() - days * 24 * 60 * 60 * 1000), "yyyy-MM-dd");
      const endDate = format(new Date(), "yyyy-MM-dd"); // Ngày hiện tại
      
      const response = await axiosInstance.get(`/inference/get_bot_info`, {
        params: {
          asset: asset.toLowerCase(),
          inf_prefix: 'inf',
          startdate: startDate,
          enddate: endDate
        }
      });
      
      const data = response.data;
      console.log("AI Info data:", data);
      
      if (data) {
        // Cập nhật state với dữ liệu từ API
        setCryptoData({
          stats: {
            daysTrading: data?.copy_links[0]?.days_trading || 0,
            copiers: data?.copy_links[0]?.copiers || 0,
            profitSharing: data?.copy_links[0]?.profit_sharing || 0,
            copyTradeLink: data?.copy_links[0]?.copy_trade_link || 0,
            followLink: data?.follow_link || 0
          },
          performance: {
            roi: ((data?.copy_links[0]?.ROI || 0) * 100).toFixed(1),
            pnl: data?.copy_links[0]?.PnL || 0,
            winRate: data?.copy_links[0]?.WinRate || 0,
            winPosition: data?.copy_links[0]?.WinPosition || 0,
            totalPosition: data?.copy_links[0]?.TotalPosition || 0
          }
        });
        
        // Cập nhật chart data
        if (data?.copy_links[0]?.CumulativePnL && Array.isArray(data?.copy_links[0]?.CumulativePnL)) {
          const formattedChartData = data.copy_links[0].CumulativePnL.map(item => ({
            date: format(new Date(item.date), 'dd/MM'),
            value: item.value
          }));
          setCumulativePnL(formattedChartData);
          setChartData(formattedChartData);
        }

        // Cập nhật chart data
        if (data?.copy_links[0]?.CumulativeAPR && Array.isArray(data?.copy_links[0]?.CumulativeAPR)) {
          const formattedChartData = data.copy_links[0].CumulativeAPR.map(item => ({
            date: format(new Date(item.date), 'dd/MM'),
            value: item.value*100
          }));
          setCumulativeAPR(formattedChartData);
        }
      }
    } catch (error) {
      console.error("Error fetching AI Info data:", error);
      // Sử dụng dữ liệu mặc định trong trường hợp lỗi
      setCryptoData({
        stats: {
          daysTrading: 0,
          copiers: 0,
          profitSharing: 0,
          copyTradeLink: "",
          followLink: ""
        },
        performance: {
          roi: 0,
          pnl: 0,
          winRate: 0,
          winPosition: 0,
          totalPosition: 0
        }
      });
      setChartData([]);
    }
  };

  useEffect(() => {
    if (selectedMetric === "Cumulative PnL") {
      setChartData(cumulativePnL)
    } else {
      setChartData(cumulativeAPR)
    }
  }, [selectedMetric]);

  // Thêm useEffect để cập nhật dữ liệu khi thay đổi thời gian
  useEffect(() => {
    // Gọi API để lấy dữ liệu cho AIInfo với period mới
    fetchAIInfoData(selectedCrypto.symbol);
  }, [selectedTimePeriod]);

  // Thêm useEffect để cập nhật dữ liệu khi thay đổi btc, ngôn ngữ, tab.
  useEffect(() => {
    console.log("==== useEffect Thay đổi selectedCrypto, selectedLanguage")
    if (activeTab === 'historyAnalysis') {
      console.log("Local Lấy danh sách bên trái, set giá trị bên phải theo giá trị đầu tiên bên trái.")
      fetchDetailsForDate(format(new Date, "yyyy-MM-dd"));
    }
    
    if (activeTab === 'aiInfo') {
      fetchAIInfoData(selectedCrypto.symbol);
    }
    console.log("++++ end")
  }, [selectedCrypto, selectedLanguage]);

  useEffect(() => {
    console.log("==== useEffect [selectedCrypto, activeTab]")
    if (activeTab === 'historyAnalysis') {
      // Chỉ set ngày hiện tại nếu không có ngày được chỉ định từ URL
      const infParam = searchParams.get('inf');
      if (!infParam) {
        console.log("Local thời gian đồng hồ selectedDate: ", selectedDate)
        setSelectedDate(new Date())
      }
    }
    console.log("+++ end")
  }, [selectedCrypto, activeTab, searchParams]);

  // Hàm thay đổi ngôn ngữ
  const changeLanguage = (language) => {
    i18n.changeLanguage(language);
    setSelectedLanguage(language);
    setShowLanguageDropdown(false);
    setShowMobileLanguageOptions(false);
    setShowMobileMenu(false);

    // Cập nhật URL với ngôn ngữ mới
    const pathParts = location.pathname.split('/');
    if (pathParts.length > 1) {
      pathParts[1] = language;
      navigate(pathParts.join('/'));
    }
  };

  // Hàm điều hướng với ngôn ngữ
  const navigateWithLang = (path) => {
    navigate(`/${lang}${path}`);
  };

  // Hàm điều hướng đến trang pricing
  const handleUpgradeClick = () => {
    navigateWithLang('/pricing');
  };

  const handleLogin = () => {
    navigate(`/${lang}/login`);
  };

  const handleSignup = () => {
    navigate(`/${lang}/register`);
  };

  // Thêm hàm xử lý chuyển tab
  const handleTabClick = (tabName) => {
    setActiveTab(tabName);

    if (tabName === "historyAnalysis") {
      console.log("---- Function Click Tab thì gọi list danh sách bên trái. Và update bên phải theo data đầu tiên. Có sét lại giá trị setSelectedInferenceId")
      const dateString = format(new Date, "yyyy-MM-dd");
      fetchDetailsForDate(dateString);
    }
    
    if (tabName === "liveChat") {
      setShowChatTitle(messages.length === 0);
    }
  };

  // Thêm hàm xử lý đăng xuất
  const handleLogout = async () => {
    try {
      await logout();
      navigate(`/${lang}/login`);
    } catch (error) {
      console.error('Lỗi đăng xuất:', error);
    }
  };

  // Thêm các hàm xử lý sentiment URLs và detail
  const handleSentimentURLsClick = async () => {
    try {
      const response = await fetchSentimentURLs(selectedInferenceId);
      setSentimentLinks(response.data.agent.sentiment_agent);
      setIsSidePanelOpen(true);
    } catch (error) {
      console.error("Error fetching sentiment URLs:", error);
    }
  };

  const handleSentimentDetailClick = async () => {
    try {
      const response = await fetchSentimentDetail(selectedInferenceId);
      setSentimentDetail(response.data.llm_input);
      setIsSidePanelSentDetailOpen(true);
    } catch (error) {
      console.error("Error fetching sentiment detail:", error);
    }
  };

  // Thêm hàm xử lý khi click vào menu item
  const handleMarketClick = (market) => {
    setActiveMarket(market);

    if (market === "crypto-futures") {
      setSelectedCrypto({ name: 'Bitcoin', symbol: 'BTC', icon: '/bitcoin-icon.svg' })
    } else if (market === "forex") {
      setSelectedCrypto({ name: 'XAU/USD', symbol: 'XAU/USD', icon: '/xau-usd.jpeg' })
    } else {
      console.log("Stock")
    }
  };

  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showMobileLanguageOptions, setShowMobileLanguageOptions] = useState(false);
  const [showMobileAccountOptions, setShowMobileAccountOptions] = useState(false);
  const mobileMenuRef = useRef(null);
  const mobileLanguageOptionsRef = useRef(null);
  const mobileAccountOptionsRef = useRef(null);
  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  return (
    <div className="analysis-container">
      {/* Side Menu */}
      <SideMenu 
        lang={lang}
        activeMarket={activeMarket}
        handleMarketClick={handleMarketClick}
        currentUser={currentUser}
        userDropdownRef={userDropdownRef}
        showUserDropdown={showUserDropdown}
        setShowUserDropdown={setShowUserDropdown}
        handleLogout={handleLogout}
        languageDropdownRef={languageDropdownRef}
        showLanguageDropdown={showLanguageDropdown}
        setShowLanguageDropdown={setShowLanguageDropdown}
        selectedLanguage={selectedLanguage}
        changeLanguage={changeLanguage}
        t={t}
      />

      {/* MobileLanding Header + Menu riêng */}
      <MobileLanding
        lang={lang}
        showMobileMenu={showMobileMenu}
        toggleMobileMenu={toggleMobileMenu}
        mobileMenuRef={mobileMenuRef}
        isActive={(path) => location.pathname.includes(path)}
        t={t}
        currentUser={currentUser}
        handleLogout={handleLogout}
        showMobileLanguageOptions={showMobileLanguageOptions}
        setShowMobileLanguageOptions={setShowMobileLanguageOptions}
        mobileLanguageOptionsRef={mobileLanguageOptionsRef}
        changeLanguage={changeLanguage}
        selectedLanguage={selectedLanguage}
        showMobileAccountOptions={showMobileAccountOptions}
        setShowMobileAccountOptions={setShowMobileAccountOptions}
        mobileAccountOptionsRef={mobileAccountOptionsRef}
        setShowMobileMenu={setShowMobileMenu}
      />

      {/* Bottom Navigation (Side Menu Mobile) */}
      <MobileMenu 
        activeMarket={activeMarket}
        handleMarketClick={handleMarketClick}
        userMobileDropdownRef={userMobileDropdownRef}
        showMobileUserDropdown={showMobileUserDropdown}
        setShowMobileUserDropdown={setShowMobileUserDropdown}
        selectedLanguage={selectedLanguage}
        changeLanguage={changeLanguage}
        currentUser={currentUser}
        handleUpgradeClick={handleUpgradeClick}
        handleLogout={handleLogout}
        navigate={navigate}
        lang={lang}
        t={t}
      />

      {/* Right Content */}
      <div className="right-content">
        {activeMarket === 'crypto-futures' && (
          <MarketContent
            activeTab={activeTab}
            handleTabClick={handleTabClick}
            isForex={false}
            selectedAsset={selectedCrypto}
            setSelectedAsset={setSelectedCrypto}
            isAssetDropdownOpen={isDropdownOpen}
            setIsAssetDropdownOpen={setIsDropdownOpen}
            assetList={cryptoList}
            t={t}
            lang={lang}
            currentUser={currentUser}
            handleUpgradeClick={handleUpgradeClick}
            handleSignup={handleSignup}
            handleLogin={handleLogin}
            showMobileMenu={showMobileMenu}
            setShowMobileMenu={setShowMobileMenu}
            renderMainContent={() => (
              <MainContent
                activeTab={activeTab}
                cryptoData={{
                  ...cryptoData,
                  symbol: selectedCrypto.symbol,
                  icon: selectedCrypto.icon,
                  currentUser: currentUser
                }}
                selectedTimePeriod={selectedTimePeriod}
                setSelectedTimePeriod={setSelectedTimePeriod}
                selectedMetric={selectedMetric}
                setSelectedMetric={setSelectedMetric}
                chartData={chartData}
                t={t}
                selectedDate={selectedDate}
                handleDateChange={handleDateChange}
                listPositionHistories={listPositionHistories}
                selectedInferenceId={selectedInferenceId}
                setSelectedInferenceId={setSelectedInferenceId}
                currentUser={currentUser}
                error={error}
                decisionData={decisionData}
                activeAnalysisTab={activeAnalysisTab}
                setActiveAnalysisTab={setActiveAnalysisTab}
                handleSentimentURLsClick={handleSentimentURLsClick}
                handleSentimentDetailClick={handleSentimentDetailClick}
                sentiment={sentiment}
                technical={technical}
                managerReasoning={managerReasoning}
                inferenceSummary={inferenceSummary}
                selectedCrypto={selectedCrypto}
                showChatTitle={showChatTitle}
                messages={messages}
                loading={loading}
                messagesEndRef={messagesEndRef}
                chatInput={chatInput}
                setChatInput={setChatInput}
                handleSendMessage={handleSendMessage}
              />
            )}
          />
        )}
        
        {activeMarket === 'forex' && (
          <MarketContent
            activeTab={activeTab}
            handleTabClick={handleTabClick}
            isForex={true}
            selectedAsset={selectedForex}
            setSelectedAsset={setSelectedForex}
            isAssetDropdownOpen={isForexDropdownOpen}
            setIsAssetDropdownOpen={setIsForexDropdownOpen}
            assetList={forexList}
            t={t}
            lang={lang}
            currentUser={currentUser}
            handleUpgradeClick={handleUpgradeClick}
            handleSignup={handleSignup}
            handleLogin={handleLogin}
            showMobileMenu={showMobileMenu}
            setShowMobileMenu={setShowMobileMenu}
            renderMainContent={() => (
              <MainContent
                activeTab={activeTab}
                cryptoData={{
                  ...cryptoData,
                  symbol: selectedForex.symbol,
                  icon: selectedForex.icon,
                  currentUser: currentUser
                }}
                selectedTimePeriod={selectedTimePeriod}
                setSelectedTimePeriod={setSelectedTimePeriod}
                selectedMetric={selectedMetric}
                setSelectedMetric={setSelectedMetric}
                chartData={chartData}
                t={t}
                selectedDate={selectedDate}
                handleDateChange={handleDateChange}
                listPositionHistories={listPositionHistories}
                selectedInferenceId={selectedInferenceId}
                setSelectedInferenceId={setSelectedInferenceId}
                currentUser={currentUser}
                error={error}
                decisionData={decisionData}
                activeAnalysisTab={activeAnalysisTab}
                setActiveAnalysisTab={setActiveAnalysisTab}
                handleSentimentURLsClick={handleSentimentURLsClick}
                handleSentimentDetailClick={handleSentimentDetailClick}
                sentiment={sentiment}
                technical={technical}
                managerReasoning={managerReasoning}
                inferenceSummary={inferenceSummary}
                selectedCrypto={selectedForex}
                showChatTitle={showChatTitle}
                messages={messages}
                loading={loading}
                messagesEndRef={messagesEndRef}
                chatInput={chatInput}
                setChatInput={setChatInput}
                handleSendMessage={handleSendMessage}
              />
            )}
          />
        )}
        
        {activeMarket === 'stock' && (
          <div className="empty-content">
            <h2>Stock Market</h2>
            <p>Coming soon...</p>
          </div>
        )}
      </div>

      {/* Thêm các side panel */}
      {isSidePanelOpen && (
        <div>
          <div className="background-side-panel"></div>
          <div className="side-panel">
            <div className="side-panel-header">
              <h2>{t('analysis.history.sentimentLinks')}</h2>
              <button onClick={() => setIsSidePanelOpen(false)}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
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
        </div>
      )}

      {isSidePanelSentDetailOpen && (
        <div>
          <div className="background-side-panel"></div>
          <div className="side-panel">
            <div className="side-panel-header">
              <h2>{t('analysis.history.sentimentDetailTitle')}</h2>
              <button onClick={() => setIsSidePanelSentDetailOpen(false)}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
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
        </div>
      )}
    </div>
  );
}

export default Analysis; 