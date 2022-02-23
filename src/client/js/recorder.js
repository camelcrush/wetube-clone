import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";

const actionBtn = document.getElementById("actionBtn");
const video = document.getElementById("preview");

let stream;
let recorder;
let videoFile;

const files = {
  input: "recording.webm",
  output: "output.mp4",
  thumb: "thumbnail.jpg",
};

const downloadFile = (fileUrl, fileName) => {
  const a = document.createElement("a");
  a.href = fileUrl;
  a.download = fileName; // a의 다운로드 기능
  document.body.appendChild(a);
  a.click(); // 사용자가 클릭한 것처럼 할 수 있음
};

const handleDownload = async () => {
  // 변환중 유저가 다시 다운로드 버튼 못 누르도록 바꾸기
  actionBtn.removeEventListener("click", handleDownload);
  actionBtn.innerText = "Transcoding...";
  actionBtn.disabled = true;

  // ffmpeg 생성: ffmpeg는 브라우저에서 사용자 pc를 사용하여 비디오를 converting하는 software
  const ffmpeg = createFFmpeg({
    corePath: "https://unpkg.com/@ffmpeg/core@0.10.0/dist/ffmpeg-core.js",
    log: true,
  });
  await ffmpeg.load(); // 사용자가 사용하기 때문에 preload

  // FS(filse system): 파일시스템에 blob 파일을 받아 파일 생성
  ffmpeg.FS("writeFile", files.input, await fetchFile(videoFile));

  // mp4로 converting
  await ffmpeg.run("-i", files.input, "-r", "60", files.output);
  await ffmpeg.run(
    "-i",
    files.input,
    "-ss",
    "00:00:01",
    "-frames:v",
    "1",
    files.thumb
  );

  // 파일시스템으로부터 mp4 output 불러오기(binary data)
  const mp4File = ffmpeg.FS("readFile", files.output);
  const thumbFile = ffmpeg.FS("readFile", files.thumb);

  // 브라우저가 이해할 수 있는 blob 파일로 전환(mp4File.buffer 필수)
  const mp4Blob = new Blob([mp4File.buffer], { type: "video/mp4" });
  const thumbBlob = new Blob([thumbFile.buffer], { type: "image/jpg" });

  // blob을 URL 형싱으로 변환
  const mp4Url = URL.createObjectURL(mp4Blob);
  const thumbUrl = URL.createObjectURL(thumbBlob);

  downloadFile(mp4Url, "MyRecording.mp4");
  downloadFile(thumbUrl, "MyThumbnail.jpg");

  // 브라우저 메모리 최적화를 위해 파일들 삭제
  ffmpeg.FS("unlink", files.input);
  ffmpeg.FS("unlink", files.output);
  ffmpeg.FS("unlink", files.thumb);

  URL.revokeObjectURL(mp4Url);
  URL.revokeObjectURL(thumbUrl);
  URL.revokeObjectURL(videoFile);

  // 다운로드가 완료되면 다시 record 기능 추가
  actionBtn.disabled = false;
  actionBtn.innerText = "Record Again";
  actionBtn.addEventListener("click", handleStart);
  init();
};

const handleStop = () => {
  actionBtn.innerText = "Download Recording";
  actionBtn.removeEventListener("click", handleStop);
  actionBtn.addEventListener("click", handleDownload);

  recorder.stop();
  // stop은 ondataavailable 이벤트를 발생 시키고 blob(video file)을 반환함
};

const handleStart = () => {
  actionBtn.innerText = "Stop Recording";
  actionBtn.removeEventListener("click", handleStart);
  actionBtn.addEventListener("click", handleStop);

  recorder = new MediaRecorder(stream, { mimeType: "video/webm" });
  // stream을 받아 recording
  // mimeType: video/mp4 로 설정할 수 있으나 지원되는 브라우저/디바이스만 가능, default는 webm으로 되어 있음
  recorder.ondataavailable = (event) => {
    // stop이 실행되면 발동
    videoFile = URL.createObjectURL(event.data); // event.data = blop(file)을 가지고 URL형식으로 브라우저 메모리에 저장하여 파일에 접근할 수 있음
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

actionBtn.addEventListener("click", handleStart);
