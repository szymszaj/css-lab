const openModal1Btn = document.getElementById("openModal1");
const closeModal1Btn = document.getElementById("close1");
const cancelModal1Btn = document.getElementById("cancel1");
const overlay1 = document.getElementById("overlay1");
const modal1 = document.getElementById("modal1");

const openModal2Btn = document.getElementById("openModal2");
const closeModal2Btn = document.getElementById("close2");
const cancelModal2Btn = document.getElementById("cancel2");
const overlay2 = document.getElementById("overlay2");
const modal2 = document.getElementById("modal2");

function openModal(modal) {
  modal.classList.add("active");
}

function closeModal(modal) {
  modal.classList.remove("active");
}

openModal1Btn.addEventListener("click", () => openModal(modal1));
closeModal1Btn.addEventListener("click", () => closeModal(modal1));
cancelModal1Btn.addEventListener("click", () => closeModal(modal1));
overlay1.addEventListener("click", () => closeModal(modal1));

openModal2Btn.addEventListener("click", () => openModal(modal2));
closeModal2Btn.addEventListener("click", () => closeModal(modal2));
cancelModal2Btn.addEventListener("click", () => closeModal(modal2));
overlay2.addEventListener("click", () => closeModal(modal2));

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeModal(modal1);
    closeModal(modal2);
  }
});
