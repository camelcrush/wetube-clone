const path = require("path");

module.exports = {
  entry: "./src/client/js/main.js", // src에 있는 변환할 코드
  mode: "development", // mode: dev인지 product인지에 따라 컴파일되는 코드 결과가 달라짐, 개발중일 땐 개발 모드
  output: {
    // 결과물
    filename: "main.js",
    path: path.resolve(__dirname, "assets", "js"), // 절대경로(full 주소)... path.resolve()는 경로를 만들어줌
  },
  module: {
    rules: [
      {
        test: /\.js$/, // 정규표현식: 모든 js파일
        use: {
          loader: "babel-loader", // 최신 js를 쓰기 위해 babel-loader를 설정
          options: {
            presets: [["@babel/preset-env", { targets: "defaults" }]],
          },
        },
      },
      {
        test: /\.scss$/,
        use: ["style-loader", "css-loader", "sass-loader"], // webpack은 배열의 역순으로 컴파일함
      },
    ],
  },
};
