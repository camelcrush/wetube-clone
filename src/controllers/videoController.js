import Video from "../models/Video"; // 모델 import

export const home = (req, res) => {
  console.log("Start");
  Video.find({}, (error, videos) => {
    // model.find({}, callback): {}은 찾기조건인데 여기서는 모든 데이터를 찾고 함수를 실행한다는 것을 의미
    console.log("Finished");
    return res.render("home", { pageTitle: "Home", videos }); // callback에서 return을 함으로써 먼저 db로부터 데이터를 불러오고 난 후에 렌더링을 함
  });
  console.log("I finish first");
};
export const watch = (req, res) => {
  const { id } = req.params;
  return res.render("watch", { pageTitle: `Watching` });
};
export const getEdit = (req, res) => {
  const { id } = req.params;
  return res.render("edit", { pageTitle: `Editing` });
};
export const postEdit = (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  return res.redirect(`/videos/${id}`);
};

export const getUpload = (req, res) => {
  return res.render("upload", { pageTitle: "Upload Video" });
};

export const postUpload = (req, res) => {
  const { title } = req.body;
  return res.redirect("/");
};
