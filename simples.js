const toggleCodeBtn = document.getElementById("toggleFaceCode")
const faceCode = document.getElementById("faceCode")

toggleCodeBtn.addEventListener("click", function() {
	toggleCodeBtn.innerText = (toggleCodeBtn.innerText == "Hide Face Code") ? "Show Face Code" : "Hide Face Code";
	faceCode.className = faceCode.className == "removed" ? "" : "removed";
});

const nerds = document.getElementById("nerds")
nerds.value = "";
const demo = document.getElementById("demos")
nerds.addEventListener("change", function() {
	document.body.style.gridTemplateColumns = nerds.value == "Iwannaseemyface" ? "1fr" : "1fr 1fr";
	demo.className = nerds.value == "Iwannaseemyface" ? "" : "removed";
});

const stats = document.getElementById("toggleStats");
const left = document.getElementById("left");
const blend = document.getElementsByClassName("blend-shapes")[0];
stats.addEventListener("click", function() {
	stats.innerText = (stats.innerText == "Hide Tracking Stats") ? "Show Tracking Stats" : "Hide Tracking Stats";
	blend.className = blend.className == "blend-shapes removed" ? "blend-shapes" : "blend-shapes removed";
	left.style.gridTemplateColumns = blend.className == "blend-shapes" ? "1fr 1fr" : "1fr";
});

const roots = ["text", "background", "primary", "accent"];
for (let i = 0; i < roots.length; i++) {
	let root = document.getElementById(roots[i]);
	root.addEventListener("input", function() {
		const val = root.value;
		document.documentElement.style.setProperty('--' + roots[i], val);
	});
	const val = document.getElementById(roots[i]).value;
	document.documentElement.style.setProperty('--' + roots[i], val);
}
const theRootVals = ["#d8fde1", "#1c1b1b", "#0edd37", "#2bffed"];
document.getElementById("resetRoot").addEventListener("click", function() {
	for (let i = 0; i < roots.length; i++) {
		document.getElementById(roots[i]).value = theRootVals[i];
		document.documentElement.style.setProperty('--' + roots[i], theRootVals[i]);
	}
})
