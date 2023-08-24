function customizeImagesWithRandomAlt() {
  // Getting a random word from an external API
  async function getRandomWord() {
    try {
      const response = await fetch('https://random-word-api.herokuapp.com/word?number=1');
      if (!response.ok) {
        throw new Error('Failed to fetch random word');
      }
      const data = await response.json();

      return data[0];
    } catch (error) {
      // If the request fails, use a random word from the list
      const fallbackWords = ['apple', 'banana', 'cat', 'dog', 'elephant'];
      const randomIndex = Math.floor(Math.random() * fallbackWords.length);
      return fallbackWords[randomIndex];
    }
  }

  async function applyFunctionalityToImage(img) {
    // Applying functionality to an image

    // Get a random word
    const randomWord = await getRandomWord();
    // Set random word as 'alt' attribute
    img.setAttribute('alt', randomWord);
    img.setAttribute('tabindex', '0');
    img.style.outline = '2px solid red';

    // Add an event handler for clicking on the image
    img.addEventListener('click', () => {
      // Create a popup window
      const inputDiv = document.createElement('div');
      // Setting styles for the popup
      inputDiv.style.position = 'absolute';
      inputDiv.style.top = `${img.offsetTop}px`;
      inputDiv.style.left = `${img.offsetLeft}px`;
      inputDiv.style.backgroundColor = 'white';
      inputDiv.style.padding = '5px';
      inputDiv.style.border = '1px solid #ccc';
      inputDiv.style.width = '230px';
      inputDiv.style.height = '65px';
      inputDiv.style.zIndex = '1000';
      inputDiv.style.border = '2px solid lightblue';
      inputDiv.style.display = 'flex';
      inputDiv.style.flexDirection = 'column';
      inputDiv.style.justifyContent = 'center';
      inputDiv.style.alignItems = 'center';
      // Create an input field
      const input = document.createElement('input');
      
      input.type = 'text';
      input.value = img.getAttribute('alt');
      // Setting styles for the input field
      input.style.width = '100%';
      input.style.height = '20px';
      input.style.border = 'none';
      input.style.backgroundColor = 'lightblue';
      input.style.color = '#333';
      input.style.fontFamily = 'Arial, sans-serif';
      input.style.fontSize = '14px';
      input.style.padding = '0 5px';
      // Create a close button
      const closeButton = document.createElement('button');
      // Setting styles for the close button
      closeButton.textContent = 'Confirm';
      closeButton.style.marginTop = '5px';
      closeButton.style.padding = '5px';
      closeButton.style.backgroundColor = 'lightblue';
      // Adding Items to the Popup
      inputDiv.appendChild(input);
      inputDiv.appendChild(closeButton);
      // Place the popup after the image
      img.parentNode.insertBefore(inputDiv, img.nextSibling);

      // Add a value change handler to the input field
      input.addEventListener('change', () => {
        img.setAttribute('alt', input.value);
      });

      // Handler for closing the window when Enter is pressed
      input.addEventListener('keydown', event => {
        if (event.key === 'Enter') {
          inputDiv.parentNode.removeChild(inputDiv);
        }
      });
      
      // Handler for closing the window on the "Confirm" button
      closeButton.addEventListener('click', () => {
        inputDiv.parentNode.removeChild(inputDiv);
      });
    });
  }

  function updateAltAttributes() {
    // Apply functionality to all images on the page
    const imgElements = document.querySelectorAll('img');
    imgElements.forEach(applyFunctionalityToImage);

   // Create a change watcher inside the body
    const observer = new MutationObserver((mutationsList, observer) => {
      for (const mutation of mutationsList) {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach(node => {
            if (node instanceof HTMLElement) {
              const newImages = node.querySelectorAll('img');
              newImages.forEach(applyFunctionalityToImage);
            }
          });
        }
      }
    });
    // Monitor changes throughout the document
    observer.observe(document.body, { childList: true, subtree: true });
  }

  // Checking if the DOM has already been fully loaded
  if (document.readyState === 'complete') {
    // If the DOM is already loaded
    updateAltAttributes();
  } else {
    // If the DOM is not yet loaded, wait for the DOMContentLoaded event
    document.addEventListener('DOMContentLoaded', updateAltAttributes);
  }

  const style = document.createElement('style');
  style.textContent = `
    img:focus {
      outline: 2px solid blue !important;
    }
  `;
  document.head.appendChild(style);
}

// Calling a function to set up images with random 'alt' attributes
customizeImagesWithRandomAlt();