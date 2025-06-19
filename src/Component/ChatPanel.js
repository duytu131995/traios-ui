import React, { useState, useEffect, useRef } from 'react';
import appConfig from '../appConfig';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useAuth } from '../contexts/AuthContext';

const ChatPanel = ({ asset, showGuide, setShowGuide, lang }) => {
    const { currentUser, logout } = useAuth();
    const [messages, setMessages] = useState(() => {
        return JSON.parse(localStorage.getItem('chatMessages')) || [];
    });
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const hasGuideBeenAdded = useRef(false); 

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
        if (showGuide && !hasGuideBeenAdded.current) {
            const guideMessage = {
                en: {
                    type: 'bot',
                    text: `Hello! I'm here to help you understand my latest analysis of ${asset}. Here are some example questions you might ask:\n\n- Why is ${asset} still going up?\n- What sentiment and technical factors make you think it's a good idea to go Long on ${asset}?`,
                },
                vi: {
                    type: 'bot',
                    text: `Xin chào! Tôi ở đây để giúp bạn hiểu rõ hơn về phân tích mới nhất của tôi về ${asset}. Dưới đây là một số câu hỏi ví dụ mà bạn có thể tham khảo:\n\n- Tại sao ${asset} tăng giá?\n- Những yếu tố tâm lý thị trường và kỹ thuật nào khiến bạn nghĩ rằng nên Long ${asset}?`,
                }
            };

            if (
                messages.length === 0 || // No messages yet
                ( messages[messages.length - 1].type !== 'bot' && // Last message isn't a bot message
                messages[messages.length - 1].text !== guideMessage[lang] ) // Last bot message isn't the guide
            ) {
                setMessages((prevMessages) => [...prevMessages, guideMessage[lang]]);
                hasGuideBeenAdded.current = true; // Mark the guide as added
                setShowGuide(false); // Reset the showGuide flag
            }

        }
    }, [showGuide, asset, setShowGuide, hasGuideBeenAdded]);

    const handleSend = async () => {
        const token = localStorage.getItem('authToken');
        if (!input) return;
    
        const userMessage = { type: 'user', text: input };
        setMessages([...messages, userMessage]);
        setInput('');
        setLoading(true);
    
        try {
            // Select the newest 4 messages, excluding the guide message
            const recentMessages = messages
                .filter((msg) => msg.text && typeof msg.text === 'string' && !msg.text.includes('Hello!') && !msg.text.includes('Xin chào!')) // Adjust based on your guide message content
                .slice(-4); // Select the last 3 messages

            const response = await fetch(`${appConfig.API_BASE_URL}/chat/chat_w_manager`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ 
                    asset: asset, 
                    question: input,
                    messageslog: recentMessages, // Include the selected messages
                }),
            });
    
            const data = await response.json();
            const botMessage = { type: 'bot', text: data.answer };
            setMessages((prevMessages) => [...prevMessages, botMessage]);
        } catch (error) {
            const errorMessage = { type: 'bot', text: 'Sorry, something went wrong.' };
            setMessages((prevMessages) => [...prevMessages, errorMessage]);
        } finally {
            setLoading(false);
        }
    };
    

    return (
        <div className={`chat-panel ${!currentUser ? "overlay-content" : "non-overlay-content"}`}>
            <div className="chat-header">
                <img src="/logo-chat.svg" alt="Logo Chat" />
                <div className="chat-title">
                    <span>TraiOS</span>
                    <span>Crypto Futures</span>
                </div>
                {/* <h3>Chat with Manager about {asset.toUpperCase()}</h3> */}
            </div>
            <div className="chat-messages">
                {messages.map((msg, index) => (
                    <div key={index} className={`chat-message ${msg.type}`}>
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.text}</ReactMarkdown>
                    </div>
                ))}
                {loading && (
                    <div className="chat-message bot loading">
                        Typing<span className="dot">.</span><span className="dot">.</span><span className="dot">.</span>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
            <div className="chat-input">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={`Ask about ${asset}...`}
                />
                <button onClick={handleSend} disabled={loading}>
                    <img src="/button-send.svg" alt="Button Send"/>
                </button>
            </div>
        </div>
    );
};

export default ChatPanel;
