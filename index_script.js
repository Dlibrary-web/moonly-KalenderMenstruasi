/* index_script.js */
// LOGIKA REDIRECT/Sesi Baru: Cek apakah ada data DAN sesi aktif di sessionStorage.
const isLoggedIn = sessionStorage.getItem('isLoggedIn');
const hasData = localStorage.getItem("datapengguna");

if (!hasData || isLoggedIn !== 'true') {
    window.location.href = "login.html";
}

const bulanNama = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
const dataPengguna = JSON.parse(localStorage.getItem('datapengguna')) || {};

let markedHaid = JSON.parse(localStorage.getItem('marked_haid')) || {};
const haid2 = dataPengguna.haid2;
const haid1 = dataPengguna.haid1;

const durasiHaid = 7; 
let currentYear = new Date().getFullYear(); 
if (currentYear < 2025) currentYear = 2025;
document.getElementById('currentYearTitle').textContent = `Kalender Menstruasi ${currentYear}`;

// --- NAVIGASI TAHUN ---
function changeYear(offset) {
    currentYear += offset;
    document.getElementById('currentYearTitle').textContent = `Kalender Menstruasi ${currentYear}`;
    renderCalendar();
}

// --- FUNGSI UTAMA TRACKING & PREDIKSI ---
function saveMarkedHaid() {
    localStorage.setItem('marked_haid', JSON.stringify(markedHaid));
}

function cleanUpMarkedHaid() {
    let lastHaidDate = null;
    const markedKeys = Object.keys(markedHaid).sort();
    if (markedKeys.length > 0) {
        const lastMarkedKey = markedKeys[markedKeys.length - 1];
        const parts = lastMarkedKey.split('-');
        lastHaidDate = new Date(parseInt(parts[0]), parseInt(parts[1]), parseInt(parts[2])); 
    } 
    if (!lastHaidDate && haid1 && haid1 !== 'Tidak ingat') {
         lastHaidDate = new Date(haid1.akhir);
    } else if (!lastHaidDate && haid2 && haid2 !== 'Tidak ingat') {
         lastHaidDate = new Date(haid2.akhir);
    }
    if (lastHaidDate) {
        let nextPrediksiStart = new Date(lastHaidDate);
        nextPrediksiStart.setDate(nextPrediksiStart.getDate() + 24); 

        const keysToDelete = Object.keys(markedHaid).filter(k => {
            const parts = k.split('-');
            const date = new Date(parseInt(parts[0]), parseInt(parts[1]), parseInt(parts[2]));
            return date > nextPrediksiStart;
        });
        keysToDelete.forEach(key => {
            delete markedHaid[key];
        });
        saveMarkedHaid();
    }
}

function handleDayClick(year, month, day, dayDiv) {
    if (dayDiv.classList.contains('inactive')) return; 
    const dateKey = `${year}-${month}-${day}`; 

    if (dayDiv.classList.contains('marked-haid')) {
        dayDiv.classList.remove('marked-haid');
        delete markedHaid[dateKey];
    } else {
        dayDiv.classList.add('marked-haid');
        markedHaid[dateKey] = true;
    }
    saveMarkedHaid();
    cleanUpMarkedHaid(); 
    renderCalendar(); 
}

function getLastHaidEndDate(currentYear, currentMonth, currentDay) {
    let lastHaidEnd = null;
    const allEndDates = [];
    const markedKeys = Object.keys(markedHaid).filter(k => {
        const parts = k.split('-');
        const date = new Date(parseInt(parts[0]), parseInt(parts[1]), parseInt(parts[2]));
        const currentDate = new Date(currentYear, currentMonth, currentDay);
        return date < currentDate;
    }).sort();
    
    if (markedKeys.length > 0) {
        const lastMarkedKey = markedKeys[markedKeys.length - 1];
        const parts = lastMarkedKey.split('-');
        allEndDates.push(new Date(parseInt(parts[0]), parseInt(parts[1]), parseInt(parts[2])));
    }
    if (haid1 && haid1 !== 'Tidak ingat') {
         allEndDates.push(new Date(haid1.akhir));
    }
    if (haid2 && haid2 !== 'Tidak ingat') {
         allEndDates.push(new Date(haid2.akhir));
    }
    if (allEndDates.length > 0) {
        const mostRecentEndDate = allEndDates.sort((a, b) => b - a)[0];
        const currentDate = new Date(currentYear, currentMonth, currentDay);
        if (mostRecentEndDate < currentDate) {
            lastHaidEnd = mostRecentEndDate;
        }
    }
    return lastHaidEnd;
}

