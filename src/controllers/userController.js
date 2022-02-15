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
  const user = await User.findOne({ username, socialOnly: false });
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
    let user = await User.findOne({ email: emailObj.email }); // 해당 email로 가입한 유저가 있는지 찾기
    if (!user) {
      // 유저가 없는 경우 생성
      user = await User.create({
        avatartUrl: userData?.avatar_url,
        name: userData?.name,
        username: userData?.login,
        email: emailObj?.email,
        password: "",
        socialOnly: true,
        location: userData?.location,
      });
    }
    req.session.loggedIn = true;
    req.session.user = user;
    return res.redirect("/");
  } else {
    return res.redirect("/login");
  }
};
export const logout = (req, res) => {
  req.session.destroy(); // 세션 삭제 logout
  return res.redirect("/");
};

export const getEdit = (req, res) => {
  return res.render("edit-profile", { pageTitle: "Edit Profile" });
};
export const postEdit = async (req, res) => {
  const {
    session: {
      user: { _id },
    },
    body: { name, email, username, location },
  } = req;
  const updatedUser = await User.findByIdAndUpdate(
    _id,
    {
      name,
      email,
      username,
      location,
    },
    { new: true } // new 옵션을 통해 findbyIdAndUpdate는 업데이트돈 유저를 반환한다. default는 업데이트 되기 전
  );
  req.session.user = updatedUser; // 세션에 유저 업데이트 해주기
  return res.render("edit-profile");
};

export const getChangePassword = (req, res) => {
  if (req.session.user.socialOnly === true) {
    // 소셜로그인 유저는 비밀번호를 바꿀 수 없으므로 redirect
    return res.redirect("/");
  }
  return res.render("users/change-password", { pageTitle: "Change Password" });
};
export const postChangePassword = async (req, res) => {
  const {
    session: {
      user: { _id },
    },
    body: { oldPassword, newPassword, newPasswordConfirmation },
  } = req;
  const user = await User.findById(_id);
  const ok = await bcrypt.compare(oldPassword, user.password); // db password와 사용자 입력 password 비교
  if (!ok) {
    return res.status(400).render("users/change-password", {
      pageTitle: "Change Password",
      errorMessage: "The current password is incorrect",
    });
  }
  if (newPassword !== newPasswordConfirmation) {
    return res.status(400).render("users/change-password", {
      pageTitle: "Change Password",
      errorMessage: "The password does not match the confirmation",
    });
  }
  user.password = newPassword;
  await user.save(); // save()를 써서 userSchem.pre("save")를 발동시킬 수 있음.
  req.session.destroy(); // 세션 삭제
  return res.redirect("/users/logout");
};
export const remove = (req, res) => res.send("Remove User");
export const see = (req, res) => res.send("See User");
