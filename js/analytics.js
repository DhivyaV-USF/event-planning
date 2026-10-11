const eventTypes = ['Wedding', 'Corporate', 'Birthday/Social'];
const eventTypeColors = ['#d6794f', '#344637', '#aeb99e'];

const sampleEvents = [
  { type: 'Wedding', guests: 145, revenue: 38500, month: '2025-11' },
  { type: 'Corporate', guests: 220, revenue: 52000, month: '2025-11' },
  { type: 'Birthday/Social', guests: 80, revenue: 14500, month: '2025-12' },
  { type: 'Wedding', guests: 175, revenue: 61000, month: '2025-12' },
  { type: 'Corporate', guests: 310, revenue: 74000, month: '2026-01' },
  { type: 'Wedding', guests: 125, revenue: 32000, month: '2026-01' },
  { type: 'Birthday/Social', guests: 95, revenue: 18500, month: '2026-02' },
  { type: 'Corporate', guests: 180, revenue: 45500, month: '2026-02' },
  { type: 'Wedding', guests: 205, revenue: 68000, month: '2026-03' },
  { type: 'Birthday/Social', guests: 65, revenue: 12200, month: '2026-03' },
  { type: 'Corporate', guests: 275, revenue: 63500, month: '2026-04' },
  { type: 'Wedding', guests: 160, revenue: 49500, month: '2026-04' },
  { type: 'Birthday/Social', guests: 110, revenue: 22500, month: '2026-05' },
  { type: 'Wedding', guests: 190, revenue: 72000, month: '2026-05' },
  { type: 'Corporate', guests: 340, revenue: 82500, month: '2026-06' },
  { type: 'Birthday/Social', guests: 75, revenue: 16000, month: '2026-06' },
  { type: 'Wedding', guests: 135, revenue: 41000, month: '2026-07' },
  { type: 'Corporate', guests: 240, revenue: 58000, month: '2026-07' },
  { type: 'Birthday/Social', guests: 120, revenue: 26000, month: '2026-08' },
  { type: 'Wedding', guests: 225, revenue: 79500, month: '2026-08' },
  { type: 'Corporate', guests: 195, revenue: 49000, month: '2026-09' },
  { type: 'Birthday/Social', guests: 90, revenue: 19500, month: '2026-09' },
  { type: 'Wedding', guests: 155, revenue: 53500, month: '2026-10' },
  { type: 'Corporate', guests: 290, revenue: 71000, month: '2026-10' }
];

const months = [
  { key: '2025-11', label: 'Nov ’25' },
  { key: '2025-12', label: 'Dec ’25' },
  { key: '2026-01', label: 'Jan ’26' },
  { key: '2026-02', label: 'Feb ’26' },
  { key: '2026-03', label: 'Mar ’26' },
  { key: '2026-04', label: 'Apr ’26' },
  { key: '2026-05', label: 'May ’26' },
  { key: '2026-06', label: 'Jun ’26' },
  { key: '2026-07', label: 'Jul ’26' },
  { key: '2026-08', label: 'Aug ’26' },
  { key: '2026-09', label: 'Sep ’26' },
  { key: '2026-10', label: 'Oct ’26' }
];

const numberFormatter = new Intl.NumberFormat('en-US');
const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0
});

function sumByType(type) {
  return sampleEvents
    .filter(event => event.type === type)
    .reduce((total, event) => total + event.revenue, 0);
}

function updateSummary() {
  const totalEvents = sampleEvents.length;
  const totalRevenue = sampleEvents.reduce((total, event) => total + event.revenue, 0);
  const guestTotal = sampleEvents.reduce((total, event) => total + event.guests, 0);
  const eventCounts = eventTypes.map(type => ({
    type,
    count: sampleEvents.filter(event => event.type === type).length
  }));
  const mostPopular = eventCounts.reduce((popular, current) =>
    current.count > popular.count ? current : popular
  );

  document.querySelector('#total-events').textContent = numberFormatter.format(totalEvents);
  document.querySelector('#total-revenue').textContent = currencyFormatter.format(totalRevenue);
  document.querySelector('#average-guests').textContent = numberFormatter.format(Math.round(guestTotal / totalEvents));
  document.querySelector('#popular-type').textContent = mostPopular.type;
  document.querySelector('#popular-type-count').textContent = `${mostPopular.count} of ${totalEvents} events`;
}

