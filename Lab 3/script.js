document.addEventListener("DOMContentLoaded", () => {
	const sounds = {
		boom: new Audio(
			"./Drum/[99Sounds] 99 Drum Samples/Samples/crash-acoustic.wav"
		),
		clap: new Audio("./Drum/[99Sounds] 99 Drum Samples/Samples/clap-fat.wav"),
		hihat: new Audio("./Drum/[99Sounds] 99 Drum Samples/Samples/hihat-808.wav"),
		kick: new Audio(
			"./Drum/[99Sounds] 99 Drum Samples/Samples/kick-classic.wav"
		),
		openhat: new Audio(
			"./Drum/[99Sounds] 99 Drum Samples/Samples/openhat-slick.wav"
		),
		ride: new Audio(
			"./Drum/[99Sounds] 99 Drum Samples/Samples/ride-acoustic01.wav"
		),
		snare: new Audio(
			"./Drum/[99Sounds] 99 Drum Samples/Samples/snare-analog.wav"
		),
		tink: new Audio(
			"./Drum/[99Sounds] 99 Drum Samples/Samples/tom-chiptune.wav"
		),
		tom: new Audio("./Drum/[99Sounds] 99 Drum Samples/Samples/perc-metal.wav"),
	};

	const keyMap = {
		KeyQ: "boom",
		KeyW: "clap",
		KeyE: "hihat",
		KeyR: "kick",
		KeyA: "openhat",
		KeyS: "ride",
		KeyD: "snare",
		KeyF: "tink",
		KeyG: "tom",
	};

	let channels = [];
	const channelsContainer = document.querySelector(".channels");

	document.querySelectorAll(".drum-pad").forEach((pad) => {
		pad.addEventListener("click", () => {
			const sound = pad.getAttribute("data-sound");
			playSound(sound);
			animatePad(sound);
			recordSound(sound);
		});
	});

	document.addEventListener("keydown", (e) => {
		if (keyMap[e.code]) {
			const sound = keyMap[e.code];
			playSound(sound);
			animatePad(sound);
			recordSound(sound);
		}
	});

	function playSound(sound) {
		if (sounds[sound]) {
			sounds[sound].currentTime = 0;
			sounds[sound].play();
		}
	}

	function animatePad(sound) {
		const pad = document.querySelector(`.drum-pad[data-sound="${sound}"]`);
		pad.classList.add("active");
		setTimeout(() => pad.classList.remove("active"), 200);
	}

	// Metronome Functionality
	let metronomeInterval;
	const metronomeToggleButton = document.getElementById("metronome-toggle");
	const metronomeBPMInput = document.getElementById("metronome-bpm");
	const metronomeSound = new Audio(
		"./Drum/[99Sounds] 99 Drum Samples/Samples/hihat-analog.wav"
	);

	metronomeToggleButton.addEventListener("click", toggleMetronome);

	function toggleMetronome() {
		if (metronomeInterval) {
			clearInterval(metronomeInterval);
			metronomeInterval = null;
			metronomeToggleButton.textContent = "Włącz Metronom";
		} else {
			startMetronome();
		}
	}

	function startMetronome() {
		const bpm = parseInt(metronomeBPMInput.value);
		const interval = 60000 / bpm;
		metronomeInterval = setInterval(() => {
			metronomeSound.currentTime = 0;
			metronomeSound.play();
		}, interval);
		metronomeToggleButton.textContent = "Wyłącz Metronom";
	}

	metronomeBPMInput.addEventListener("change", () => {
		if (metronomeInterval) {
			startMetronome(); // Restart metronome with new BPM
		}
	});

	function addChannel() {
		const channelIndex = channels.length;
		const newChannel = {
			recordings: [],
			isRecording: false,
			playbackInterval: null,
		};
		channels.push(newChannel);
		const channelDiv = document.createElement("div");
		channelDiv.className = "channel";
		channelDiv.innerHTML = `
            <button class="toggle-recording">Start Recording</button>
            <button class="play-recording">Play Recording</button>
            <button class="remove-channel">Remove Channel</button>
        `;
		channelDiv
			.querySelector(".toggle-recording")
			.addEventListener("click", () => toggleRecording(channelIndex));
		channelDiv
			.querySelector(".play-recording")
			.addEventListener("click", () => playRecording(channelIndex));
		channelDiv
			.querySelector(".remove-channel")
			.addEventListener("click", () => removeChannel(channelIndex, channelDiv));
		channelsContainer.appendChild(channelDiv);
	}

	function toggleRecording(index) {
		const channel = channels[index];
		channel.isRecording = !channel.isRecording;
		if (channel.isRecording) {
			channel.recordings = [];
			channelsContainer.children[index].querySelector(
				".toggle-recording"
			).textContent = "Stop Recording";
		} else {
			channelsContainer.children[index].querySelector(
				".toggle-recording"
			).textContent = "Start Recording";
		}
	}

	function playRecording(index) {
		const channel = channels[index];
		channel.recordings.forEach((note) => {
			setTimeout(() => {
				playSound(note.sound);
				animatePad(note.sound);
			}, note.time);
		});
	}

	function recordSound(sound) {
		channels.forEach((channel) => {
			if (channel.isRecording) {
				const time = Date.now() - channel.startTime;
				channel.recordings.push({ sound, time });
			}
		});
	}

	function removeChannel(index, channelElement) {
		clearInterval(channels[index].playbackInterval);
		channels.splice(index, 1);
		channelsContainer.removeChild(channelElement);
	}

	// Initialize first channel
	addChannel();
});
