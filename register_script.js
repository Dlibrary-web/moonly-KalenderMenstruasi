/* register_script.js */
let dataPengguna = {};

function saveStep1() {
  const nama = document.getElementById('nama').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  if (!nama || !email || !password) {
    alert('Harap isi semua data');
    return;
  }

  localStorage.setItem('users', JSON.stringify({ nama, email, password }));

  document.getElementById('step1').classList.add('hidden');
  document.getElementById('step2').classList.remove('hidden');
}

function saveStep2() {
  const usia = document.getElementById('usia').value;
  if (!usia) {
    alert('Isi usia terlebih dahulu');
    return;
  }
  dataPengguna.usia = usia;

  document.getElementById('step2').classList.add('hidden');
  document.getElementById('step3').classList.remove('hidden');
}

function saveStep3() {
  const mulai = document.getElementById('haid2Mulai').value;
  const akhir = document.getElementById('haid2Akhir').value;
  if (!mulai || !akhir) {
    alert('Isi tanggal mulai dan berakhir, atau klik tidak ingat');
    return;
  }
  dataPengguna.haid2 = { mulai, akhir };

  document.getElementById('step3').classList.add('hidden');
  document.getElementById('step4').classList.remove('hidden');
}

function skipHaid2() {
  dataPengguna.haid2 = 'Tidak ingat';
  document.getElementById('step3').classList.add('hidden');
  document.getElementById('step4').classList.remove('hidden');
}

function saveStep4() {
  const mulai = document.getElementById('haid1Mulai').value;
  const akhir = document.getElementById('haid1Akhir').value;
  if (!mulai || !akhir) {
    alert('Isi tanggal mulai dan berakhir, atau klik tidak ingat');
    return;
  }
  dataPengguna.haid1 = { mulai, akhir };

  document.getElementById('step4').classList.add('hidden');
  document.getElementById('step5').classList.remove('hidden');
}

function skipHaid1() {
  dataPengguna.haid1 = 'Tidak ingat';
  document.getElementById('step4').classList.add('hidden');
  document.getElementById('step5').classList.remove('hidden');
}

function saveStep5() {
  const status = document.getElementById('statusNikah').value;
  if (!status) {
    alert('Pilih status pernikahan');
    return;
  }
  dataPengguna.statusNikah = status;

  localStorage.setItem('datapengguna', JSON.stringify(dataPengguna));

  document.getElementById('step5').classList.add('hidden');
  document.getElementById('done').classList.remove('hidden');

  // Arahkan ke login.html setelah selesai
  setTimeout(() => {
    window.location.href = "login.html";
  }, 1500);
}