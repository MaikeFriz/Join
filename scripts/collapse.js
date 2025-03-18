document.addEventListener("DOMContentLoaded", function () {
  const collapseButtons = document.querySelectorAll(".collapse-button");

  collapseButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const targetId = this.getAttribute("data-target");
      const content = document.getElementById(targetId);

      if (content.style.visibility === "hidden") {
        content.style.visibility = "visible";
        this.textContent = "-";
      } else {
        content.style.visibility = "hidden";
        this.textContent = "+";
      }
    });
  });
});
