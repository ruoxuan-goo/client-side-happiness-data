import React from "react";
import { Input, FormGroup, Form, Button, Label } from "reactstrap";
import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";

const API_URL = "http://131.181.190.87:3000"

export default function Login({ history }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(null);
  const [retypePassword, setRetypePassword] = useState(null);
  const [error, setError] = useState(null);

  var history = useHistory();

  async function register() {
    const url = `${API_URL}/user/register`

    function validateEmail(email) {
      const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(email).toLowerCase());
    }

    if (validateEmail) {
      if (password === retypePassword) {
        setError(null)

        /*get JWT token*/
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
            localStorage.setItem("token", res.token)
            console.log(res)
            history.push("/Login")
          })
          .catch((e) => {
            console.log(e.message);
            setError(e.message);
          });
      }
      else {
        setError("The password you entered do not match.")
      }
    } else { setError("The email you entered is not valid.") }
  }

  /*register form*/
  return (
    <div className="container">
      <Form className="login_form" onSubmit={(event) => { event.preventDefault(); }} >
        <h1>Register</h1>
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

        <FormGroup>
          <Label htmlFor="password">Re-enter Password: </Label>
          <Input
            type="password"
            name="password"
            id="password"
            required="required"
            placeholder="Re-enter Password..."
            value={retypePassword}
            onChange={(event) => setRetypePassword(event.target.value)}
          />
        </FormGroup>

        <p style={{ color: "red", fontSize: "12px" }}>{error}</p>
        <Button type="submit" onClick={register}>Register</Button>
        <br></br>
        <p style={{
          color: "grey",
          fontSize: "14px",
          margin: "30px 0px",
          textAlign: "center"
        }}>Have an account already? <Link to="/Login">Login</Link> to continue</p>
      </Form>
    </div>
  )
}
