/* login_script.js */

function loginUser() {
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;
  
  const user = JSON.parse(localStorage.getItem('users'));
   
  if (!user) {
    alert('Belum ada data pengguna. Silakan daftar terlebih dahulu.');
    return;
  }

  if (email === user.email && password === user.password) {
    // MENYIMPAN STATUS LOGIN DI sessionStorage (dihapus saat browser ditutup)
    sessionStorage.setItem('isLoggedIn', 'true');
    
    alert('Login berhasil! Selamat datang, ' + user.nama);
    window.location.href = "index.html"; 
  } else {
    alert('Email atau password salah.');
  }
}