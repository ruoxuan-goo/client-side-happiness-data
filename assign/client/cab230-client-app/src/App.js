import React, { useEffect, useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";


// components
import Header from "./components/Header";
import Footer from "./components/Footer";

// pages
import Home from "./pages/Home";
import Rankings from "./pages/Rankings";
import Search from "./pages/Search";
import Factors from "./pages/Factors";
import Register from "./pages/Register";
import Login from "./pages/Login";

export default function App() {

  const [loggedIn, setLoggedIn] = useState(false);
 
  const updateLoggedInState = (update) => {
    setLoggedIn(update)
  }

  return (
    <Router>
      <div className="App">
        <Header updateLoggedInState={updateLoggedInState} loggedInState={loggedIn}/>
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/rankings">
            <Rankings />
          </Route>
          <Route path="/search">
            <Search />
          </Route>
          <Route path="/factors">
            <Factors />
          </Route>
          <Route path="/register">
            <Register />
          </Route>
          <Route path="/login">
            <Login updateLoggedInState={updateLoggedInState}/>
          </Route>
        </Switch>
        <Footer />
      </div>
    </Router>
  );
}
