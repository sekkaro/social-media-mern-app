import React, { useEffect, useRef, useState } from "react";
import { Button, Divider, Form, Message, Segment } from "semantic-ui-react";
import axios from "axios";

import CommonInputs from "../components/common/CommonInputs";
import ImageDropDiv from "../components/common/ImageDropDiv";
import {
  FooterMessage,
  HeaderMessage,
} from "../components/common/WelcomeMessage";
import { regexUserName } from "../utils/constants";
import { uploadPic } from "../utils/uploadPicToCloudinary";
import { registerUser } from "../utils/authUser";
let cancel;

const Signup = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    bio: "",
    facebook: "",
    youtube: "",
    twitter: "",
    instagram: "",
  });
  const [showSocialLinks, setShowSocialLinks] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [submitDisabled, setSubmitDisabled] = useState(true);

  const [username, setUsername] = useState("");
  const [usernameLoading, setUsernameLoading] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState(false);

  const [media, setMedia] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [highlighted, setHighlighted] = useState(false);
  const inputRef = useRef();
  const { name, email, password, bio } = user;

  useEffect(() => {
    const isUserValid = Object.values({ name, email, password, bio }).every(
      (item) => Boolean(item)
    );

    setSubmitDisabled(!isUserValid);
  }, [user]);

  const checkUsername = async () => {
    setUsernameLoading(true);
    try {
      cancel && cancel();
      const CancelToken = axios.CancelToken;
      const res = await axios.get(
        `${process.env.BASE_URL}/api/signup/${username}`,
        {
          cancelToken: new CancelToken((canceler) => (cancel = canceler)),
        }
      );
      if (res.data === "Available" && username) {
        setErrorMsg(null);
        setUsernameAvailable(true);
        setUser((prev) => ({ ...prev, username }));
      }
    } catch (err) {
      if (username) {
        setErrorMsg("Username Not Available");
        setUsernameAvailable(false);
      }
    }
    setUsernameLoading(false);
  };

  useEffect(() => {
    checkUsername();
  }, [username]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "media") {
      setMedia(files[0]);
      setMediaPreview(URL.createObjectURL(files[0]));
    }

    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    let profilePicUrl;
    if (media) {
      profilePicUrl = await uploadPic(media);
      if (!profilePicUrl) {
        setFormLoading(false);
        return setErrorMsg("Error Uploading Image");
      }
    }

    await registerUser(user, profilePicUrl, setErrorMsg, setFormLoading);
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
          <ImageDropDiv
            mediaPreview={mediaPreview}
            setMediaPreview={setMediaPreview}
            setMedia={setMedia}
            inputRef={inputRef}
            highlighted={highlighted}
            setHighlighted={setHighlighted}
            handleChange={handleChange}
          />
          <Form.Input
            label="Name"
            placeholder="Name"
            name="name"
            value={name}
            onChange={handleChange}
            fluid
            icon="user"
            iconPosition="left"
            required
          />

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

          <Form.Input
            loading={usernameLoading}
            error={!usernameAvailable}
            label="Username"
            placeholder="Username"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              setUsernameAvailable(regexUserName.test(e.target.value));
            }}
            fluid
            icon={usernameAvailable ? "check" : "close"}
            iconPosition="left"
            required
          />

          <CommonInputs
            user={user}
            showSocialLinks={showSocialLinks}
            setShowSocialLinks={setShowSocialLinks}
            handleChange={handleChange}
          />

          <Divider hidden />
          <Button
            icon="signup"
            content="signup"
            type="submit"
            color="orange"
            disabled={submitDisabled || !usernameAvailable}
          />
        </Segment>
      </Form>
      <FooterMessage />
    </>
  );
};

export default Signup;
