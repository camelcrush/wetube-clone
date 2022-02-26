import { async } from "regenerator-runtime";

const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");

const addComment = (text, id) => {
  // js로 코멘트 추가하기 like realtime
  const videoComments = document.querySelector(".video__comments ul");
  const newComment = document.createElement("li");
  newComment.dataset.id = id; // 코멘트 id 추가하기
  newComment.className = "video__comment"; // 같은 css 적용을 위해
  const icon = document.createElement("i");
  icon.className = "fas fa-comment";
  const span = document.createElement("span");
  span.innerText = `  ${text}`;
  const span2 = document.createElement("span");
  span.innerText = " ❌";
  newComment.appendChild(icon);
  newComment.appendChild(span);
  newComment.appendChild(span2);
  videoComments.prepend(newComment); // 앞으로 달기
};

const handleSubmit = async (event) => {
  event.preventDefault();
  const textarea = form.querySelector("textarea"); // 로그인이 안됫을 때 pug에 엘리먼트가 존재하지않으므로 오류가 나서 수정
  const text = textarea.value;
  if (text === "") {
    return;
  }
  const videoId = videoContainer.dataset.id;
  // 헤더에 json data라고 적어서 express에 알려줘야 함
  // response.status
  const response = await fetch(`/api/videos/${videoId}/comment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });
  textarea.value = "";
  if (response.status === 201) {
    const { newCommentId } = await response.json();
    addComment(text, newCommentId);
  }
};

if (form) {
  // 로그인이 안됫을 때 pug에 엘리먼트가 존재하지않으므로 오류가 나서 수정
  form.addEventListener("submit", handleSubmit);
}
