import './Chat.css';
import React, { useState } from "react";
import ChatIcon from './ChatIcon';
import ChatPanel from './ChatPanel';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';

const Chat = ({ asset, lang }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [showGuide, setShowGuide] = useState(false);
    const { currentUser, logout } = useAuth();
    const { t, i18n } = useTranslation();

    const toggleChat = () => {
        setIsOpen(!isOpen);

        // Show guide message when chat is opened
        if (!isOpen) {
            setShowGuide(true);
        }
    };

    return (
        <>
            <ChatIcon onClick={toggleChat} />
            {isOpen && (
                <div className="chat-panel">
                    {/* Add chat content here */}
                    <div className="chat-panel-1">
                        <ChatPanel asset={asset} showGuide={showGuide} setShowGuide={setShowGuide} lang={lang}/>
                        <button className="close-chat" onClick={toggleChat}>
                            <FontAwesomeIcon icon={faTimes} />
                        </button>
                        {!currentUser && (
                          <div className="overlay-message">
                            <div className="overlay-message-item">
                                <img src="/padlock.svg" alt="Padlock" />
                                <p>{t('analysis.history.pleaseLogin')}</p>
                            </div>
                          </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default Chat;
