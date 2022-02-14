export const localsMiddleWare = (req, res, next) => {
  res.locals.loggedIn = Boolean(req.session.loggedIn); // 로그인 정보를 브라우저 로컬 저장소에 저장
  res.locals.loggedInUser = req.session.user || {}; // 유저정보를 브라우저 로컬 저장소에 저장 // or 연산자 ||
  res.locals.siteName = "Wetube";
  next();
};
