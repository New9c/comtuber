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
	if (nerds.value == "Iwannaseemyfaceandepicstats") {
		document.body.style.gridTemplateColumns = '1fr';
		demo.className = "";
	} else {
		document.body.style.gridTemplateColumns = '1fr 1fr';
		demo.className = "removed";
	}
});

const roots = ["text", "background", "primary", "accent"];
for (let i = 0; i < roots.length; i++) {
	let root = document.getElementById(roots[i]);
	root.addEventListener("change", function() {
		console.log("hi");
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
