const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");

const handleSubmit = (event) => {
  event.preventDefault();
  const textarea = form.querySelector("textarea"); // 로그인이 안됫을 때 pug에 엘리먼트가 존재하지않으므로 오류가 나서 수정
  const text = textarea.value;
  if (text === "") {
    return;
  }
  const videoId = videoContainer.dataset.id;
  // 헤더에 json data라고 적어서 express에 알려줘야 함
  fetch(`/api/videos/${videoId}/comment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });
  textarea.value = "";
};

if (form) {
  // 로그인이 안됫을 때 pug에 엘리먼트가 존재하지않으므로 오류가 나서 수정
  form.addEventListener("submit", handleSubmit);
}