function createCharts() {
  if (!window.Chart) {
    throw new Error('Chart.js failed to load. Check the CDN connection and reload the page.');
  }

  const eventCounts = eventTypes.map(type => sampleEvents.filter(event => event.type === type).length);
  const monthlyRevenue = months.map(month =>
    sampleEvents
      .filter(event => event.month === month.key)
      .reduce((total, event) => total + event.revenue, 0)
  );
  const revenueByType = eventTypes.map(sumByType);

  Chart.defaults.font.family = "'DM Sans', Arial, sans-serif";
  Chart.defaults.color = '#6f7167';

  new Chart(document.querySelector('#events-by-type'), {
    type: 'bar',
    data: {
      labels: eventTypes,
      datasets: [{
        label: 'Number of events',
        data: eventCounts,
        backgroundColor: eventTypeColors,
        borderRadius: 5,
        borderSkipped: false,
        maxBarThickness: 74
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: false,
          text: 'Events by type'
        },
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: context => `${context.parsed.y} events`
          }
        }
      },
      scales: {
        x: {
          grid: { display: false },
          border: { display: false },
          ticks: { color: '#55584e', font: { size: 11 } }
        },
        y: {
          beginAtZero: true,
          suggestedMax: 10,
          ticks: { precision: 0, stepSize: 2 },
          grid: { color: '#eceae2' },
          border: { display: false }
        }
      }
    }
  });

  new Chart(document.querySelector('#monthly-revenue'), {
    type: 'line',
    data: {
      labels: months.map(month => month.label),
      datasets: [{
        label: 'Revenue',
        data: monthlyRevenue,
        borderColor: '#344637',
        backgroundColor: 'rgba(52, 70, 55, 0.10)',
        pointBackgroundColor: '#d6794f',
        pointBorderColor: '#fffefa',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        borderWidth: 2,
        fill: true,
        tension: 0.34
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: false,
          text: 'Monthly revenue'
        },
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: context => `Revenue: ${currencyFormatter.format(context.parsed.y)}`
          }
        }
      },
      scales: {
        x: {
          grid: { display: false },
          border: { display: false },
          ticks: { maxRotation: 0, autoSkip: true, maxTicksLimit: 12 }
        },
        y: {
          beginAtZero: true,
          ticks: {
            callback: value => `$${numberFormatter.format(value / 1000)}k`
          },
          grid: { color: '#eceae2' },
          border: { display: false }
        }
      }
    }
  });

  new Chart(document.querySelector('#revenue-by-type'), {
    type: 'doughnut',
    data: {
      labels: eventTypes,
      datasets: [{
        label: 'Revenue',
        data: revenueByType,
        backgroundColor: eventTypeColors,
        borderColor: '#fffefa',
        borderWidth: 4,
        hoverOffset: 7
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '65%',
      plugins: {
        title: {
          display: false,
          text: 'Revenue share by event type'
        },
        legend: {
          display: true,
          position: 'bottom',
          labels: {
            usePointStyle: true,
            pointStyle: 'circle',
            padding: 18,
            font: { size: 10 }
          }
        },
        tooltip: {
          callbacks: {
            label: context => {
              const total = context.dataset.data.reduce((sum, value) => sum + value, 0);
              const share = (context.parsed / total * 100).toFixed(1);
              return `${context.label}: ${currencyFormatter.format(context.parsed)} (${share}%)`;
            }
          }
        }
      }
    }
  });
}

updateSummary();
createCharts();
