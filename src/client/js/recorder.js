const startBtn = document.getElementById("startBtn");
const video = document.getElementById("preview");

const handleStart = async () => {
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: true,
  });
  video.srcObject = stream; // src는 url, srcObj는 객체 또는 다른 형식 데이터를 취함.
  video.play();
};

startBtn.addEventListener("click", handleStart);
