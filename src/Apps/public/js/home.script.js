const textElement = document.getElementById('h1');
const texts = ['Hello Alwan'];
let index = 0;
let textIndex = 0;
let isDeleting = false;

function typeWriter() {
  const currentText = texts[textIndex];
  
  if (isDeleting) {
    textElement.textContent = currentText.substring(0, index - 1);
    index--;
  } else {
    textElement.textContent = currentText.substring(0, index + 1);
    index++;
  }

  if (!isDeleting && index === currentText.length) {
    isDeleting = true;
    setTimeout(typeWriter, 2000);
    return;
  }

  if (isDeleting && index === 0) {
    isDeleting = false;
    textIndex = (textIndex + 1) % texts.length;
  }

  setTimeout(typeWriter, isDeleting ? 100 : 100);
}

document.addEventListener('DOMContentLoaded', typeWriter);
