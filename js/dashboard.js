// State Data Awal Kosong (Tanpa Dummy Data)
let appData = {
  totalPortfolio: 0,
  targets: [],
  transactions: []
};

// Format Currency Utility
function formatIDR(val) {
  return 'Rp ' + Number(val).toLocaleString('id-ID');
}

// Global Chart Variables
let portfolioChart, allocationChart;

// Inisialisasi atau Update Charts
function updateCharts() {
  // 1. Grafik Portofolio (Line Chart)
  const ctx1 = document.getElementById('portfolioChart')?.getContext('2d');
  if (ctx1) {
    if (portfolioChart) portfolioChart.destroy();
    
    portfolioChart = new Chart(ctx1, {
      type: 'line',
      data: {
        labels: appData.transactions.length > 0 ? appData.transactions.map(t => t.date) : ['Mulai'],
        datasets: [{
          label: 'Portofolio',
          data: appData.transactions.length > 0 ? [appData.totalPortfolio] : [0],
          borderColor: '#6366f1',
          borderWidth: 2.5,
          tension: 0.3,
          fill: false,
          pointRadius: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { x: { display: false }, y: { display: false } }
      }
    });
  }

  // 2. Grafik Alokasi Aset (Doughnut Chart) - Bersih dari dummy jika belum ada target
  const ctx2 = document.getElementById('allocationChart')?.getContext('2d');
  const allocationLegend = document.getElementById('allocation-legend');

  if (ctx2) {
    if (allocationChart) allocationChart.destroy();

    const hasTargets = appData.targets.length > 0;
    
    // Jika belum ada target, tampilkan data kosong (abu-abu)
    const chartData = hasTargets ? appData.targets.map(t => t.current || 1) : [1];
    const chartColors = hasTargets ? ['#6366f1', '#8b5cf6', '#10b981', '#f59e0b', '#ec4899'].slice(0, appData.targets.length) : ['#334155'];

    allocationChart = new Chart(ctx2, {
      type: 'doughnut',
      data: {
        labels: hasTargets ? appData.targets.map(t => t.title) : ['Belum ada alokasi'],
        datasets: [{
          data: chartData,
          backgroundColor: chartColors,
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } }
      }
    });

    // Render Keterangan (Legend) Alokasi secara Dinamis
    if (allocationLegend) {
      allocationLegend.innerHTML = '';
      if (!hasTargets) {
        allocationLegend.innerHTML = `<p class="text-xs text-slate-500 text-center col-span-2">Belum ada data alokasi aset.</p>`;
      } else {
        appData.targets.forEach((t, index) => {
          const colorClass = ['bg-indigo-500', 'bg-violet-500', 'bg-emerald-500', 'bg-amber-500', 'bg-pink-500'][index % 5];
          allocationLegend.innerHTML += `
            <div class="flex items-center space-x-2">
              <div class="w-2.5 h-2.5 rounded-full ${colorClass}"></div>
              <span class="text-slate-300">${t.title}</span>
            </div>
          `;
        });
      }
    }
  }
}

// Render Dashboard Data secara Dinamis
function renderDashboard() {
  // 1. Update Semua Elemen Total Portofolio
  const portfolioElements = document.querySelectorAll('.main-portfolio-val');
  portfolioElements.forEach(el => {
    el.textContent = formatIDR(appData.totalPortfolio);
  });

  // 2. Render Target Cards & Dropdown Modal Setoran
  const targetsContainer = document.getElementById('targets-list');
  const selectTarget = document.getElementById('deposit-target-select');
  
  if (targetsContainer) {
    targetsContainer.innerHTML = '';
    if (selectTarget) selectTarget.innerHTML = '';

    if (appData.targets.length === 0) {
      targetsContainer.innerHTML = `
        <div class="p-6 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-2">
          <p class="text-xs text-slate-400">Belum ada target investasi.</p>
          <p class="text-[11px] text-indigo-400 font-semibold">Silakan klik "Target Baru" di atas untuk mulai menabung!</p>
        </div>
      `;
      if (selectTarget) {
        selectTarget.innerHTML = `<option value="">-- Buat target dulu di tab Portofolio --</option>`;
      }
    } else {
      appData.targets.forEach(target => {
        const goalVal = target.goal > 0 ? target.goal : 1;
        const percentage = Math.min(Math.round((target.current / goalVal) * 100), 100);
        
        targetsContainer.innerHTML += `
          <div class="p-3 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <div class="flex justify-between items-center text-xs">
              <span class="font-bold text-slate-200 flex items-center space-x-1.5">
                <span>${target.icon}</span>
                <span>${target.title}</span>
              </span>
              <span class="text-[11px] text-slate-400">${formatIDR(target.current)} / ${formatIDR(target.goal)}</span>
            </div>
            <div class="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div class="bg-indigo-500 h-full progress-bar-fill rounded-full" style="width: ${percentage}%"></div>
            </div>
            <div class="flex justify-between items-center text-[10px] text-slate-400">
              <span>Tercapai ${percentage}%</span>
              <span class="text-indigo-400 font-semibold">Sisa: ${formatIDR(target.goal - target.current)}</span>
            </div>
          </div>
        `;

        if (selectTarget) {
          selectTarget.innerHTML += `<option value="${target.id}">${target.icon} ${target.title}</option>`;
        }
      });
    }
  }

  // 3. Render Riwayat Transaksi
  const txContainer = document.getElementById('transactions-list');
  if (txContainer) {
    txContainer.innerHTML = '';
    if (appData.transactions.length === 0) {
      txContainer.innerHTML = `
        <div class="p-4 rounded-xl bg-slate-900/50 border border-slate-800/50 text-center text-xs text-slate-500">
          Belum ada riwayat setoran.
        </div>
      `;
    } else {
      appData.transactions.forEach(tx => {
        txContainer.innerHTML += `
          <div class="p-2.5 rounded-xl bg-slate-900/70 border border-slate-800/70 flex justify-between items-center text-xs">
            <div class="flex items-center space-x-2.5">
              <div class="w-7 h-7 rounded-lg bg-emerald-950/60 border border-emerald-800/40 text-emerald-400 flex items-center justify-center text-xs">
                <i class="fa-solid fa-arrow-down"></i>
              </div>
              <div>
                <p class="font-semibold text-slate-200 text-[11px]">${tx.title}</p>
                <p class="text-[9px] text-slate-500">${tx.date}</p>
              </div>
            </div>
            <span class="font-bold text-emerald-400 text-xs">+${formatIDR(tx.amount)}</span>
          </div>
        `;
      });
    }
  }

  // Update grafik setiap kali render data dipanggil
  updateCharts();
}

// Event Listeners for Modals & Forms
document.addEventListener('DOMContentLoaded', () => {
  renderDashboard();

  document.getElementById('add-transaction-btn')?.addEventListener('click', () => {
    if (appData.targets.length === 0) {
      alert('Buat target investasi terlebih dahulu sebelum melakukan setoran!');
      return;
    }
    openModal('modal-deposit');
  });

  document.getElementById('add-target-btn')?.addEventListener('click', () => {
    openModal('modal-target');
  });

  // Submit Form Setoran
  const formDeposit = document.getElementById('form-deposit');
  if (formDeposit) {
    formDeposit.addEventListener('submit', (e) => {
      e.preventDefault();
      const targetIdSelect = document.getElementById('deposit-target-select');
      const amountInput = document.getElementById('deposit-amount');
      
      if (!targetIdSelect || !amountInput) return;

      const targetId = Number(targetIdSelect.value);
      const amount = Number(amountInput.value);

      const target = appData.targets.find(t => t.id === targetId);
      if (target) {
        target.current += amount;
        appData.totalPortfolio += amount;
        
        appData.transactions.unshift({
          id: Date.now(),
          title: `Setoran ${target.title}`,
          amount: amount,
          date: 'Baru saja',
          type: 'in'
        });

        renderDashboard();
        closeModal('modal-deposit');
        formDeposit.reset();
      }
    });
  }

  // Submit Form Target Baru
  const formTarget = document.getElementById('form-target');
  if (formTarget) {
    formTarget.addEventListener('submit', (e) => {
      e.preventDefault();
      const titleInput = document.getElementById('target-title');
      const goalInput = document.getElementById('target-goal');
      const iconInput = document.getElementById('target-icon');

      if (!titleInput || !goalInput) return;

      const title = titleInput.value;
      const goal = Number(goalInput.value);
      const icon = iconInput && iconInput.value ? iconInput.value : '🎯';

      appData.targets.push({
        id: Date.now(),
        title: title,
        goal: goal,
        current: 0,
        icon: icon
      });

      renderDashboard();
      closeModal('modal-target');
      formTarget.reset();
    });
  }
});
