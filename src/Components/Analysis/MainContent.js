import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from "date-fns";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faTimes, faCaretDown, faArrowLeft, faCheck, faExclamation, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from 'remark-gfm';
import TradingViewChart from '../../Component/TradingViewChart';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// Tab aiInfo component
const AIInfoTab = ({ 
  cryptoData, 
  selectedTimePeriod, 
  setSelectedTimePeriod, 
  selectedMetric, 
  setSelectedMetric, 
  chartData,
  t
}) => {
  const [showTimePeriodDropdown1, setShowTimePeriodDropdown1] = useState(false);
  const [showTimePeriodDropdown2, setShowTimePeriodDropdown2] = useState(false);
  
  const timePeriodOptions = [
    { value: '7days', label: t('analysis.chart.timeSelector.7days') },
    { value: '30days', label: t('analysis.chart.timeSelector.30days') },
    { value: '90days', label: t('analysis.chart.timeSelector.90days') },
    { value: '180days', label: t('analysis.chart.timeSelector.180days') }
  ];
  
  const handleTimePeriodSelect = (dropdown, value) => {
    setSelectedMetric('Cumulative PnL')
    setSelectedTimePeriod(value);
    if (dropdown === 1) {
      setShowTimePeriodDropdown1(false);
    } else {
      setShowTimePeriodDropdown2(false);
    }
  };
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.time-selector')) {
        setShowTimePeriodDropdown1(false);
        setShowTimePeriodDropdown2(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  return (
    <>
      <div className="session-info">
        <div className="profile-header">
          <div className="profile-info">
            <div className="profile-avatar">
              <img src="/avatar.svg" alt="Avatar" />
            </div>
            <div className="profile-details">
              <h2>TraiOS {cryptoData.symbol} <span className="slots-left">(<span className="slots-count">29</span> {t('analysis.slotsLeft', { count: '' })})</span></h2>
              <div className="profile-stats">
                <div className="stat-item">
                  <span className="stat-label">{t('analysis.stats.daysTrading')}:</span>
                  <span className="stat-value">{cryptoData.stats.daysTrading}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">{t('analysis.stats.copiers')}:</span>
                  <span className="stat-value">{cryptoData.stats.copiers}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">{t('analysis.stats.profitSharing')}:</span>
                  <span className="stat-value">{cryptoData.stats.profitSharing*100}%</span>
                </div>
              </div>
            </div>
          </div>
          {cryptoData.currentUser ? (
            <div className="action-buttons">
              <button className="follow-btn" onClick={() => window.open(cryptoData.stats.followLink, "_blank")}>{t('analysis.follow')}</button>
              <button className="copy-btn" onClick={() => window.open(cryptoData.stats.copyTradeLink, "_blank")}>{t('analysis.copy')}</button>
            </div>
          ) : (
            ''
          )}
        </div>
      </div>

      <div className="performance-section">
        <div className="performance-header">
          <h3>{t('analysis.performance.title')}</h3>
          <div className={`time-selector ${showTimePeriodDropdown1 ? 'active' : ''}`} onClick={() => setShowTimePeriodDropdown1(!showTimePeriodDropdown1)}>
            {timePeriodOptions.find(option => option.value === selectedTimePeriod)?.label || timePeriodOptions[0].label}
            <div className="arrow-icon"></div>
            {showTimePeriodDropdown1 && (
              <div className="time-selector-dropdown">
                {timePeriodOptions.map(option => (
                  <div 
                    key={option.value} 
                    className={`time-selector-option ${selectedTimePeriod === option.value ? 'active' : ''}`}
                    onClick={() => handleTimePeriodSelect(1, option.value)}
                  >
                    {option.label}
                    {selectedTimePeriod === option.value && <span className="checkmark">✓</span>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div className="performance-stats">
          <div className="stat-group">
            <div className="stat-label">{t('analysis.performance.roi')}</div>
            <div className={`stat-value ${cryptoData.performance.roi >= 0 ? 'positive' : 'negative'}`}>
              {cryptoData.performance.roi}%
            </div>
          </div>

          <div className="stat-group">
            <div className="stat-label">{t('analysis.performance.pnl')}</div>
            <div className="stat-value">{cryptoData.performance.pnl} USD</div>
          </div>

          <div className="stat-group">
            <div className="stat-label">{t('analysis.performance.winRate')}</div>
            <div className="stat-value">{cryptoData.performance.winRate*100}%</div>
          </div>

          <div className="stat-group">
            <div className="stat-label">{t('analysis.performance.winPosition')}</div>
            <div className="stat-value">{cryptoData.performance.winPosition}</div>
          </div>

          <div className="stat-group">
            <div className="stat-label">{t('analysis.performance.totalPosition')}</div>
            <div className="stat-value">{cryptoData.performance.totalPosition}</div>
          </div>
        </div>
      </div>

      <div className="chart-section">
        <div className="chart-header">
          <div className="metric-selector">
            <button 
              className={`metric-btn ${selectedMetric === 'Cumulative PnL' ? 'active' : ''}`}
              onClick={() => setSelectedMetric('Cumulative PnL')}
            >
              {t('analysis.chart.cumulativePnL')}
            </button>
            <button 
              className={`metric-btn ${selectedMetric === 'Cumulative ROI' ? 'active' : ''}`}
              onClick={() => setSelectedMetric('Cumulative ROI')}
            >
              {t('analysis.chart.cumulativeROI')}
            </button>
          </div>
          <div className={`time-selector ${showTimePeriodDropdown2 ? 'active' : ''}`} onClick={() => setShowTimePeriodDropdown2(!showTimePeriodDropdown2)}>
            {timePeriodOptions.find(option => option.value === selectedTimePeriod)?.label || timePeriodOptions[0].label}
            <div className="arrow-icon"></div>
            {showTimePeriodDropdown2 && (
              <div className="time-selector-dropdown">
                {timePeriodOptions.map(option => (
                  <div 
                    key={option.value} 
                    className={`time-selector-option ${selectedTimePeriod === option.value ? 'active' : ''}`}
                    onClick={() => handleTimePeriodSelect(2, option.value)}
                  >
                    {option.label}
                    {selectedTimePeriod === option.value && <span className="checkmark">✓</span>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="chart-container">
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22C55E" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#22C55E" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
              <XAxis 
                dataKey="date" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#6B7280', fontSize: 12 }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#6B7280', fontSize: 12 }}
                tickFormatter={(value) => `${value}${selectedMetric === "Cumulative PnL" ? " USD" : "%"}`}
              />
              <Tooltip 
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="custom-tooltip">
                        <p>{label}</p>
                        <p>{selectedMetric === "Cumulative PnL" ? "Pnl" : "ROI"}: {payload[0].value}{selectedMetric === "Cumulative PnL" ? " USD" : "%"}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#22C55E" 
                fillOpacity={1}
                fill="url(#colorValue)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
};

// Component trả về nội dung phù hợp dựa vào activeTab
const MainContent = ({ 
  activeTab,
  cryptoData,
  selectedTimePeriod,
  setSelectedTimePeriod,
  selectedMetric,
  setSelectedMetric,
  chartData,
  t,
  // Các props khác cho history analysis tab
  selectedDate,
  handleDateChange,
  listPositionHistories,
  selectedInferenceId,
  setSelectedInferenceId, 
  currentUser,
  error,
  decisionData,
  activeAnalysisTab,
  setActiveAnalysisTab,
  handleSentimentURLsClick,
  handleSentimentDetailClick,
  sentiment,
  technical,
  managerReasoning,
  selectedCrypto,
  inferenceSummary, // Thêm prop này để nhận dữ liệu inference_summary
  // Props cho LiveChat
  showChatTitle,
  messages,
  loading,
  messagesEndRef,
  chatInput,
  setChatInput,
  handleSendMessage
}) => {
  // Thêm state để theo dõi chế độ xem trên mobile
  const [isMobileListView, setIsMobileListView] = useState(true);
  // Thêm state để theo dõi kích thước màn hình
  const [isMobile, setIsMobile] = useState(false);
  const [isclickSelectedInferenceId, setIsclickSelectedInferenceId] = useState(false);
  // Thêm state để theo dõi trạng thái mở DatePicker
  const [isOpenDatePicker, setIsOpenDatePicker] = useState(false);
  console.log("===== MainContent selectedInferenceId: ", selectedInferenceId)
  // Kiểm tra kích thước màn hình khi component mount
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 767);
    };
    
    // Kiểm tra khi component mount
    checkIfMobile();
    
    // Kiểm tra khi resize cửa sổ
    window.addEventListener('resize', checkIfMobile);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);
  
  useEffect(() => {
    setIsMobileListView(true);
  }, [activeTab]);

  // Sử dụng useEffect để chuyển đến chế độ detail khi chọn một position
  // useEffect(() => {
  //   if (selectedInferenceId && isMobile) {
  //     setIsMobileListView(false);
  //   }
  // }, [selectedInferenceId, isMobile]);
  
  // Hàm quay lại danh sách trên mobile
  const handleBackToList = () => {
    setIsMobileListView(true);
  };

  // Custom input component cho DatePicker
  const CustomInput = React.forwardRef(({ value, onClick }, ref) => (
    <button
      type="button"
      className="calendar-btn"
      onClick={() => {
        setIsOpenDatePicker(!isOpenDatePicker);
        onClick();
      }}
      ref={ref}
    >
      <FontAwesomeIcon icon={faCalendar} />
    </button>
  ));
  
  // Thêm useEffect để scroll xuống cuối cùng khi chuyển tab
  useEffect(() => {
    if (activeTab === 'liveChat') {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeTab]);
  
  // Based on activeTab, render different content
  switch (activeTab) {
    case 'aiInfo':
      return (
        <AIInfoTab
          cryptoData={cryptoData}
          selectedTimePeriod={selectedTimePeriod}
          setSelectedTimePeriod={setSelectedTimePeriod}
          selectedMetric={selectedMetric}
          setSelectedMetric={setSelectedMetric}
          chartData={chartData}
          t={t}
        />
      );
    case 'historyAnalysis':
      return (
        <div className={`history-analysis-container ${isMobile ? (isMobileListView ? 'mobile-list-view' : 'mobile-detail-view') : ''}`}>
          <div className={`history-analysis-left ${isOpenDatePicker ? 'click' : 'non-click'}`}>
            <div className="history-header">
              <h2>{t('analysis.history.analysisHistory')}</h2>
              <DatePicker
                selected={selectedDate}
                onChange={(date) => {
                  if (currentUser) {
                    handleDateChange(date);
                    setIsOpenDatePicker(false);
                  }
                }}
                onCalendarClose={() => setIsOpenDatePicker(false)}
                onCalendarOpen={() => setIsOpenDatePicker(true)}
                dateFormat="yyyy-MM-dd"
                maxDate={new Date()}
                customInput={<CustomInput />}
                key="1"
              />
            </div>
            
            <div className="position-list">
              {listPositionHistories.length > 0 ? (
                listPositionHistories.map((position, index) => (
                  <div key={position.inference_id}>
                    <div
                      className={`position-item ${selectedInferenceId === position?.inference_id ? 'active' : ''}`}
                      onClick={() => {
                        if (currentUser) {
                          setSelectedInferenceId(position.inference_id);
                          if (isMobile) {
                            setIsMobileListView(false);
                          }
                        }
                      }}
                    >
                      <div className="position-info">
                        <div className="position-title">
                          <span className="asset">{position?.order?.symbol || "BTC"} - </span>
                          <span className={`type ${
                            position?.order?.side === "hold" 
                              ? position?.order?.current_position_side?.toLowerCase() === "long" 
                                ? "hold-long" 
                                : "hold-short"
                              : position?.order?.side?.toLowerCase() || "neutral"
                          }`}>
                            {
                              position?.order?.side === "hold"
                                ? position?.order?.current_position_side?.toLowerCase() === "long" 
                                  ? "Hold Long"
                                  : "Hold Short"
                                : position?.order?.side?.toLowerCase() || 'Unknown'
                            }
                          </span>
                        </div>
                        <span className="date">{position?.inference_id?.split("_")[1]}</span>
                      </div>
                      {position.order?.side !== "neutral" && (
                        <div className={`position-result ${position?.order?.side}`}>
                          {parseFloat(position?.order?.rr) >= 0 ? '+' : ''}{position?.order?.rr}%
                        </div>
                      )}
                      <FontAwesomeIcon icon={faAngleRight} className="arrow-icon-mobile" />
                    </div>
                    <hr />
                  </div>
                ))
              ) : (
                <div className="no-positions">
                  {t('analysis.history.noPositionsFound')}
                </div>
              )}
            </div>
          </div>
          
          <div className={`history-analysis-right ${!currentUser ? "non-logged" : ""}`}>
            {isMobile && (
              <div className="mobile-back-header">
                <button className="back-button" onClick={handleBackToList}>
                  <FontAwesomeIcon icon={faArrowLeft} />
                </button>
                <h2>{t('analysis.history.analysisHistory')}</h2>
              </div>
            )}
            
            <div className={`${!currentUser ? "overlay-content" : "non-overlay-content"}`}>
              {error ? (
                <div className="error-message">{error}</div>
              ) : decisionData ? (
                <>
                  <div className="decision-card">
                    <div className="decision-header">
                      <div className="coin-info">
                        <div className="coin-icon">
                          <img src={selectedCrypto.icon} alt={decisionData.order?.symbol || selectedCrypto.symbol} />
                        </div>
                        <div className={`position-type position-type-${
                          decisionData.order?.side === "hold" 
                            ? decisionData.order?.current_position_side?.toLowerCase() === "long" 
                              ? "hold-long" 
                              : "hold-short"
                            : decisionData.order?.side ? decisionData.order?.side.toLowerCase() : "unknown"
                        }`}>
                          <span>{decisionData.order?.symbol || "BTC"} - </span>
                          <span className={`type-${
                            decisionData.order?.side === "hold" 
                              ? decisionData.order?.current_position_side?.toLowerCase() === "long" 
                                ? "hold-long" 
                                : "hold-short"
                              : decisionData.order?.side ? decisionData.order?.side.toLowerCase() : "unknown"
                          }`}>
                            {
                              decisionData.order?.side === "hold"
                                ? decisionData.order?.current_position_side?.toLowerCase() === "long" 
                                  ? "Hold Long"
                                  : "Hold Short"
                                : decisionData.order?.side ? decisionData.order?.side.toUpperCase() : t('analysis.history.unknown')
                            }
                          </span>
                        </div>
                      </div>
                      {decisionData.order?.side !== "hold-draf" && (
                        <span className={decisionData.valid?.[0] ? "validation-valid" : "validation-invalid"}>
                          {decisionData.valid?.[0] ? t('analysis.history.valid') : t('analysis.history.invalid')}
                          {decisionData.valid?.[0] ? <FontAwesomeIcon icon={faCheck} /> : <FontAwesomeIcon icon={faExclamation} />}
                        </span>
                      )}
                    </div>

                    <div className="decision-details">
                      <div className="detail-row">
                        <span className="detail-label">{t('analysis.history.inferenceId')}:</span>
                        <span className="detail-value">{decisionData.inference_id || "N/A"}</span>
                      </div>

                      <div className="detail-row">
                        <span className="detail-label">{t('analysis.history.strategyName')}:</span>
                        <span className="detail-value">{decisionData?.order?.strategy_name || "N/A"}</span>
                      </div>

                      <div className="detail-row">
                        <div className="detail-group">
                          <span className="detail-label">{t('analysis.history.orderType')}:</span>
                          <span className="detail-value">{decisionData.order?.type || "N/A"}</span>
                        </div>
                        <div className="detail-group">
                          <span className="detail-label">{t('analysis.history.leverage')}:</span>
                          <span className="detail-value">{decisionData.order?.leverage || "N/A"}</span>
                        </div>
                        {decisionData.order?.side !== "neutral" && (
                          <>
                            <div className="detail-group">
                              <span className="detail-label">{t('analysis.history.confidentScore')}:</span>
                              <span className="detail-value">{decisionData.order?.confidence_score || "N/A"}</span>
                            </div>
                            <div className="detail-group">
                              <span className="detail-label">{t('analysis.history.returnOnRisk')}:</span>
                              <span className="detail-value">{decisionData.order?.rr || "N/A"}</span>
                            </div>
                          </>
                        )}
                      </div>

                      <div className="detail-row">
                        <div className="detail-group">
                          <span className="detail-label">{t('analysis.history.limitEntryPrice')}:</span>
                          <span className="detail-value">{decisionData.order?.limit_entry_price || "N/A"}</span>
                        </div>
                        <div className="detail-group">
                          <span className="detail-label">{t('analysis.history.stopLossPrice')}:</span>
                          <span className="detail-value">{decisionData.order?.stop_loss_price || "N/A"}</span>
                        </div>
                        <div className="detail-group">
                          <span className="detail-label">{t('analysis.history.stopPrice')}:</span>
                          <span className="detail-value">{decisionData.order?.stop_price || "N/A"}</span>
                        </div>
                        <div className="detail-group">
                          <span className="detail-label">{t('analysis.history.takeProfitPrice')}:</span>
                          <span className="detail-value">{decisionData.order?.take_profit_price || "N/A"}</span>
                        </div>
                      </div>
                    </div>

                    {!decisionData.valid?.[0] && decisionData.order?.side !== "hold" && (
                      <div className="decision-card-footer">
                        <p className="validation-error"><em>{decisionData.valid?.[1]}</em></p>
                      </div>
                    )}
                  </div>

                  <div className="analysis-tabs-section">
                    <div className="analysis-tabs">
                      <button 
                        className={`analysis-tab ${activeAnalysisTab === 'summary' ? 'active' : ''}`}
                        onClick={() => setActiveAnalysisTab('summary')}
                      >
                        {isMobile ? t('analysis.history.summarySort', 'Sum') : t('analysis.history.summary', 'Summary')}
                      </button>
                      <button 
                        className={`analysis-tab ${activeAnalysisTab === 'reasoning' ? 'active' : ''}`}
                        onClick={() => setActiveAnalysisTab('reasoning')}
                      >
                        {isMobile ? t('analysis.history.reasoningAnalysisSort') : t('analysis.history.reasoningAnalysis')}
                      </button>
                      <button 
                        className={`analysis-tab ${activeAnalysisTab === 'sentiment' ? 'active' : ''}`}
                        onClick={() => setActiveAnalysisTab('sentiment')}
                      >
                        {isMobile ? t('analysis.history.sentimentAnalysisSort') : t('analysis.history.sentimentAnalysis')}
                      </button>
                      <button 
                        className={`analysis-tab ${activeAnalysisTab === 'technical' ? 'active' : ''}`}
                        onClick={() => setActiveAnalysisTab('technical')}
                      >
                        {isMobile ? t('analysis.history.technicalAnalysisSort') : t('analysis.history.technicalAnalysis')}
                      </button>
                    </div>

                    <div className="analysis-content">
                      {activeAnalysisTab === 'summary' ? (
                        <div className="summary-content">
                          <ReactMarkdown
                            children={inferenceSummary || t('analysis.history.noSummary', 'No summary available.')}
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
                      ) : activeAnalysisTab === 'sentiment' ? (
                        <div className="sentiment-content">
                          <div className="sentiment-header">
                            <h2>{t('analysis.history.analysis')}</h2>
                            <div className="sentiment-actions">
                              <button onClick={handleSentimentURLsClick}>{t('analysis.history.viewLinks')}</button>
                              <button onClick={handleSentimentDetailClick}>{t('analysis.history.sentimentDetail')}</button>
                            </div>
                          </div>
                          
                          <ReactMarkdown remarkPlugins={[remarkGfm]}
                            children={sentiment}
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
                      ) : activeAnalysisTab === 'technical' ? (
                        <div className="technical-content">
                          <div className="chart">
                            <TradingViewChart symbol={selectedCrypto.symbol}/>
                          </div>
                          <ReactMarkdown remarkPlugins={[remarkGfm]}
                            children={technical || t('analysis.history.noTechnicalAnalysis')}
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
                      ) : (
                        <div className="reasoning-content">
                          <ReactMarkdown
                            children={managerReasoning || t('analysis.history.noReasoningAnalysis')}
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
                      )}
                    </div>
                  </div>
                </>
              ) : null}
            </div>
            {!currentUser && (
              <div className="overlay-message">
                <img src="/padlock.svg" alt="Padlock" />
                <p>{t('analysis.history.pleaseLogin')}</p>
              </div>
            )}
          </div>
        </div>
      );
    case 'liveChat':
      return (
        <div className={`live-chat-section ${!currentUser ? "non-logged" : ""}`}>
          <div className={`chat-container ${!currentUser ? "overlay-content" : "non-overlay-content"}`}>
            {showChatTitle && (
              <div className="chat-welcome">
                <h2>{t('analysis.liveChat.title')}</h2>
              </div>
            )}

            <div className="chat-messages">
              {messages.map((msg, index) => (
                <div key={index} className={`chat-message ${msg?.type}`}>
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg?.text}</ReactMarkdown>
                </div>
              ))}
              {loading && (
                <div className="chat-message bot loading">
                  Typing<span className="dot">.</span><span className="dot">.</span><span className="dot">.</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <form className="chat-input-container" onSubmit={handleSendMessage}>
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder={t('analysis.liveChat.inputPlaceholder')}
                className="chat-input"
              />
              <button 
                type="submit" 
                className="send-button"
                disabled={loading}
                aria-label={t('analysis.liveChat.sendButton')}
              >
                <img src="/arrows-right.svg" alt="Arrow right" />
              </button>
            </form>
          </div>
          {!currentUser && (
            <div className="overlay-message">
              <img src="/padlock.svg" alt="Padlock" />
              <p>{t('analysis.history.pleaseLogin')}</p>
            </div>
          )}
        </div>
      );
    default:
      return null;
  }
};

export default MainContent;