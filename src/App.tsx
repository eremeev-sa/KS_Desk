import React, { useState } from 'react';
import Login from './containers/Login';
import 'bootstrap/dist/css/bootstrap.min.css';
import KanbanWindow from './containers/KanbanWindow';


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
