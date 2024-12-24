document.getElementById("profile-image").addEventListener("mouseover", function() {
    document.getElementById("intro").style.display = "block";
});

document.getElementById("profile-image").addEventListener("mouseout", function() {
    document.getElementById("intro").style.display = "none";
});
