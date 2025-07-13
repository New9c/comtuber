const toggleCodeBtn = document.getElementById("toggleFaceCode")
const faceCode = document.getElementById("faceCode")

toggleCodeBtn.addEventListener("click", function() {
	toggleCodeBtn.innerText = (toggleCodeBtn.innerText == "Hide Face Code") ? "Show Face Code" : "Hide Face Code";
	faceCode.className = faceCode.className == "removed" ? "" : "removed";
});
