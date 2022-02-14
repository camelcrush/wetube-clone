export const localsMiddleware = (req, res, next) => {
  res.locals.loggedIn = Boolean(req.session.loggedIn); // 로그인 정보를 브라우저 로컬 저장소에 저장
  res.locals.loggedInUser = req.session.user || {}; // 유저정보를 브라우저 로컬 저장소에 저장 // or 연산자 ||
  res.locals.siteName = "Wetube";
  next();
};

export const protectorMiddleware = (req, res, next) => {
  // 로그인 사용자만 쓰는 미들웨어
  if (req.session.loggedIn) {
    return next();
  } else {
    return res.redirect("/login");
  }
};

export const publicOnlyMiddleware = (req, res, next) => {
  // 비로그인 사용자만 쓰는 미들웨어
  if (!req.session.loggedIn) {
    return next();
  } else {
    return res.redirect("/");
  }
};