// --- FUNGSI UTAMA KALENDER ---
function buatKalender(bulan, tahun) {
    const monthDiv = document.createElement('div');
    monthDiv.classList.add('month');
    const title = document.createElement('h2');
    title.textContent = bulanNama[bulan] + ' ' + tahun;
    monthDiv.appendChild(title);
    const daysDiv = document.createElement('div');
    daysDiv.classList.add('days');
    const totalHari = new Date(tahun, bulan + 1, 0).getDate();

    for (let d = 1; d <= totalHari; d++) {
        const dayDiv = document.createElement('div');
        dayDiv.classList.add('day');
        dayDiv.textContent = d;
        const dateKey = `${tahun}-${bulan}-${d}`;

        // 1. TANDAI HAID AWAL (Hanya 2025, Juli & Agustus)
        if (tahun === 2025) {
            if (bulan === 6 && haid2 !== 'Tidak ingat') {
                const mulai = new Date(haid2.mulai);
                const akhir = new Date(haid2.akhir);
                const tglSekarang = new Date(tahun, bulan, d);
                if (tglSekarang >= mulai && tglSekarang <= akhir) {
                    dayDiv.classList.add('haid');
                }
            }
            if (bulan === 7 && haid1 !== 'Tidak ingat') {
                const mulai = new Date(haid1.mulai);
                const akhir = new Date(haid1.akhir);
                const tglSekarang = new Date(tahun, bulan, d);
                if (tglSekarang >= mulai && tglSekarang <= akhir) {
                    dayDiv.classList.add('haid');
                }
            }
        }
        
        // 2. TANDAI HAID BARU OLEH PENGGUNA
        if (markedHaid[dateKey]) {
            dayDiv.classList.add('marked-haid');
        }

        // 3. PREDISKI HAID (23 hari setelah selesai)
        if (!dayDiv.classList.contains('haid') && !dayDiv.classList.contains('marked-haid')) {
            let lastHaidEnd = getLastHaidEndDate(tahun, bulan, d);
            if (lastHaidEnd) {
                let prediksiMulai = new Date(lastHaidEnd);
                prediksiMulai.setDate(prediksiMulai.getDate() + 24); 
                let prediksiAkhir = new Date(prediksiMulai);
                prediksiAkhir.setDate(prediksiMulai.getDate() + (durasiHaid - 1)); 
                const tglSekarang = new Date(tahun, bulan, d);
                const siklusPenuh = 24 + (durasiHaid - 1); 
                
                let tempPrediksiMulai = new Date(prediksiMulai);
                let tempPrediksiAkhir = new Date(prediksiAkhir);
                while (tempPrediksiAkhir < tglSekarang) {
                    tempPrediksiMulai.setDate(tempPrediksiMulai.getDate() + siklusPenuh);
                    tempPrediksiAkhir.setDate(tempPrediksiMulai.getDate() + (durasiHaid - 1));
                }
                if (tglSekarang >= tempPrediksiMulai && tglSekarang <= tempPrediksiAkhir) 
                {
                     dayDiv.classList.add('prediksi');
                }
            }
        }
        
        dayDiv.addEventListener('click', () => {
            if (dayDiv.classList.contains('prediksi')) {
                dayDiv.classList.remove('prediksi');
            }
            handleDayClick(tahun, bulan, d, dayDiv);
        });

        daysDiv.appendChild(dayDiv);
    }
    
    // Tambahkan tanggal kosong di awal bulan
    const firstDayOfMonth = new Date(tahun, bulan, 1).getDay();
    const startOffset = (firstDayOfMonth === 0) ? 6 : firstDayOfMonth - 1; 
    for (let i = 0; i < startOffset; i++) {
        const empty = document.createElement('div');
        empty.classList.add('day', 'inactive');
        daysDiv.prepend(empty);
    }

    monthDiv.appendChild(daysDiv);
    return monthDiv;
}

const calendarDiv = document.getElementById('calendar');

function renderCalendar() {
    calendarDiv.innerHTML = ''; 
    cleanUpMarkedHaid(); 
    const startMonth = (currentYear === 2025) ? 6 : 0; 
    const endMonth = 11; 

    for (let m = startMonth; m <= endMonth; m++) {
        calendarDiv.appendChild(buatKalender(m, currentYear));
    }
}
renderCalendar();