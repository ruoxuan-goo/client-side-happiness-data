import React from "react";
import { Input, FormGroup, Form, Label, Button } from "reactstrap";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
import jwt from "jsonwebtoken";

const API_URL = "http://131.181.190.87:3000"

export default function Login({updateLoggedInState}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(null);
  const [error, setError] = useState(null);

  var history = useHistory();

  /*get JWT token*/
  async function login() {
    const url = `${API_URL}/user/login`


    return await fetch(url, {
      method: "POST",
      headers: { accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({ email: email, password: password })
    })
      .then((res) => {
        var data = res.json()
        return data;
      })
      .then((res) => {
        if (res.error === true) { throw res }
        console.log(jwt.decode(res.token))
        localStorage.setItem("token", res.token)
        updateLoggedInState(true)
        history.push("/")
      })
      .catch((e) => {
        console.log(e.message);
        setError(e.message);
      });
  }

  /* login form */
  return (
    <div className="container">
      <Form className="login_form" onSubmit={(event) => { event.preventDefault(); }} >
        <h1>Login</h1>

        <FormGroup>
          <Label htmlFor="email">Email: </Label>
          <Input
            type="email"
            name="email"
            id="email"
            required="required"
            placeholder="Enter Email..."
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="password">Password: </Label>
          <Input
            type="password"
            name="password"
            id="password"
            required="required"
            placeholder="Enter Password..."
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </FormGroup>

        <p style={{ color: "red", fontSize: "12px" }}>{error}</p>
        <Button type="submit" onClick={(login)}>Login</Button>
        <br></br>
        <p style={{
          color: "grey",
          fontSize: "14px",
          margin: "30px 0px",
          textAlign: "center"
        }}>Don't have an account? <Link to="/Register">Register</Link> now! </p>
      </Form>
    </div>
  )
}
