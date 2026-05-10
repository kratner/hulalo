import { loadSection, setBreakpoint, seekTimeline, playTimeline, pauseTimeline } from './editor.js';

let sections = [];
let currentSection = null;

async function init() {
  // Load section registry
  const response = await fetch('/hulalo.json');
  const config = await response.json();
  sections = config.sections;

  // Populate section list
  const sectionList = document.getElementById('section-list');
  sections.forEach((section, index) => {
    const li = document.createElement('li');
    const button = document.createElement('button');
    button.textContent = section.name;
    button.dataset.sectionId = section.id;
    button.dataset.sectionIndex = index;
    if (index === 0) button.classList.add('active');
    button.addEventListener('click', () => selectSection(section, button));
    li.appendChild(button);
    sectionList.appendChild(li);
  });

  // Load first section
  selectSection(sections[0], sectionList.querySelector('button'));

  // Breakpoint toggle
  document.querySelectorAll('.breakpoint-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.breakpoint-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const breakpoint = btn.dataset.breakpoint;
      setBreakpoint(breakpoint);
    });
  });

  // Timeline scrubber
  const scrubber = document.getElementById('timeline-scrubber');
  scrubber.addEventListener('input', (e) => {
    const progress = parseInt(e.target.value) / 100;
    seekTimeline(progress);
  });

  // Timeline controls
  document.getElementById('play-btn').addEventListener('click', playTimeline);
  document.getElementById('pause-btn').addEventListener('click', pauseTimeline);
  document.getElementById('reset-btn').addEventListener('click', () => {
    scrubber.value = 0;
    seekTimeline(0);
  });

  // Export buttons (placeholder)
  document.getElementById('export-html-btn').addEventListener('click', () => {
    if (currentSection) {
      alert(`Export HTML: ${currentSection.name}`);
    }
  });

  document.getElementById('export-webp-btn').addEventListener('click', () => {
    if (currentSection) {
      alert(`Export WebP: ${currentSection.name}`);
    }
  });

  document.getElementById('export-video-btn').addEventListener('click', () => {
    if (currentSection) {
      alert(`Export Video: ${currentSection.name}`);
    }
  });
}

async function selectSection(section, buttonEl) {
  currentSection = section;

  // Update active button
  document.querySelectorAll('.section-list button').forEach((b) => b.classList.remove('active'));
  buttonEl.classList.add('active');

  // Load section into preview
  await loadSection(section);

  // Update inspector
  updateInspector(section);

  // Reset timeline scrubber
  document.getElementById('timeline-scrubber').value = 0;
}

function updateInspector(section) {
  const sectionInfo = document.getElementById('section-info');
  sectionInfo.innerHTML = `
    <dl>
      <dt>ID</dt>
      <dd>${section.id}</dd>
      <dt>Type</dt>
      <dd>${section.type}</dd>
      <dt>Description</dt>
      <dd>${section.description}</dd>
      <dt>Responsive</dt>
      <dd>${section.responsive.join(', ')}</dd>
      <dt>Motion</dt>
      <dd>${section.motion}</dd>
      <dt>Export Formats</dt>
      <dd>${section.exportFormats.join(', ')}</dd>
    </dl>
  `;
}

init();
