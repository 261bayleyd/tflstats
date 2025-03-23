console.log('JavaScript is running!');  // Test if JS is loaded

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

    console.log('API Data:', data); // Log the data

    statusContainer.innerHTML = ''; // Clear loading message

    if (Array.isArray(data)) {
      // Loop through the data and process each line's status
      data.forEach(line => {
        const lineElement = document.createElement('div');
        lineElement.classList.add('line-status');

        if (line.lineStatuses && line.lineStatuses.length > 0) {
          const lineName = line.name;
          const statusDescriptions = line.lineStatuses.map(status => status.statusSeverityDescription).join(', ');
          const problemDescriptions = line.lineStatuses
            .map(status => status.statusSeverityReasonDescription || "No detailed problem description")
            .join(', ');  // Join all descriptions if more than one exists

          // Get the colors for the line
          const colors = lineColors[lineName];

          // If we have colors for the line, set them
          if (colors) {
            lineElement.style.color = colors.foreground;
            lineElement.style.backgroundColor = colors.background;
          }

          // Determine if the status is "Good Service" or another status
          if (statusDescriptions === 'Good Service') {
            lineElement.classList.add('open');
          } else {
            lineElement.classList.add('closed');
          }

          // Display line name and status descriptions
          lineElement.innerHTML = `
            <strong>${lineName}</strong>
            <span>Status: ${statusDescriptions}</span>
          `;

          // Display detailed problem descriptions
          if (problemDescriptions !== "No detailed problem description") {
            const problemElement = document.createElement('div');
            problemElement.textContent = `Problems: ${problemDescriptions}`;
            problemElement.style.fontStyle = 'italic';
            problemElement.style.marginTop = '5px';
            lineElement.appendChild(problemElement);
          }

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
    console.error('Error fetching data:', error);
    statusContainer.innerHTML = 'Failed to fetch line status. Please try again later.';
  }
}
