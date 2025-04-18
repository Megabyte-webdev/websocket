import React, { useEffect, useRef } from 'react';
import useWebSocket from 'react-use-websocket';
import throttle from 'lodash.throttle';
import { Cursor } from './Cursor';

const renderCursors = users => {
  return Object.keys(users).map(uuid => {
    const user = users[uuid];
    return (
      <Cursor key={uuid} user={user.username || "User"} point={[user.state.x, user.state.y]} />
    );
  });
};

const renderUsersList = users => {
  return (
    <ul className="users-list">
      {Object.keys(users).map(uuid => {
        const user = users[uuid];
        return (
          <li key={uuid}>
            <strong>{user.username || 'Anonymous'}:</strong>{' '}
            {`x: ${user.state.x}, y: ${user.state.y}`}
          </li>
        );
      })}
    </ul>
  );
};

const Home = ({ username }) => {
  const WS_URL = 'ws://localhost:8000';
  const { sendJsonMessage, lastJsonMessage } = useWebSocket(WS_URL, {
    queryParams: { username }
  });

  const THROTTLE = 50;
  const sendJsonMessageThrottled = useRef(throttle(sendJsonMessage, THROTTLE));

  useEffect(() => {
    sendJsonMessage({ x: 0, y: 0 });

    const handleMouseMove = e => {
      sendJsonMessageThrottled.current({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="home-container">
      <h1 className="welcome-title">Hey, {username} 👋</h1>
      <p className="tip">Move your mouse around to share your cursor position in real-time.</p>

      {lastJsonMessage ? (
        <>
          {renderCursors(lastJsonMessage)}
          <div className="user-list-container">
            <h2>Online Users</h2>
            {renderUsersList(lastJsonMessage)}
          </div>
        </>
      ) : (
        <p>Connecting to WebSocket...</p>
      )}
    </div>
  );
};

export default Home;
