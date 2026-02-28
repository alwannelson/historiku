const textElement = document.getElementById('h1');
const textToType = 'Hi there!'; // Langsung string, bukan array
let index = 0;

function typeWriter() {
  if (index < textToType.length) {
    textElement.textContent += textToType.charAt(index);
    index++;
    setTimeout(typeWriter, 100); // Kecepatan mengetik (100ms per huruf)
  }
}

document.addEventListener('DOMContentLoaded', typeWriter);