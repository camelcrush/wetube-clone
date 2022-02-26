import multer from "multer";
import multerS3 from "multer-s3";
import aws from "aws-sdk";

// aws s3-sdk 로 엑세스 key 설정
const s3 = new aws.S3({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS,
    secretAccessKey: process.env.AWS_SECRET,
  },
});

// multer-s3: s3 전용 multer
// acl: access control list: 객체에 대한 권한 설정
const multerUploader = multerS3({
  s3: s3,
  acl: "public-read",
  bucket: "wetube-camelcrush",
});

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
    req.flash("error", "Login first");
    return res.redirect("/login");
  }
};

export const publicOnlyMiddleware = (req, res, next) => {
  // 비로그인 사용자만 쓰는 미들웨어
  if (!req.session.loggedIn) {
    return next();
  } else {
    req.flash("error", "Not authorized");
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
  storage: multerUploader,
});
export const videoUpload = multer({
  dest: "uploads/videos",
  limits: {
    fileSize: 100000000,
  },
  storage: multerUploader,
});
