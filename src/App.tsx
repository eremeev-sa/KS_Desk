import React, { useState } from 'react';
import Login from './containers/Login';
import 'bootstrap/dist/css/bootstrap.min.css';
import KanbanWindow from './containers/KanbanWindow';
import { UserProvider } from './context/UserContext';


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState("");



  return (
    <UserProvider>
      <div className="container-fluid">
        {!isAuthenticated ? (
          <Login onLogin={() => setIsAuthenticated(true)} />
        ) : (
          <KanbanWindow onLogout={() => setIsAuthenticated(false)} />
        )}
      </div>
    </UserProvider>
  );
}

export default App;
