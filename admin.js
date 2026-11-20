// ===== MeowMate - interaksi dashboard admin =====
// Semua data adalah SIMULASI dan hanya ada di memori browser (hilang saat reload).
const $ = id => document.getElementById(id);
const rupiah = n => 'Rp' + n.toLocaleString('id-ID');
const warna = { 'Disetujui': 'success', 'Menunggu': 'warning text-dark', 'Menunggu Verifikasi': 'warning text-dark', 'Ditolak': 'danger' };
const badge = t => `<span class="badge bg-${warna[t]}">${t}</span>`;

let postingan = [
  { judul: 'Mochi santai di jendela', user: 'Rina', tanggal: '2026-10-01', status: 'Menunggu' },
  { judul: 'Si Oyen habis mandi', user: 'Budi', tanggal: '2026-10-03', status: 'Disetujui' },
  { judul: 'Dua bersaudara tidur bareng', user: 'Sari', tanggal: '2026-10-05', status: 'Menunggu' }];
let events = [
  { nama: 'Hari Adopsi Kucing', pengaju: 'Dewi', tanggal: '2026-12-06', status: 'Menunggu Verifikasi' },
  { nama: 'Workshop Grooming', pengaju: 'Andi', tanggal: '2026-11-29', status: 'Menunggu Verifikasi' },
  { nama: 'Bazar Aksesoris Kucing', pengaju: 'Tia', tanggal: '2026-11-10', status: 'Disetujui' }];
const donasi = [
  { nama: 'Rina', program: 'Steril Kucing Jalanan', nominal: 50000, tanggal: '2026-10-02' },
  { nama: 'Budi', program: 'Pakan untuk Shelter', nominal: 100000, tanggal: '2026-10-04' },
  { nama: 'Sari', program: 'Pengobatan Kucing Sakit', nominal: 75000, tanggal: '2026-10-06' }];
let pengguna = [
  { nama: 'Rina Putri', email: 'rina@gmail.com', gabung: '2026-08-12', aktif: true },
  { nama: 'Budi Santoso', email: 'budi@gmail.com', gabung: '2026-08-20', aktif: true },
  { nama: 'Sari Dewi', email: 'sari@gmail.com', gabung: '2026-09-02', aktif: false }];
const aktivitas = [
  { waktu: '10 Okt 09:10', user: 'Rina', aksi: 'Mengunggah foto "Mochi santai"' },
  { waktu: '10 Okt 08:45', user: 'Dewi', aksi: 'Mengajukan event "Hari Adopsi Kucing"' },
  { waktu: '09 Okt 20:30', user: 'Budi', aksi: 'Donasi simulasi Rp100.000' }];
const totalDonasi = () => donasi.reduce((j, d) => j + d.nominal, 0);

function tampilDashboard() {
  $('statPostingan').textContent = postingan.length; $('statEvent').textContent = events.length;
  $('statDonasi').textContent = rupiah(totalDonasi()); $('statPengguna').textContent = pengguna.length;
  $('tabelAktivitas').innerHTML = aktivitas.map(a => `<tr><td>${a.waktu}</td><td>${a.user}</td><td>${a.aksi}</td></tr>`).join('');
}
function tampilPostingan() {
  $('tabelPostingan').innerHTML = postingan.length ? postingan.map((p, i) => `<tr><td>${p.judul}</td><td>${p.user}</td><td>${p.tanggal}</td><td>${badge(p.status)}</td>
    <td class="text-nowrap"><button class="btn btn-sm btn-outline-secondary" data-aksi="lihat" data-i="${i}">Lihat</button>
    <button class="btn btn-sm btn-success" data-aksi="setujui" data-i="${i}">Setujui</button>
    <button class="btn btn-sm btn-danger" data-aksi="hapus" data-i="${i}">Hapus</button></td></tr>`).join('')
    : '<tr><td colspan="5" class="text-center text-muted">Tidak ada postingan.</td></tr>';
  tampilDashboard();
}
$('tabelPostingan').addEventListener('click', e => {
  const b = e.target.closest('button'); if (!b) return;
  const i = Number(b.dataset.i), p = postingan[i];
  if (b.dataset.aksi === 'lihat') {
    $('lihatJudul').textContent = p.judul;
    $('lihatIsi').innerHTML = `<p><b>Pengguna:</b> ${p.user}</p><p><b>Tanggal:</b> ${p.tanggal}</p><p><b>Status:</b> ${p.status}</p>`;
    new bootstrap.Modal($('modalLihat')).show();
  } else if (b.dataset.aksi === 'setujui') { p.status = 'Disetujui'; tampilPostingan(); }
  else if (confirm('Hapus postingan contoh ini?')) { postingan.splice(i, 1); tampilPostingan(); }
});
function tampilEvent() {
  $('tabelEvent').innerHTML = events.map((ev, i) => `<tr><td>${ev.nama}</td><td>${ev.pengaju}</td><td>${ev.tanggal}</td><td>${badge(ev.status)}</td>
    <td class="text-nowrap"><button class="btn btn-sm btn-success" data-aksi="Disetujui" data-i="${i}">Setujui</button>
    <button class="btn btn-sm btn-danger" data-aksi="Ditolak" data-i="${i}">Tolak</button></td></tr>`).join('');
}
$('tabelEvent').addEventListener('click', e => {
  const b = e.target.closest('button'); if (!b) return;
  events[b.dataset.i].status = b.dataset.aksi; tampilEvent();     // status berubah sesuai tombol
});
function tampilDonasi() {
  const total = totalDonasi();
  $('tabelDonasi').innerHTML = donasi.map(d => `<tr><td>${d.nama}</td><td>${d.program}</td><td>${rupiah(d.nominal)}</td><td>${d.tanggal}</td></tr>`).join('');
  $('totalDonasiAdmin').textContent = rupiah(total);
  $('ringkasanDonasi').innerHTML = `<b>${donasi.length}</b> donasi simulasi, total <b>${rupiah(total)}</b>, rata-rata <b>${rupiah(Math.round(total / donasi.length))}</b>, terbesar <b>${rupiah(Math.max(...donasi.map(d => d.nominal)))}</b>. Ini bukan data keuangan sungguhan.`;
}
function tampilPengguna() {
  $('tabelPengguna').innerHTML = pengguna.map((u, i) => `<tr><td>${u.nama}</td><td>${u.email}</td><td>${u.gabung}</td>
    <td><span class="badge bg-${u.aktif ? 'success' : 'secondary'}">${u.aktif ? 'Aktif' : 'Nonaktif'}</span></td>
    <td><button class="btn btn-sm btn-outline-meow" data-i="${i}">${u.aktif ? 'Nonaktifkan' : 'Aktifkan'}</button></td></tr>`).join('');
}
$('tabelPengguna').addEventListener('click', e => {
  const b = e.target.closest('button'); if (!b) return;
  pengguna[b.dataset.i].aktif = !pengguna[b.dataset.i].aktif; tampilPengguna();
});
$('menuAdmin').addEventListener('click', e => {                   // pindah panel dari sidebar
  const link = e.target.closest('.nav-link'); if (!link) return;
  e.preventDefault();
  document.querySelectorAll('#menuAdmin .nav-link').forEach(l => l.classList.remove('active'));
  document.querySelectorAll('.panel-admin').forEach(p => p.classList.remove('aktif'));
  link.classList.add('active'); $(link.dataset.panel).classList.add('aktif');
});
tampilDashboard(); tampilPostingan(); tampilEvent(); tampilDonasi(); tampilPengguna();
