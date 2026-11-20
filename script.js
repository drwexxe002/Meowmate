// ===== MeowMate - interaksi halaman pengguna =====
// Data hanya ada di memori browser, jadi HILANG saat halaman dimuat ulang.
const $ = id => document.getElementById(id);
const SVG_CADANGAN = 'data:image/svg+xml;utf8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400"><rect width="100%" height="100%" fill="#e8b4b8"/><text x="50%" y="50%" font-size="80" text-anchor="middle" dominant-baseline="middle">🐱</text></svg>');
function gantiGambar(img) { img.onerror = null; img.src = SVG_CADANGAN; }   // gambar pengganti jika gagal dimuat
const FOTO_LOKAL = ['assets/kucing1.jpg', 'assets/kucing2.jpg', 'assets/kucing3.jpg', 'assets/kucing4.jpg','assets/kucing5.jpg','assets/kucing6.jpg', 'assets/kucing7.jpg'];
const gambar = n => FOTO_LOKAL[n % FOTO_LOKAL.length];
const rupiah = n => 'Rp' + n.toLocaleString('id-ID');
function aman(t) { const d = document.createElement('div'); d.textContent = t; return d.innerHTML; }  // cegah teks dibaca sebagai HTML
const warna = { 'Disetujui': 'success', 'Menunggu Verifikasi': 'warning text-dark', 'Ditolak': 'danger' };
function valid(form) { form.classList.add('was-validated'); return form.checkValidity(); }
function selesai(form, modalId) { form.reset(); form.classList.remove('was-validated'); if (modalId) bootstrap.Modal.getInstance($(modalId)).hide(); }

// ---------- DATA CONTOH ----------
let fotoList = [
  { nama: 'Rina', caption: 'Mochi santai di halaman rumah', img: gambar(2), suka: 12 },
  { nama: 'Budi', caption: 'Si hideng habis mandi', img: gambar(0), suka: 8 },
  { nama: 'Sari', caption: 'Mimi lagi ngapain??', img: gambar(1), suka: 21 }];
let diskusiList = [
  { judul: 'Kapan jadwal vaksin kucing anak?', nama: 'Dewi', kategori: 'Vaksinasi', komentar: 6 },
  { judul: 'Makanan basah atau kering, mana lebih baik?', nama: 'Andi', kategori: 'Makanan', komentar: 11 },
  { judul: 'Cara merawat bulu agar tidak rontok', nama: 'Tia', kategori: 'Perawatan Bulu', komentar: 4 }];
let eventList = [
  { nama: 'Penggalangan Dana Kucing Jalanan', tanggal: '2026-11-15', lokasi: 'Taman Kota', desk: 'Mengumpulkan dana untuk pakan dan steril kucing jalanan.', status: 'Disetujui', img: 'assets/kucing4.jpg' },
  { nama: 'Workshop Perawatan Kucing', tanggal: '2026-11-29', lokasi: 'Aula Komunitas', desk: 'Belajar grooming dan mengenali tanda kucing sakit.', status: 'Disetujui', img: 'assets/kucing5.jpg' },
  { nama: 'Hari Adopsi Kucing', tanggal: '2026-12-06', lokasi: 'Lapangan Desa', desk: 'Bertemu kucing yang mencari rumah baru.', status: 'Menunggu Verifikasi', img: 'assets/kucing6.jpg' },
  { nama: 'Lomba Kucing Terlucu', tanggal: '2026-10-20', lokasi: 'Gedung Serbaguna', desk: 'Ditolak karena jadwal bentrok.', status: 'Ditolak', img: 'assets/kucing7.jpg' }];
const programList = [
  { nama: 'Steril Kucing Jalanan', desk: 'Mengendalikan populasi kucing liar secara manusiawi.', target: 5000000 },
  { nama: 'Pakan untuk Shelter', desk: 'Pakan bulanan untuk kucing di shelter.', target: 3000000 },
  { nama: 'Pengobatan Kucing Sakit', desk: 'Biaya pengobatan kucing terlantar.', target: 4000000 }];
let donasiList = [];

// ---------- GALERI ----------
function tampilFoto() {
  $('daftarFoto').innerHTML = fotoList.map((f, i) => `
    <div class="col-sm-6 col-lg-4"><div class="card h-100">
      <img src="${f.img}" class="card-img-top" alt="${aman(f.caption)}" onerror="gantiGambar(this)">
      <div class="card-body"><h6>${aman(f.caption)}</h6><small class="text-muted">oleh ${aman(f.nama)}</small>
        <div class="mt-2"><button class="btn-like" data-i="${i}"><i class="bi bi-heart-fill"></i> <span>${f.suka}</span> suka</button></div></div></div></div>`).join('');
}
$('daftarFoto').addEventListener('click', e => {          // satu listener untuk semua tombol suka
  const b = e.target.closest('.btn-like'); if (!b) return;
  const f = fotoList[b.dataset.i]; f.suka++; b.querySelector('span').textContent = f.suka;
});
$('fotoFile').addEventListener('change', e => {            // pratinjau gambar pilihan
  const file = e.target.files[0];
  if (!file) return $('fotoPreview').classList.add('d-none');
  const r = new FileReader();
  r.onload = () => { $('fotoPreview').src = r.result; $('fotoPreview').classList.remove('d-none'); };
  r.readAsDataURL(file);
});
$('formFoto').addEventListener('submit', e => {
  e.preventDefault(); if (!valid(e.target)) return;
  fotoList.unshift({ nama: $('fotoNama').value.trim(), caption: $('fotoCaption').value.trim(), img: $('fotoPreview').src, suka: 0 });
  tampilFoto(); $('fotoPreview').classList.add('d-none'); selesai(e.target, 'modalFoto');
});

