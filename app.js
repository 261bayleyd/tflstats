document.getElementById('fetchStatusButton').addEventListener('click', fetchLineStatus);

const lineColors = {
  "Bakerloo": { foreground: "#FFFFFF", background: "#AE6118" },
  "Central": { foreground: "#FFFFFF", background: "#E41F1F" },
  "Circle": { foreground: "#113892", background: "#F8D42D" },
  "District": { foreground: "#FFFFFF", background: "#007229" },
  "DLR": { foreground: "#FFFFFF", background: "#00BBB4" },
  "Hammersmith & City": { foreground: "#113892", background: "#E899A8" },
  "Jubilee": { foreground: "#FFFFFF", background: "#686E72" },
  "Metropolitan": { foreground: "#FFFFFF", background: "#893267" },
  "Northern": { foreground: "#FFFFFF", background: "#000000" },
  "Overground": { foreground: "#FFFFFF", background: "#F86" },
  "Piccadilly": { foreground: "#FFFFFF", background: "#0450A1" },
  "Victoria": { foreground: "#FFFFFF", background: "#009FE0" },
  "Waterloo & City": { foreground: "#113892", background: "#70C3CE" }
};

async function fetchLineStatus() {
  const statusContainer = document.getElementById('status');
  statusContainer.innerHTML = 'Loading...';

  try {
    const response = await fetch('https://api.tfl.gov.uk/line/mode/tube/status');
    const data = await response.json();

    // Log the entire data response for debugging
    console.log("API Response:", data);

    statusContainer.innerHTML = ''; // Clear loading message

    if (Array.isArray(data)) {
      // Loop through the data and process each line's status
      data.forEach(line => {
        // Log each line's data to debug the structure
        console.log("Line Data:", line);

        const lineElement = document.createElement('div');
        lineElement.classList.add('line-status');
        
        // Check if lineStatuses array exists and has data
        if (line.lineStatuses && line.lineStatuses[0]) {
          const statusDescription = line.lineStatuses[0].statusSeverityDescription;
          const lineName = line.name;

          // Get the colors for the line
          const colors = lineColors[lineName];

          // If we have colors for the line, set them
          if (colors) {
            lineElement.style.color = colors.foreground;
            lineElement.style.backgroundColor = colors.background;
          }

          // Determine if the status is "Good Service" or another status
          if (statusDescription === 'Good Service') {
            lineElement.classList.add('open');
          } else {
            lineElement.classList.add('closed');
          }

          // Display line name and status description
          lineElement.innerHTML = `
            <strong>${lineName}</strong>
            <span>${statusDescription}</span>
          `;
        } else {
          // Handle missing or unexpected data
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
    console.error('Error fetching data:', error);
    statusContainer.innerHTML = 'Failed to fetch line status. Please try again later.';
  }
}
