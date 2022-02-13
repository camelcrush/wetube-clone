import User from "../models/User";
import fetch from "node-fetch";
import bcrypt from "bcrypt";

export const getJoin = (req, res) => res.render("join", { pageTitle: "Join" });
export const postJoin = async (req, res) => {
  const { name, username, email, password, password2, location } = req.body;
  const pageTitle = "Join";
  if (password !== password2) {
    return res.status(400).render("join", {
      pageTitle,
      errorMessage: "Password Confirmation does not match",
    });
  }
  const exists = await User.exists({ $or: [{ username }, { email }] }); // $or operation: $or:[{},{}]
  if (exists) {
    return res.status(400).render("join", {
      pageTitle,
      errorMessage: "This username/email is already taken.",
    });
  }
  try {
    await User.create({
      name,
      username,
      email,
      password,
      location,
    });
    return res.redirect("/login");
  } catch (error) {
    return res
      .status(400)
      .render("join", { pageTitle, errorMessage: error._message });
  }
};
export const getLogin = (req, res) =>
  res.render("login", { pageTitle: "Login" });
export const postLogin = async (req, res) => {
  const { username, password } = req.body;
  const pageTitle = "Login";
  const user = await User.findOne({ username });
  if (!user) {
    return res.status(400).render("login", {
      pageTitle,
      errorMessage: "An account with this username does not exists.",
    });
  }
  const ok = await bcrypt.compare(password, user.password); // 사용자 입력 password와 db hash password와 비교
  if (!ok) {
    return res
      .status(400)
      .render("login", { pageTitle, errorMessage: "Wrong password" });
  }
  req.session.loggedIn = true; // session Id로 유저를 구별하여 그 세션에 로그인 정보를 저장
  req.session.user = user; // session에 유저 정보를 저장
  return res.redirect("/");
};

export const startGithubLogin = (req, res) => {
  const baseUrl = "https://github.com/login/oauth/authorize";
  const config = {
    client_id: process.env.GH_CLIENT,
    allow_signup: false,
    scope: "read:user user:email",
  };
  const params = new URLSearchParams(config).toString(); // 객체를 url params 문자열 형태로 전환하기
  const finalUrl = `${baseUrl}?${params}`;
  return res.redirect(finalUrl); // 클라이언트(사용자)를 github으로 보내기
};

export const finishGithubLogin = async (req, res) => {
  const baseUrl = "https://github.com/login/oauth/access_token";
  const config = {
    client_id: process.env.GH_CLIENT,
    client_secret: process.env.GH_SECRET,
    code: req.query.code,
  };
  // 클라이언트가 승인하면 깃헙에 등록한 callback 주소로 코드롤 보냄.
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  // 헤더에 포함해야먄 json 데이터를 받을 수 있음
  const tokenRequest = await // 받은 코드를 보내 access_token 요청을 함
  (
    await fetch(finalUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
    })
  ).json();
  if ("access_token" in tokenRequest) {
    const { access_token } = tokenRequest; // 받은 access_token을 보내서 유저 정보를 가져옴
    const apiUrl = "https://api.github.com";
    const userData = await // 유저정보 요청
    (
      await fetch(`${apiUrl}/user`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    const emailData = await (
      await fetch(`${apiUrl}/user/emails`, {
        // 유저정보에서 email이 private하기 때문에 다른 api 경로로 email 요청
        headers: { Authorization: `token ${access_token}` },
      })
    ).json();
    const emailObj = emailData.find(
      (email) => email.primary === true && email.verified === true // email array에서 해당 email 찾기
    );
    if (!emailObj) {
      return res.redirect("/login");
    }
    const existingUser = await User.findOne({ email: emailObj.email }); // 해당 email로 가입한 유저가 있는지 찾기
    if (existingUser) {
      // 유저가 있는 경우
      req.session.loggedIn = true;
      req.session.user = existingUser;
      return res.redirect("/");
    } else {
      // 유저가 없는 경우 생성
      const user = User.create({
        name: userData?.name,
        username: userData?.login,
        email: emailObj?.email,
        password: "",
        socialOnly: true,
        location: userData?.location,
      });
      req.session.loggedIn = true;
      req.session.user = user;
      return res.redirect("/");
    }
  } else {
    return res.redirect("/login");
  }
};

export const edit = (req, res) => res.send("Edit User");
export const remove = (req, res) => res.send("Remove User");
export const logout = (req, res) => res.send("Log out");
export const see = (req, res) => res.send("See User");
