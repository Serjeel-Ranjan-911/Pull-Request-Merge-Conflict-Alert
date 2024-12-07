// fetch merge related data
async function fetchPartialMerging(prUrl) {
	if (!prUrl) {
		throw new Error('Pull request URL is required.');
	}

	const partialMergingUrl = new URL(prUrl);
	partialMergingUrl.pathname += '/partials/merging';

	const cookies = document.cookie;

	const headers = {
		accept: 'text/html',
		'user-agent': navigator.userAgent,
		'x-requested-with': 'XMLHttpRequest',
		cookie: cookies
	};

	try {
		const response = await fetch(partialMergingUrl.toString(), {
			method: 'GET',
			headers: headers,
			credentials: 'include'
		});

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const data = await response.text();
		return data;
	} catch (error) {
		console.error('Error fetching partial merging data:', error);
		throw error;
	}
}

// text animation
// Add styles dynamically
const style = document.createElement('style');
style.textContent = `
  .bouncing-text {
    position: fixed;
    color: white;
    font-size: 24px;
    font-weight: bold;
    width: 200px;
    text-align: center;
    user-select: none; 
    pointer-events: none; /* Prevent text from blocking other elements */
  }
`;
document.head.appendChild(style);

// Create the text element
const textElement = document.createElement('div');
textElement.textContent = 'MERGE CONFLICT!!!';
textElement.className = 'bouncing-text';
document.body.appendChild(textElement);

// Generate random initial position within the viewport
let x = Math.random() * (window.innerWidth - textElement.offsetWidth);
let y = Math.random() * (window.innerHeight - textElement.offsetHeight);
let vx = Math.random() > 0.5 ? 5 : -5,
	vy = Math.random() > 0.5 ? 5 : -5;

// Animation function
function animateText() {
	const width = window.innerWidth;
	const height = window.innerHeight;
	const textWidth = textElement.offsetWidth;
	const textHeight = textElement.offsetHeight;

	// Update position
	x += vx;
	y += vy;

	// Check for collisions with screen edges and reverse direction if needed
	if (x + textWidth > width || x < 0) vx *= -1; // Reverse horizontal direction
	if (y + textHeight > height || y < 0) vy *= -1; // Reverse vertical direction

	// Apply the new position
	textElement.style.left = `${x}px`;
	textElement.style.top = `${y}px`;

	// Repeat the animation
	requestAnimationFrame(animateText);
}

const main = async () => {
	try {
		const url = window.location.href;
		let prUrl = url.replace('/files', '');

		const data = await fetchPartialMerging(prUrl);

		if (data.includes('Resolve conflicts')) {
			// Start the animation
			animateText();
		}
	} catch (error) {
		console.error('Error:', error);
	}
};

// Wait until the page is fully loaded
window.addEventListener('load', main);
