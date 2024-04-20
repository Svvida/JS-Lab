function saveNote() {
	const title = document.getElementById("note-title").value;
	const content = document.getElementById("note-content").value;
	const tags = document
		.getElementById("note-tags")
		.value.split(",")
		.map((tag) => tag.trim());
	const color = document.getElementById("note-color").value;
	const pinned = document.getElementById("note-pin").checked;
	const reminderDate = document.getElementById("note-reminder").value;
	const checklist = getChecklist();
	const createdAt = new Date().toISOString();

	const note = {
		title,
		content,
		tags,
		color,
		pinned,
		reminderDate,
		checklist,
		createdAt,
	};
	const notes = JSON.parse(localStorage.getItem("notes")) || [];
	notes.push(note);
	localStorage.setItem("notes", JSON.stringify(notes));

	displayNotes();
	clearNoteForm();
}

function displayNotes(filteredNotes = null) {
	const noteList = document.getElementById("note-list");
	noteList.innerHTML = "";

	const notes =
		filteredNotes || JSON.parse(localStorage.getItem("notes")) || [];
	notes.forEach((note, index) => {
		const noteElement = document.createElement("div");
		noteElement.classList.add("note");
		if (note.pinned) {
			noteElement.classList.add("pinned");
		}
		noteElement.style.backgroundColor = note.color;

		const titleElement = document.createElement("h3");
		titleElement.textContent = note.title;

		const contentElement = document.createElement("p");
		contentElement.textContent = note.content;

		const tagsElement = document.createElement("div");
		tagsElement.classList.add("note-tags");
		note.tags.forEach((tag) => {
			const tagElement = document.createElement("span");
			tagElement.classList.add("note-tag");
			tagElement.textContent = tag;
			tagsElement.appendChild(tagElement);
		});

		const reminderElement = document.createElement("div");
		reminderElement.classList.add("note-reminder");
		if (note.reminderDate) {
			const reminderDate = new Date(note.reminderDate);
			reminderElement.textContent = `Reminder: ${reminderDate.toLocaleString()}`;
		}

		const checklistElement = document.createElement("div");
		checklistElement.classList.add("note-checklist");
		note.checklist.forEach((item) => {
			const checklistItemElement = document.createElement("div");
			checklistItemElement.classList.add("note-checklist-item");
			if (item.completed) {
				checklistItemElement.classList.add("completed");
			}
			const checkboxElement = document.createElement("input");
			checkboxElement.type = "checkbox";
			checkboxElement.checked = item.completed;
			checkboxElement.onclick = () => toggleChecklistItem(index, item.id);
			const labelElement = document.createElement("label");
			labelElement.textContent = item.text;
			checklistItemElement.appendChild(checkboxElement);
			checklistItemElement.appendChild(labelElement);
			checklistElement.appendChild(checklistItemElement);
		});

		const createdAtElement = document.createElement("p");
		createdAtElement.textContent = `Created: ${new Date(
			note.createdAt
		).toLocaleString()}`;

		noteElement.appendChild(titleElement);
		noteElement.appendChild(contentElement);
		noteElement.appendChild(tagsElement);
		noteElement.appendChild(reminderElement);
		noteElement.appendChild(checklistElement);
		noteElement.appendChild(createdAtElement);

		noteList.appendChild(noteElement);
	});
}

function searchNotes() {
	const searchInput = document
		.getElementById("search-input")
		.value.toLowerCase();
	const notes = JSON.parse(localStorage.getItem("notes")) || [];
	const filteredNotes = notes.filter(
		(note) =>
			note.title.toLowerCase().includes(searchInput) ||
			note.content.toLowerCase().includes(searchInput) ||
			note.tags.some((tag) => tag.toLowerCase().includes(searchInput))
	);
	displayNotes(filteredNotes);
}

function addChecklistItem() {
	const checklistInput = document.getElementById("checklist-item");
	const text = checklistInput.value.trim();
	if (text) {
		const note = getCurrentNote();
		note.checklist.push({ id: Date.now(), text, completed: false });
		localStorage.setItem(
			"notes",
			JSON.stringify(JSON.parse(localStorage.getItem("notes")))
		);
		displayNotes();
		checklistInput.value = "";
	}
}

function toggleChecklistItem(noteIndex, itemId) {
	const notes = JSON.parse(localStorage.getItem("notes"));
	const note = notes[noteIndex];
	const item = note.checklist.find((i) => i.id === itemId);
	item.completed = !item.completed;
	localStorage.setItem("notes", JSON.stringify(notes));
	displayNotes();
}

function getCurrentNote() {
	const notes = JSON.parse(localStorage.getItem("notes")) || [];
	const title = document.getElementById("note-title").value;
	const note = notes.find((n) => n.title === title);
	return (
		note || {
			title: "",
			content: "",
			tags: [],
			color: "#ffffff",
			pinned: false,
			reminderDate: "",
			checklist: [],
			createdAt: new Date().toISOString(),
		}
	);
}

function getChecklist() {
	const checklistInput = document.getElementById("checklist-item");
	const text = checklistInput.value.trim();
	if (text) {
		return [{ id: Date.now(), text, completed: false }];
	}
	return [];
}

function clearNoteForm() {
	document.getElementById("note-title").value = "";
	document.getElementById("note-content").value = "";
	document.getElementById("note-tags").value = "";
	document.getElementById("note-color").value = "#ffffff";
	document.getElementById("note-pin").checked = false;
	document.getElementById("note-reminder").value = "";
	document.getElementById("checklist-item").value = "";
}

displayNotes();
