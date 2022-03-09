import React from "react";
import Nav from "./Nav";

// the header
export default function Header({updateLoggedInState, loggedInState}) {
  return (
    <header>
      <Nav updateLoggedInState={updateLoggedInState} loggedInState={loggedInState}/>
    </header>
  );
}
