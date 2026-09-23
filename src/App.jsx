// import React from "react";
import { HashRouter, Routes, Route, NavLink } from "react-router-dom";
import OpportunityList from "./components/OpportunityList";
import AddOpportunity from "./components/AddOpportunity";
import NotFound from "./components/NotFound";
import "./App.css";

function App() {
  return (
    <HashRouter>
      <div className="app-wrapper">
        {/* Global Application Navbar header */}
        <header className="global-header">
          <h1>Career Opportunity Portal</h1>
          <nav className="global-nav">
            {/* 🟢 Using NavLink automatically toggles the .active CSS class based on matching URLs */}
            <NavLink to="/" className="global-nav-link" end>
              Browse Items
            </NavLink>
            <NavLink to="/shortlist" className="global-nav-link">
              My Shortlist
            </NavLink>
            <NavLink to="/add-opportunity" className="global-nav-link">
              ＋ Add Opportunity
            </NavLink>
          </nav>
        </header>

        {/* Dynamic Route Switching Main Container Workspace */}
        <main className="app-main">
          <Routes>
            <Route
              path="/"
              element={<OpportunityList viewMode="available" />}
            />
            <Route
              path="/opportunity-details/:id"
              element={<OpportunityList viewMode="available" />}
            />

            <Route
              path="/shortlist"
              element={<OpportunityList viewMode="shortlist" />}
            />
            <Route
              path="/shortlist/opportunity-details/:id"
              element={<OpportunityList viewMode="shortlist" />}
            />

            <Route path="/add-opportunity" element={<AddOpportunity />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </HashRouter>
  );
}

export default App;
