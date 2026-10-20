const pageIds = ["beranda","edukasi","pilah-sampah","tips-hijau","kegiatan","tentang"];
const pages = [...document.querySelectorAll(".page")];
const navLinks = [...document.querySelectorAll(".nav-link")];
const nav = document.getElementById("mainNav");
const menuToggle = document.getElementById("menuToggle");

function showPageFromHash() {
  const requested = (location.hash || "#beranda").slice(1);
  const target = pageIds.includes(requested) ? requested : "beranda";
  pages.forEach(page => page.classList.toggle("active", page.id === target));
  navLinks.forEach(link => {
    const active = link.getAttribute("href") === "#" + target;
    link.classList.toggle("active", active);
    if (active) link.setAttribute("aria-current","page");
    else link.removeAttribute("aria-current");
  });
  nav.classList.remove("open");
  menuToggle.setAttribute("aria-expanded","false");
  document.title = `GreenStep — ${pages.find(p => p.id === target)?.dataset.title || "Small Steps, Greener Future"}`;
  window.scrollTo({top:0, behavior:"smooth"});
}
window.addEventListener("hashchange", showPageFromHash);
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener("click", () => {
    if (link.getAttribute("href") === location.hash) showPageFromHash();
  });
});
menuToggle.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(open));
});
document.getElementById("year").textContent = new Date().getFullYear();

const modalBackdrop = document.getElementById("modalBackdrop");
const modalTitle = document.getElementById("modalTitle");
const modalEyebrow = document.getElementById("modalEyebrow");
const modalBody = document.getElementById("modalBody");
const modalOk = document.getElementById("modalOk");
function openModal(title, body, eyebrow="GreenStep", showOk=true) {
  modalTitle.textContent = title;
  modalEyebrow.textContent = eyebrow;
  modalBody.innerHTML = body;
  modalOk.classList.toggle("hidden", !showOk);
  modalBackdrop.classList.remove("hidden");
}
function closeModal(){modalBackdrop.classList.add("hidden");}
document.getElementById("modalClose").addEventListener("click",closeModal);
modalOk.addEventListener("click",closeModal);
modalBackdrop.addEventListener("click",e=>{if(e.target===modalBackdrop)closeModal();});
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeModal();});

const topicDetails = {
  organik: ["Apa itu sampah organik?","Sampah organik berasal dari bahan alami yang dapat terurai, misalnya sisa sayuran, kulit buah, dan daun. Jika dikelola dengan tepat, sebagian sampah organik dapat diolah menjadi kompos. Hindari mencampurkan bahan yang tidak sesuai dengan panduan pengomposan setempat."],
  anorganik: ["Apa itu sampah anorganik?","Sampah anorganik mencakup material seperti plastik, logam, dan kaca. Sebagian dapat didaur ulang, tetapi jenis material yang diterima berbeda di setiap fasilitas. Pisahkan berdasarkan panduan pengelola sampah setempat dan pastikan kemasan cukup bersih."],
  plastik: ["Dampak sampah plastik","Plastik yang dibuang sembarangan dapat mencemari tanah dan perairan serta membahayakan satwa. Kita bisa membantu dengan mengurangi barang sekali pakai, menggunakan kembali barang yang masih layak, dan memilah material sesuai fasilitas daur ulang."],
  daurulang: ["Pentingnya daur ulang","Daur ulang mengolah material bekas menjadi bahan yang dapat digunakan kembali. Langkah awal yang baik adalah mengurangi konsumsi, menggunakan kembali barang, lalu memilah material yang diterima fasilitas pengolahan."],
  air: ["Bijak menggunakan air","Gunakan air secukupnya, tutup keran ketika tidak digunakan, perbaiki kebocoran, dan gunakan kembali air yang aman untuk keperluan yang sesuai. Kebiasaan kecil bisa membantu mengurangi pemborosan air."],
  energi: ["Hemat energi di rumah","Matikan lampu dan perangkat yang tidak digunakan, manfaatkan cahaya alami, dan pilih perangkat hemat energi bila memungkinkan. Ingat untuk tetap mengikuti panduan keselamatan saat menggunakan peralatan listrik."]
};
document.querySelectorAll(".learn-more").forEach(button=>button.addEventListener("click",()=>{
  const detail=topicDetails[button.dataset.topic];
  if(detail)openModal(detail[0],`<p>${detail[1]}</p>`,"Materi edukasi");
}));

