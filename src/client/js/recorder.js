const startBtn = document.getElementById("startBtn");
const video = document.getElementById("preview");

let stream;

const handleStop = () => {
  startBtn.innerText = "Start Recording";
  startBtn.removeEventListener("click", handleStop);
  startBtn.addEventListener("click", handleStart);
};

const handleStart = () => {
  startBtn.innerText = "Stop Recording";
  startBtn.removeEventListener("click", handleStart);
  startBtn.addEventListener("click", handleStop);

  const recorder = new MediaRecorder(stream); // stream을 받아 recording
  recorder.ondataavailable = (e) => {
    // stop이 실행되면 발동
    console.log(e);
    console.log(e.data);
  };
  recorder.start();
  setTimeout(() => {
    recorder.stop();
    // stop은 ondataavailable 이벤트를 발생 시키고 blop(video file)을 반환함
  }, 10000);
};

const init = async () => {
  stream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: true,
  });
  video.srcObject = stream; // src는 url, srcObj는 객체 또는 다른 형식 데이터를 취함.
  video.play();
};

init();

startBtn.addEventListener("click", handleStart);
