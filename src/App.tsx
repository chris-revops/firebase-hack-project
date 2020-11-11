import React from "react";
import "./App.css";

import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { DealEditor } from "./DealEditor/DealEditor";
import { Home } from "./Home/Home";

function App() {
  return (
    <Router>
      <Route path="/" exact component={Home} />
      <Route path="/deal/:id" component={DealEditor} />
    </Router>
  );
}

export default App;
