const MiniCssExtractPlugin = require("mini-css-extract-plugin"); // js로부터 css를 추출하는 플러그인
const path = require("path");

module.exports = {
  entry: {
    // 여러 js 파일 소스 설정
    main: "./src/client/js/main.js",
    videoPlayer: "./src/client/js/videoPlayer.js",
  }, // src에 있는 변환할 코드
  mode: "development", // mode: dev인지 product인지에 따라 컴파일되는 코드 결과가 달라짐, 개발중일 땐 개발 모드
  watch: true, // watch
  plugins: [
    new MiniCssExtractPlugin({
      filename: "css/styles.css",
    }),
  ],
  output: {
    // 결과물
    filename: "js/[name].js", // name은 entry 키값을 폴더명으로 output.js 생성
    path: path.resolve(__dirname, "assets"), // 절대경로(full 주소)... path.resolve()는 경로를 만들어줌
    clean: true, // 빌드할 때 기존 것을 삭제한 후 다시 컴파일 설정
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
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"], // webpack은 배열의 역순으로 컴파일함
      },
    ],
  },
};
