let asyncOperationCount = 0;

const asyncAdd = async (a, b) => {
	if (typeof a !== "number" || typeof b !== "number") {
		return Promise.reject("Argumenty muszą mieć typ number!");
	}
	asyncOperationCount++;
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve(a + b);
		}, 100);
	});
};

// Function to add multiple numbers asynchronously using asyncAdd
const asyncAddMultiple = async (...numbers) => {
	if (numbers.length === 0) return 0;
	if (numbers.length === 1) return numbers[0];

	const addRecursively = async (arr) => {
		if (arr.length === 1) return arr[0];

		let promises = [];
		for (let i = 0; i < arr.length; i += 2) {
			if (i + 1 < arr.length) {
				promises.push(asyncAdd(arr[i], arr[i + 1]));
			} else {
				promises.push(Promise.resolve(arr[i]));
			}
		}

		const results = await Promise.all(promises);
		return addRecursively(results);
	};

	return addRecursively(numbers);
};

// Function to measure execution time
const measureTime = async (func, ...args) => {
	const start = performance.now();
	const result = await func(...args);
	const end = performance.now();
	return {
		result,
		time: end - start,
	};
};

// Handling form submission
document.getElementById("addForm").addEventListener("submit", async (event) => {
	event.preventDefault();
	const numbersInput = document.getElementById("numbers").value;
	const numbers = numbersInput.split(",").map(Number);

	if (numbers.some(isNaN)) {
		alert("Please enter valid numbers!");
		return;
	}

	asyncOperationCount = 0;
	const { result, time } = await measureTime(asyncAddMultiple, ...numbers);
	document.getElementById("result").textContent = `Result: ${result}`;
	document.getElementById(
		"executionTime"
	).textContent = `Execution time: ${time.toFixed(2)}ms`;
	console.log(`Async operations count: ${asyncOperationCount}`);
});

// Testing with 100 elements
document.getElementById("testButton").addEventListener("click", async () => {
	const numbers = Array.from({ length: 100 }, (_, i) => i + 1); // [1, 2, 3, ..., 100]

	asyncOperationCount = 0;
	const { result, time } = await measureTime(asyncAddMultiple, ...numbers);
	document.getElementById(
		"testResult"
	).textContent = `Test result: ${result}, Execution time: ${time.toFixed(
		2
	)}ms, Async operations count: ${asyncOperationCount}`;
});
