import React, { useEffect, useState } from "react";
import { Button, Divider, Form, Message, Segment } from "semantic-ui-react";
import {
  FooterMessage,
  HeaderMessage,
} from "../components/common/WelcomeMessage";
import { loginUser } from "../utils/authUser";

const Login = () => {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [submitDisabled, setSubmitDisabled] = useState(true);

  const { email, password } = user;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setUser((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    const isUserValid = Object.values({ email, password }).every((item) =>
      Boolean(item)
    );

    setSubmitDisabled(!isUserValid);
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    await loginUser(user, setErrorMsg);
    setFormLoading(false);
  };
  return (
    <>
      <HeaderMessage />
      <Form
        loading={formLoading}
        error={errorMsg !== null}
        onSubmit={handleSubmit}
      >
        <Message
          error
          header="Oops!"
          content={errorMsg}
          onDismiss={() => setErrorMsg(null)}
        />
        <Segment>
          <Form.Input
            label="Email"
            placeholder="Email"
            name="email"
            value={email}
            onChange={handleChange}
            fluid
            icon="envelope"
            iconPosition="left"
            type="email"
            required
          />

          <Form.Input
            label="Password"
            placeholder="Password"
            name="password"
            value={password}
            onChange={handleChange}
            fluid
            icon={{
              name: "eye",
              circular: true,
              link: true,
              onClick: () => setShowPassword((prev) => !prev),
            }}
            iconPosition="left"
            type={showPassword ? "text" : "password"}
            required
          />

          <Divider hidden />
          <Button
            icon="signup"
            content="Login"
            type="submit"
            color="orange"
            disabled={submitDisabled}
          />
        </Segment>
      </Form>
      <FooterMessage />
    </>
  );
};

export default Login;
