const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const playBtnIcon = playBtn.querySelector("i");
const muteBtn = document.getElementById("mute");
const muteBtnIcon = muteBtn.querySelector("i");
const volumeRange = document.getElementById("volume");
const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");
const timeline = document.getElementById("timeline");
const videoContainer = document.getElementById("videoContainer");
const fullScreenBtn = document.getElementById("fullScreen");
const fullSCreenBtnIcon = fullScreenBtn.querySelector("i");
const videoControls = document.getElementById("videoControls");
const textarea = document.getElementById("textarea");

let controlsTimeout = null; // Timeout 전역변수 설정
let controlsMovementTimeout = null; // mouse timeout 전역변수 설정
let volumeValue = 0.5; // 글로벌 변수 설정, pug 템플릿 default값
video.volume = volumeValue; // 디폴트값을 비디오 볼륨에 적용

const handlePlayClick = (e) => {
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
  playBtnIcon.classList = video.paused ? "fas fa-play" : "fas fa-pause";
};

const handleMuteClick = (e) => {
  if (video.muted) {
    video.muted = false;
  } else {
    video.muted = true;
  }
  if (video.volume == 0) {
    // Range가 0으로 간 상태에서 Unmute하면 default 0.5 값 주기
    video.volume = 0.5;
    volumeValue = 0.5;
  }
  muteBtnIcon.classList = video.muted
    ? "fas fa-volume-mute"
    : "fas fa-volume-up";
  volumeRange.value = video.muted ? 0 : volumeValue;
};

const handleVolumeChange = (event) => {
  const {
    target: { value },
  } = event;
  if (video.muted) {
    // 볼륨이 mute일 때 레인지를 키우면 음소거 해제하는 기능
    video.muted = false;
    muteBtn.innerText = "Mute";
  }
  if (value == 0) {
    // 볼륨 레인지를 0으로 줄이면 mute로 변환 기능
    video.muted = true;
    muteBtn.innerText = "Unmute";
  }
  volumeValue = value;
  video.volume = value;
};

const formatTime = (seconds) => {
  // new Date는 1970년 날짜 기준으로 시간을 측정할 수 있음
  return new Date(seconds * 1000).toISOString().substring(11, 19);
};

const handleLoadedMetadata = () => {
  totalTime.innerText = formatTime(Math.floor(video.duration));
  timeline.max = Math.floor(video.duration); // range 최대값 설정
};

const handleTimeUpdate = () => {
  currentTime.innerText = formatTime(Math.floor(video.currentTime));
  timeline.value = Math.floor(video.currentTime); // video currentTime 타임라인값에 적용
};

const handleTimelineChange = (event) => {
  const {
    target: { value },
  } = event;
  video.currentTime = value;
};

const handleFullScreen = () => {
  const fullscreen = document.fullscreenElement; // fullscreen 모드일 경우 해당 element를 반환 아니면 null
  if (fullscreen) {
    document.exitFullscreen();
    fullSCreenBtnIcon.classList = "fas fa-expand";
  } else {
    videoContainer.requestFullscreen();
    fullSCreenBtnIcon.classList = "fas fa-compress";
  }
};

const hideControls = () => videoControls.classList.remove("showing");

const handleMouseMove = () => {
  if (controlsTimeout) {
    clearTimeout(controlsTimeout);
    controlsTimeout = null;
  }
  if (controlsMovementTimeout) {
    // 만약 마우수를 계속 움직인다면 controlsMovementTimeout 실행 취소
    clearTimeout(controlsMovementTimeout);
    controlsMovementTimeout = null;
  }
  videoControls.classList.add("showing");
  controlsMovementTimeout = setTimeout(hideControls, 3000); // 마우스가 멈추면 컨트롤을 숨기는 타임아웃 실행
};

const handleMouseLeave = () => {
  // setTimeout은 자기 id 값을 반환하고 id를 통해 clearTimeout()을 할 수 있음
  controlsTimeout = setTimeout(hideControls, 3000);
};

const handleSpacebar = (event) => {
  // comment 입력할 때 space 누르면 영상이 정지/지생 되서 코드 수정
  if (event.target !== textarea && event.keyCode == 32) {
    // spacebar keycode값 32
    handlePlayClick();
  }
};

const handleVideoClick = () => {
  handlePlayClick();
};

const handleEnded = () => {
  const { id } = videoContainer.dataset; // HTML element에 저장한 data-id attribute를 dataset으로 불러올 수 있음
  fetch(`/api/videos/${id}/view`, { method: "POST" });
};

playBtn.addEventListener("click", handlePlayClick);
muteBtn.addEventListener("click", handleMuteClick);
volumeRange.addEventListener("input", handleVolumeChange);
video.addEventListener("loadedmetadata", handleLoadedMetadata); // loadedmetadata는 비디오 이미지 외 비디오 데이타, 미디어의 첫번째 프레임이 로딩 완료된 시점에 발생.ex) 시간
video.addEventListener("timeupdate", handleTimeUpdate); // currentTime 속성이 변경되는 시점부터 발생
video.addEventListener("ended", handleEnded); // 비디오가 끝날 때 발생
timeline.addEventListener("input", handleTimelineChange);
fullScreenBtn.addEventListener("click", handleFullScreen);
videoContainer.addEventListener("mousemove", handleMouseMove);
videoContainer.addEventListener("mouseleave", handleMouseLeave);
document.addEventListener("keydown", handleSpacebar); // video 재생 spacebar eventListener
video.addEventListener("click", handleVideoClick); // video 재생 video 화면 클릭 eventListener
