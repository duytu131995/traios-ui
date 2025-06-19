import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComments } from '@fortawesome/free-solid-svg-icons';

const ChatIcon = ({ onClick }) => {
    return (
        <div className="chat-icon-container">
            <div className="chat-tooltip">Need help? Start a chat with manager<br/> to discusion about latest analysis!</div>
            <div className="chat-icon" onClick={onClick}>
                <FontAwesomeIcon icon={faComments} size="2x" />
            </div>
        </div>
    );
};

export default ChatIcon;
