import React, { useState } from 'react';
import Login from './components/Login';
import 'bootstrap/dist/css/bootstrap.min.css';
import KanbanWindow from './components/KanbanWindow';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <div className="container-fluid">
      {!isAuthenticated ? (
        <Login onLogin={() => setIsAuthenticated(true)} />
      ) : (
        <KanbanWindow onLogout={() => setIsAuthenticated(false)} />
      )}
    </div>
  );
}

export default App;