function runEducationSearch(){
  const query=document.getElementById("educationSearch").value.trim().toLowerCase();
  let shown=0;
  document.querySelectorAll(".education-card").forEach(card=>{
    const match=!query || (card.dataset.search+" "+card.innerText).toLowerCase().includes(query);
    card.classList.toggle("filtered-out",!match);
    if(match)shown++;
  });
  document.getElementById("educationEmpty").classList.toggle("hidden",shown>0);
}
document.getElementById("educationSearchButton").addEventListener("click",runEducationSearch);
document.getElementById("educationSearch").addEventListener("input",runEducationSearch);
document.getElementById("educationSearch").addEventListener("keydown",e=>{if(e.key==="Enter")runEducationSearch();});

function runWasteSearch(){
  const input=document.getElementById("wasteSearch");
  const query=input.value.trim().toLowerCase();
  const feedback=document.getElementById("wasteFeedback");
  const cards=[...document.querySelectorAll(".waste-card")];
  let matches=[];
  cards.forEach(card=>{
    const haystack=(card.dataset.items+" "+card.innerText).toLowerCase();
    const match=!query||haystack.includes(query);
    card.classList.toggle("filtered-out",!match);
    if(query&&match)matches.push(card.querySelector("h3").textContent);
  });
  if(!query){feedback.classList.add("hidden");feedback.textContent="";return;}
  feedback.classList.remove("hidden");
  feedback.textContent=matches.length
    ? `Hasil pencarian “${input.value.trim()}”: ${matches.join(", ")}. Periksa kembali panduan pengelolaan sampah di daerahmu.`
    : `Belum ditemukan kategori untuk “${input.value.trim()}”. Coba kata kunci seperti botol plastik, daun, kertas, atau baterai.`;
}
document.getElementById("wasteSearchButton").addEventListener("click",runWasteSearch);
document.getElementById("wasteSearch").addEventListener("input",runWasteSearch);
document.getElementById("wasteSearch").addEventListener("keydown",e=>{if(e.key==="Enter")runWasteSearch();});

document.querySelectorAll(".save-tip").forEach(button=>button.addEventListener("click",()=>{
  const saved=button.classList.toggle("saved");
  button.setAttribute("aria-pressed",String(saved));
  button.textContent=saved?"♥ Tersimpan":"♡ Simpan tips";
}));

document.querySelectorAll(".filter-pill").forEach(button=>button.addEventListener("click",()=>{
  document.querySelectorAll(".filter-pill").forEach(b=>b.classList.toggle("selected",b===button));
  const filter=button.dataset.filter;
  document.querySelectorAll(".event-card").forEach(card=>{
    card.classList.toggle("filtered-out",filter!=="semua"&&card.dataset.category!==filter);
  });
}));

document.querySelectorAll(".event-detail").forEach(button=>button.addEventListener("click",()=>{
  const title=button.dataset.event;
  openModal(title,`<p>Ini adalah contoh konsep kegiatan GreenStep. Kegiatan dapat berupa aktivitas komunitas untuk menjaga kebersihan, menanam tanaman, atau belajar memilah sampah.</p><p><strong>Langkah selanjutnya:</strong> tentukan penyelenggara, tanggal, lokasi, kebutuhan peserta, serta aturan keselamatan sebelum kegiatan diumumkan secara resmi.</p><p class="tag">Contoh kegiatan — belum merupakan acara resmi</p>`,"Detail kegiatan");
}));

