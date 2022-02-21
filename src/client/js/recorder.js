const startBtn = document.getElementById("startBtn");
const video = document.getElementById("preview");

let stream;
let recorder;

const handleDownload = () => {};

const handleStop = () => {
  startBtn.innerText = "Download Recording";
  startBtn.removeEventListener("click", handleStop);
  startBtn.addEventListener("click", handleDownload);

  recorder.stop();
  // stop은 ondataavailable 이벤트를 발생 시키고 blop(video file)을 반환함
};

const handleStart = () => {
  startBtn.innerText = "Stop Recording";
  startBtn.removeEventListener("click", handleStart);
  startBtn.addEventListener("click", handleStop);

  recorder = new MediaRecorder(stream); // stream을 받아 recording
  recorder.ondataavailable = (event) => {
    // stop이 실행되면 발동
    const videoFile = URL.createObjectURL(event.data); // event.data = blop(file)을 가지고 URL형식으로 브라우저 메모리에 저장하여 파일에 접근할 수 있음
    video.srcObject = null; // preview 제거
    video.src = videoFile; // 녹화파일 추가
    video.loop = true; // loop 설정
    video.play();
  };
  recorder.start();
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
