document.getElementById('fetchStatusButton').addEventListener('click', fetchLineStatus);

async function fetchLineStatus() {
  const statusContainer = document.getElementById('status');
  statusContainer.innerHTML = 'Loading...';

  try {
    const response = await fetch('https://api.tfl.gov.uk/line/mode/tube/status');
    const data = await response.json();
    statusContainer.innerHTML = ''; // Clear the loading message
    
    data.forEach(line => {
      const lineElement = document.createElement('div');
      lineElement.classList.add('line-status');
      
      // Set the background color based on the status
      if (line.statusDescription === 'Good Service') {
        lineElement.classList.add('open');
      } else {
        lineElement.classList.add('closed');
      }

      lineElement.innerHTML = `
        <strong>${line.name}</strong>
        <span>${line.statusDescription}</span>
      `;
      
      statusContainer.appendChild(lineElement);
    });
  } catch (error) {
    statusContainer.innerHTML = 'Failed to fetch line status. Please try again later.';
  }
}
