document.getElementById('fetchStatusButton').addEventListener('click', fetchLineStatus);

async function fetchLineStatus() {
  const statusContainer = document.getElementById('status');
  statusContainer.innerHTML = 'Loading...';

  try {
    const response = await fetch('https://api.tfl.gov.uk/line/mode/tube/status');
    const data = await response.json();

    // Check the structure of the response and log it for debugging
    console.log(data);

    statusContainer.innerHTML = ''; // Clear loading message

    if (Array.isArray(data)) {
      // Process each line's status
      data.forEach(line => {
        const lineElement = document.createElement('div');
        lineElement.classList.add('line-status');
        
        // Set the background color based on the status
        if (line.lineStatuses && line.lineStatuses[0]) {
          const statusDescription = line.lineStatuses[0].statusSeverityDescription;
          if (statusDescription === 'Good Service') {
            lineElement.classList.add('open');
          } else {
            lineElement.classList.add('closed');
          }

          lineElement.innerHTML = `
            <strong>${line.name}</strong>
            <span>${statusDescription}</span>
          `;
        } else {
          lineElement.innerHTML = `
            <strong>${line.name}</strong>
            <span>Status unavailable</span>
          `;
        }

        statusContainer.appendChild(lineElement);
      });
    } else {
      statusContainer.innerHTML = 'Unexpected data format.';
    }
  } catch (error) {
    console.error(error);
    statusContainer.innerHTML = 'Failed to fetch line status. Please try again later.';
  }
}
