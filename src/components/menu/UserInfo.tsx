import React from 'react';

type UserInfoProps = {
  userName: string;
  onLogout: () => void;
};

const UserInfo: React.FC<UserInfoProps> = ({ userName, onLogout }) => {
  return (
    <div className="user-info">
      <h2 className="user-name">{userName}</h2>
      <button className="btn btn-exit" onClick={onLogout}>Выйти</button>
    </div>
  );
};

export default UserInfo;
