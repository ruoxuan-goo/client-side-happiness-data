import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";

// navigation links

export default function Nav({ updateLoggedInState, loggedInState }) {

  var history = useHistory();

  function Logout() {
    updateLoggedInState(false)
    localStorage.removeItem('token');
    history.push("/login");
  }

  if (loggedInState) {
    /*login state*/
    return (
      <div className="spacenav">
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/rankings">Rankings</Link>
            </li>
            <li>
              <Link to="/search">Search</Link>
            </li>
            <li>
              <Link to="/factors">Factors</Link>
            </li>
          </ul>
        </nav>
        <nav>
          <ul>
            <li>
              <Link to="/login" onClick={Logout}>Logout</Link>
            </li>
          </ul>
        </nav>
      </div>
    );
  } else return (
    /*logout state*/
    <div className="spacenav">
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/rankings">Rankings</Link>
          </li>
          <li>
            <Link to="/search">Search</Link>
          </li>
        </ul>
      </nav>
      <nav>
        <ul>
          <li>
            <Link to="/register">Register</Link>
          </li>
          <li className="loginstyle">
            <Link to="/login">Login</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
