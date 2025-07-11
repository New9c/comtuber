const toggleCodeBtn = document.getElementById("toggleFaceCode")
const faceCode = document.getElementById("faceCode")
const applyBtn = document.getElementById("applyBtn")
toggleCodeBtn.addEventListener("click", function() {
	toggleCodeBtn.innerText = toggleCodeBtn.innerText == "Hide Face Code" ? "Show Face Code" : "Hide Face Code";
	faceCode.className = faceCode.className == "removed" ? "" : "removed";
});
applyBtn.addEventListener("click", function() {
	changeBackground();
	changeRadius();
});

function changeBackground() {
	const input = document.getElementById('bgcolor').value.trim();
	// Simple validation for hex color format # followed by 3 or 6 hex digits
	const isValidHex = /^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/.test(input);
	avatar.style.backgroundColor = isValidHex ? input : "transparent"
}
function changeRadius() {
	const input = document.getElementById('radius').value.trim();
	avatar.style.borderRadius = input;
}
