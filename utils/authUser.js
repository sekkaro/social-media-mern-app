import axios from "axios";
import catchErrors from "./catchErrors";
import Router from "next/router";
import cookie from "js-cookie";

export const registerUser = async (user, profilePicUrl, setError) => {
  try {
    const res = await axios.post(`${process.env.BASE_URL}/api/signup`, {
      user,
      profilePicUrl,
    });
    setToken(res.data);
  } catch (err) {
    catchErrors(err, setError);
  }
};

export const loginUser = async (user, setError) => {
  try {
    const res = await axios.post(`${process.env.BASE_URL}/api/auth`, {
      user,
    });
    setToken(res.data);
  } catch (err) {
    catchErrors(err, setError);
  }
};

export const redirectUser = (ctx, location) => {
  if (ctx.req) {
    ctx.res.writeHead(302, { Location: location });
    ctx.res.end();
  } else {
    Router.push(location);
  }
};

const setToken = (token) => {
  cookie.set("token", token);
  Router.push("/");
};
