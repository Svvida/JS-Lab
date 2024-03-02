document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('addBtn').addEventListener('click', addInputField);
    updateRemoveButtons();
    updateInputFields();
});

function addInputField() {
    const newInputDiv = document.createElement('div');
    newInputDiv.classList.add('input-field');
    newInputDiv.innerHTML = `
        <input type="number" placeholder="Wartość">
        <button class="remove-btn">Usuń</button>
    `;
    document.getElementById('inputFields').appendChild(newInputDiv);
    updateRemoveButtons();
    updateInputFields();
}

function removeInputField(event) {
    const inputField = event.target.parentElement;
    document.getElementById('inputFields').removeChild(inputField);
    calculate();
}

function updateRemoveButtons() {
    document.querySelectorAll('.remove-btn').forEach(button => {
        button.removeEventListener('click', removeInputField);
        button.addEventListener('click', removeInputField);
    });
}

function updateInputFields() {
    document.querySelectorAll('#inputFields input').forEach(input => {
        input.removeEventListener('input', calculate);
        input.addEventListener('input', calculate);
    });
}

function calculate() {
    const inputs = document.querySelectorAll('#inputFields input');
    const values = Array.from(inputs).map(input => parseFloat(input.value) || 0);

    const sum = values.reduce((a, b) => a + b, 0);
    const avg = sum / values.length;
    const min = Math.min(...values);
    const max = Math.max(...values);

    document.getElementById('sum').innerText = 'Suma: ' + sum;
    document.getElementById('avg').innerText = 'Średnia: ' + avg;
    document.getElementById('min').innerText = 'Min: ' + min;
    document.getElementById('max').innerText = 'Max: ' + max;
}
