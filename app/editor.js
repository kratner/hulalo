/**
 * Editor controls for loading sections, managing preview, and timeline scrubbing
 */

const iframe = document.getElementById('preview-iframe');
const previewContainer = document.querySelector('.preview-container');

let currentTimeline = null;
let currentBreakpoint = 'desktop';

const breakpointSizes = {
  mobile: 390,
  tablet: 768,
  desktop: 1440
};

/**
 * Loads a section HTML into the preview iframe
 */
export async function loadSection(section) {
  try {
    const response = await fetch(section.path);
    const html = await response.text();

    // Create a complete HTML document for the iframe
    const iframeDoc = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${section.name}</title>
          <link rel="stylesheet" href="/sections/_base/base.css">
          <style>
            body {
              margin: 0;
              padding: 0;
            }
          </style>
        </head>
        <body>
          ${html}
        </body>
      </html>
    `;

    // Set iframe content
    iframe.srcdoc = iframeDoc;

    // Wait for iframe to load and scripts to execute
    return new Promise((resolve) => {
      iframe.onload = () => {
        setTimeout(() => {
          // Get the timeline from the iframe's window.__hulalo registry
          if (iframe.contentWindow.__hulalo && iframe.contentWindow.__hulalo[section.id]) {
            currentTimeline = iframe.contentWindow.__hulalo[section.id];
          } else {
            console.warn(`Timeline not found for section: ${section.id}`);
            currentTimeline = null;
          }
          resolve();
        }, 100);
      };
    });
  } catch (error) {
    console.error(`Failed to load section: ${section.id}`, error);
  }
}

/**
 * Sets the responsive breakpoint and resizes the preview iframe
 */
export function setBreakpoint(breakpoint) {
  currentBreakpoint = breakpoint;
  const width = breakpointSizes[breakpoint];
  iframe.style.width = `${width}px`;

  // Trigger resize event in iframe to update responsive styles
  if (iframe.contentWindow) {
    iframe.contentWindow.dispatchEvent(new Event('resize'));
  }
}

/**
 * Seeks the timeline to a specific progress (0-1)
 */
export function seekTimeline(progress) {
  if (currentTimeline) {
    currentTimeline.progress(progress);
  }
}

/**
 * Plays the timeline from the current position
 */
export function playTimeline() {
  if (currentTimeline) {
    currentTimeline.play();
  }
}

/**
 * Pauses the timeline
 */
export function pauseTimeline() {
  if (currentTimeline) {
    currentTimeline.pause();
  }
}

// Initialize with desktop breakpoint
setBreakpoint('desktop');
