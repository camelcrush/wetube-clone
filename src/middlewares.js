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
// 헤로쿠에서의 환경변수 값 (로컬에서는 없음)
const isHeroku = process.env.NODE_ENV === "production";

// multer-s3: s3 전용 multer
// acl: access control list: 객체에 대한 권한 설정
const s3ImageUploader = multerS3({
  s3: s3,
  acl: "public-read",
  bucket: "wetube-camelcrush/images",
});
// s3 multer uploader 폴더 생성 및 따로 적용
const s3VideoUploader = multerS3({
  s3: s3,
  acl: "public-read",
  bucket: "wetube-camelcrush/videos",
});

export const localsMiddleware = (req, res, next) => {
  res.locals.loggedIn = Boolean(req.session.loggedIn); // 로그인 정보를 브라우저 로컬 저장소에 저장
  res.locals.loggedInUser = req.session.user || {}; // 유저정보를 브라우저 로컬 저장소에 저장 // or 연산자 ||
  res.locals.siteName = "Wetube";
  res.locals.isHeroku = isHeroku;
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
  dest: "uploads/avatars", // storage 옵션이 있을 땐 무시 됨
  limits: {
    fileSize: 3000000,
  },
  storage: isHeroku ? s3ImageUploader : undefined, // heroku === "production" 일 때만 s3업로더 사용하기, undefined이면 dest(로컬) 사용
});
export const videoUpload = multer({
  dest: "uploads/videos",
  limits: {
    fileSize: 100000000,
  },
  storage: isHeroku ? s3VideoUploader : undefined,
});

// s3 아바타 이미지 삭제하기
export const s3DeleteAvatarMiddleware = (req, res, next) => {
  if (!req.file) {
    next();
  }
  if (!req.session.user.avatarUrl) {
    next();
  }
  s3.deleteObject(
    {
      Bucket: "wetube-camelcrush",
      Key: `images/${req.session.user.avatarUrl.split("/")[3]}`,
    },
    (err, data) => {
      if (err) {
        throw err;
      }
    }
  );
  next();
};