// ---------- DISKUSI ----------
function tampilDiskusi() {
  $('daftarDiskusi').innerHTML = diskusiList.map(d => `
    <div class="list-group-item d-flex justify-content-between align-items-center flex-wrap">
      <div><h6 class="mb-1">${aman(d.judul)}</h6><small class="text-muted">oleh ${aman(d.nama)}</small></div>
      <div><span class="badge badge-pink me-2">${aman(d.kategori)}</span><span class="badge bg-secondary"><i class="bi bi-chat"></i> ${d.komentar}</span></div></div>`).join('');
}
$('formDiskusi').addEventListener('submit', e => {
  e.preventDefault(); if (!valid(e.target)) return;
  diskusiList.unshift({ judul: $('diskusiJudul').value.trim(), nama: $('diskusiNama').value.trim(), kategori: $('diskusiKategori').value, komentar: 0 });
  tampilDiskusi(); selesai(e.target, 'modalDiskusi');
});

// ---------- EVENT ----------
function tampilEvent() {
  $('daftarEvent').innerHTML = eventList.map((ev, i) => `
    <div class="col-md-6 col-lg-4"><div class="card h-100">
      <img src="${ev.img}" class="card-img-top" alt="${aman(ev.nama)}" onerror="gantiGambar(this)">
      <div class="card-body"><span class="badge bg-${warna[ev.status]} mb-2">${ev.status}</span>
        <h5>${aman(ev.nama)}</h5>
        <p class="mb-1"><i class="bi bi-calendar3"></i> ${ev.tanggal}</p>
        <p class="mb-2"><i class="bi bi-geo-alt"></i> ${aman(ev.lokasi)}</p>
        <p class="small">${aman(ev.desk)}</p>
        <button class="btn btn-outline-meow btn-sm btn-detail" data-i="${i}">Lihat Detail</button></div></div></div>`).join('');
}
$('daftarEvent').addEventListener('click', e => {
  const b = e.target.closest('.btn-detail'); if (!b) return;
  const ev = eventList[b.dataset.i];
  $('detailJudul').textContent = ev.nama;
  $('detailIsi').innerHTML = `<p><b>Tanggal:</b> ${ev.tanggal}</p><p><b>Lokasi:</b> ${aman(ev.lokasi)}</p><p><b>Status:</b> ${ev.status}</p><p>${aman(ev.desk)}</p>`;
  new bootstrap.Modal($('modalDetail')).show();
});
$('formEvent').addEventListener('submit', e => {
  e.preventDefault(); if (!valid(e.target)) return;
  eventList.unshift({ nama: $('eventNama').value.trim(), tanggal: $('eventTanggal').value, lokasi: $('eventLokasi').value.trim(),
    desk: $('eventDeskripsi').value.trim(), status: 'Menunggu Verifikasi', img: gambar(9) });
  tampilEvent(); selesai(e.target, 'modalEvent');
});

// ---------- DONASI (SIMULASI) ----------
function tampilProgram() {
  $('daftarProgram').innerHTML = programList.map(p => `
    <div class="col-md-4"><div class="card h-100 p-3"><h5>${p.nama}</h5><p class="small">${p.desk}</p>
    <p class="mb-0"><b>Target ilustratif:</b> ${rupiah(p.target)}</p></div></div>`).join('');
  $('donaturProgram').innerHTML = '<option value="">Pilih program...</option>' + programList.map(p => `<option>${p.nama}</option>`).join('');
}
function tampilDonasi() {
  $('totalDonasi').textContent = rupiah(donasiList.reduce((j, d) => j + d.nominal, 0));
  $('daftarDonasi').innerHTML = donasiList.length
    ? donasiList.map(d => `<li class="list-group-item d-flex justify-content-between"><span>${aman(d.nama)} - ${d.program}</span><b>${rupiah(d.nominal)}</b></li>`).join('')
    : '<li class="list-group-item text-muted">Belum ada donasi.</li>';
}
$('formDonasi').addEventListener('submit', e => {
  e.preventDefault(); if (!valid(e.target)) return;
  donasiList.push({ nama: $('donaturNama').value.trim(), program: $('donaturProgram').value, nominal: Number($('donaturNominal').value) });
  tampilDonasi(); selesai(e.target);
});

// ---------- IKON TIMBUL SAAT DI-SCROLL ----------
const pengamat = new IntersectionObserver((daftar) => {
  daftar.forEach((entri) => {
    if (entri.isIntersecting) {
      entri.target.classList.add('tampil');
      pengamat.unobserve(entri.target); // animasi cukup sekali
    }
  });
}, { threshold: 0.15 });

function pasangReveal() {
  document.querySelectorAll('.reveal:not(.diamati)').forEach((el) => {
    el.classList.add('diamati');
    pengamat.observe(el);
  });
}
pasangReveal();
// ---------- TAMPILKAN DATA SAAT HALAMAN DIBUKA ----------
tampilFoto();
tampilDiskusi();
tampilEvent();
tampilProgram();
tampilDonasi();