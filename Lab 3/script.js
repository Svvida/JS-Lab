const sounds = {
	a: document.querySelector("#clap"),
	s: document.querySelector("#hihat"),
	d: document.querySelector("#boom"),
	w: document.querySelector("#cowbell"),
};

document.addEventListener("keypress", (e) => {
	console.log(e);
	const sountObject = sounds[e.key];
	if (sountObject) {
		sountObject.currentTime = 0;
		sountObject.play();
	}
});

let channels = {
	ch1: [],
	ch2: [],
	ch3: [],
	ch4: [],
};
let isRecording = false;
let recordingChannel = null;
let startTime;