function showJoinForm(){
  openModal("Kirim minat kegiatan",`<p>Isi formulir simulasi ini untuk mencoba alur partisipasi. Data tidak dikirim ke server; formulir hanya berjalan di browser ini.</p>
  <form class="modal-form" id="joinForm">
    <label>Nama<input name="name" required placeholder="Nama kamu"></label>
    <label>Email<input name="email" type="email" required placeholder="nama@email.com"></label>
    <label>Minat kegiatan<select name="interest" required><option value="">Pilih kegiatan</option><option>Aksi Bersih Lingkungan</option><option>Gerakan Menanam Pohon</option><option>Belajar Pilah Sampah</option><option>Ide kegiatan lainnya</option></select></label>
    <label>Pesan (opsional)<textarea name="message" placeholder="Ceritakan ide atau pertanyaanmu..."></textarea></label>
    <button class="button button-primary" type="submit">Kirim formulir ↗</button>
  </form>`, "Formulir partisipasi", false);
  document.getElementById("joinForm").addEventListener("submit",e=>{
    e.preventDefault();
    const form=e.currentTarget;
    const name=form.elements.name.value.trim();
    const interest=form.elements.interest.value;
    modalBody.innerHTML=`<div class="form-success"><strong>Terima kasih, ${escapeHtml(name)}! 🌱</strong><br>Minatmu pada “${escapeHtml(interest)}” sudah tercatat untuk simulasi demo ini. Data belum dikirim ke server atau disimpan sebagai pendaftaran sungguhan.</div>`;
    modalOk.classList.remove("hidden");
  });
}
document.getElementById("openJoin").addEventListener("click",showJoinForm);
document.getElementById("footerContact").addEventListener("click",()=>openModal("Hubungi GreenStep",`<p>GreenStep adalah proyek edukasi lingkungan. Untuk tugas demo, kamu dapat mengganti bagian ini dengan email atau akun kontak resmi milik pengembang jika diperlukan.</p><p><strong>Pengembang:</strong> Adi Prasetyo<br><strong>Program studi:</strong> Sistem Informasi</p>`,"Tentang GreenStep"));

function escapeHtml(str){return String(str).replace(/[&<>"']/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[char]));}
showPageFromHash();


/* Tantangan GreenStep: simpan pilihan di browser agar progres tidak hilang saat halaman dibuka ulang. */
const habitChecks = [...document.querySelectorAll(".habit-check")];
const habitProgressText = document.getElementById("habitProgressText");
const habitProgressBar = document.getElementById("habitProgressBar");
const habitProgress = document.querySelector(".habit-progress");
const habitFeedback = document.getElementById("habitFeedback");
const habitReset = document.getElementById("habitReset");
const habitStorageKey = "greenstep-habit-checks-v1";

function loadHabitChoices() {
  try {
    const saved = JSON.parse(localStorage.getItem(habitStorageKey) || "[]");
    habitChecks.forEach(check => { check.checked = saved.includes(check.dataset.habit); });
  } catch (error) {
    // Jika penyimpanan browser tidak tersedia, checklist tetap berfungsi selama halaman terbuka.
  }
}
function updateHabitProgress(save = true) {
  const done = habitChecks.filter(check => check.checked).length;
  const total = habitChecks.length;
  const percent = total ? Math.round(done / total * 100) : 0;
  if (habitProgressText) habitProgressText.textContent = `${done} dari ${total} selesai`;
  if (habitProgressBar) habitProgressBar.style.width = `${percent}%`;
  if (habitProgress) habitProgress.setAttribute("aria-valuenow", String(done));
  if (habitFeedback) {
    habitFeedback.textContent = done === total
      ? "Hebat! Semua aksi pilihanmu sudah dicentang. Pertahankan kebiasaan baik ini! 🌿"
      : done > 0
        ? `Bagus, ${done} aksi sudah kamu pilih. Lanjutkan pelan-pelan, tidak harus langsung sempurna.`
        : "Pilih satu aksi kecil untuk memulai.";
  }
  if (save) {
    try {
      localStorage.setItem(habitStorageKey, JSON.stringify(habitChecks.filter(check => check.checked).map(check => check.dataset.habit)));
    } catch (error) {
      // Mode privat atau pengaturan browser tertentu dapat menonaktifkan penyimpanan lokal.
    }
  }
}
habitChecks.forEach(check => check.addEventListener("change", () => updateHabitProgress()));
if (habitReset) habitReset.addEventListener("click", () => {
  habitChecks.forEach(check => { check.checked = false; });
  updateHabitProgress();
});
loadHabitChoices();
updateHabitProgress(false);
