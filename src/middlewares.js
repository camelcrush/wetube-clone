import multer from "multer";

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

// multer Middleware: 파일을 uploads에 저장하고 그에 대하 정보를 컨트롤러에 넘겨줌 req.file에서 확인할 수 있음
// Limit fileSize: 설정크키 byte
export const avatarUpload = multer({
  dest: "uploads/avatars",
  limits: {
    fileSize: 3000000,
  },
});
export const videoUpload = multer({
  dest: "uploads/videos",
  limits: {
    fileSize: 100000000,
  },
});
