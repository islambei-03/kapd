/* Публичная статистика опроса для главной страницы (Chart.js + Supabase RPC). */
(function () {
  let charts = [];

  function destroyCharts() {
    charts.forEach(function (c) {
      try {
        c.destroy();
      } catch (_e) {}
    });
    charts = [];
  }

  function chartFontColor() {
    return document.body.classList.contains('light-theme') ? '#222' : '#e8dfc8';
  }

  function chartGridColor() {
    return document.body.classList.contains('light-theme')
      ? 'rgba(0,0,0,0.08)'
      : 'rgba(232,223,200,0.12)';
  }

  function render(el, payload) {
    destroyCharts();
    if (!el) return;

    const total = payload.total_responses || 0;
    const ov = payload.overall || { ai: 0, human: 0, both: 0, other: 0 };
    const byQ = payload.by_question || {};

    if (!total) {
      el.innerHTML =
        '<p class="survey-chart-note">Пока нет сохранённых ответов. После заполнения опроса статистика появится здесь.</p>';
      return;
    }

    el.innerHTML = '';

    const row = document.createElement('div');
    row.style.display = 'grid';
    row.style.gridTemplateColumns = 'minmax(220px, 1fr) minmax(260px, 2fr)';
    row.style.gap = '16px';
    row.style.alignItems = 'stretch';

    const cardPie = document.createElement('div');
    cardPie.className = 'survey-chart-card';
    cardPie.innerHTML =
      '<div class="survey-chart-title">Общее распределение ответов</div><canvas id="survey-chart-overall"></canvas>';

    const cardBar = document.createElement('div');
    cardBar.className = 'survey-chart-card';
    cardBar.innerHTML =
      '<div class="survey-chart-title">По вопросам</div><div class="survey-chart-scroll"><canvas id="survey-chart-byq"></canvas></div>';

    if (window.matchMedia && window.matchMedia('(max-width: 820px)').matches) {
      row.style.gridTemplateColumns = '1fr';
    }

    row.appendChild(cardPie);
    row.appendChild(cardBar);
    el.appendChild(row);

    const Chart = window.Chart;
    if (!Chart || typeof Chart !== 'function') {
      el.insertAdjacentHTML(
        'beforeend',
        '<p class="survey-chart-note">Chart.js не загрузился — проверьте интернет.</p>'
      );
      return;
    }

    const pieCtx = document.getElementById('survey-chart-overall');
    const barCtx = document.getElementById('survey-chart-byq');

    const labelsOv = ['За ИИ', 'За художника', '«Оба»', 'Прочее'];
    const dataOv = [Number(ov.ai) || 0, Number(ov.human) || 0, Number(ov.both) || 0, Number(ov.other) || 0];
    const colorsOv = ['#7cb8e8', '#d4b878', '#9aa7c4', '#6b7a90'];

    charts.push(
      new Chart(pieCtx, {
        type: 'doughnut',
        data: {
          labels: labelsOv,
          datasets: [
            {
              data: dataOv,
              backgroundColor: colorsOv,
              borderWidth: 1,
              borderColor: chartGridColor(),
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'bottom',
              labels: { color: chartFontColor(), boxWidth: 12 },
            },
          },
        },
      })
    );

    const qids = Object.keys(byQ)
      .map(function (k) {
        return parseInt(k, 10);
      })
      .filter(function (n) {
        return !isNaN(n);
      })
      .sort(function (a, b) {
        return a - b;
      });

    const labelsQ = qids.map(function (id) {
      return 'Вопрос ' + id;
    });

    function rowVals(key) {
      return qids.map(function (id) {
        const cell = byQ[String(id)] || {};
        return Number(cell[key]) || 0;
      });
    }

    // Делает диаграмму «по вопросам» читабельной: высота зависит от кол-ва вопросов + скролл.
    const barScroll = cardBar.querySelector('.survey-chart-scroll');
    const perRow = 20; // px per question
    const barHeight = Math.max(220, qids.length * perRow + 40);
    if (barScroll) {
      barScroll.style.maxHeight = '520px';
      barScroll.style.overflowY = 'auto';
      barScroll.style.paddingRight = '6px';
    }
    if (barCtx) {
      // Chart.js уважает высоту canvas при maintainAspectRatio=false
      barCtx.height = barHeight;
    }

    charts.push(
      new Chart(barCtx, {
        type: 'bar',
        data: {
          labels: labelsQ,
          datasets: [
            { label: 'ИИ', data: rowVals('ai'), backgroundColor: '#7cb8e8', stack: 's' },
            { label: 'Художник', data: rowVals('human'), backgroundColor: '#d4b878', stack: 's' },
            { label: 'Оба', data: rowVals('both'), backgroundColor: '#9aa7c4', stack: 's' },
            { label: 'Прочее', data: rowVals('other'), backgroundColor: '#6b7a90', stack: 's' },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          indexAxis: 'y',
          scales: {
            x: {
              stacked: true,
              ticks: { color: chartFontColor(), precision: 0 },
              grid: { color: chartGridColor() },
            },
            y: {
              stacked: true,
              ticks: { color: chartFontColor(), font: { size: 11 }, autoSkip: false },
              grid: { display: false },
            },
          },
          plugins: {
            legend: {
              position: 'bottom',
              labels: { color: chartFontColor(), boxWidth: 12, font: { size: 12 } },
            },
          },
        },
      })
    );
  }

  window.mountKapSurveyStats = function mountKapSurveyStats(cfg) {
    const el = document.getElementById('survey-charts');
    if (!el) return;

    const url = (cfg && cfg.supabaseUrl) || '';
    const key = (cfg && cfg.supabaseAnonKey) || '';
    if (!url.startsWith('http') || key.length < 20) {
      el.innerHTML =
        '<p class="survey-chart-note">Не заданы параметры Supabase для статистики.</p>';
      return;
    }
    if (!window.supabase || !window.supabase.createClient) {
      el.innerHTML =
        '<p class="survey-chart-note">Supabase SDK не загрузился — диаграммы недоступны.</p>';
      return;
    }

    const sb = window.supabase.createClient(url, key);

    (async function load() {
      el.innerHTML = '<p class="survey-chart-note">Загрузка статистики…</p>';
      const res = await sb.rpc('survey_public_stats');
      if (res.error) {
        el.innerHTML =
          '<p class="survey-chart-note">Не удалось загрузить статистику: ' +
          esc(res.error.message) +
          '. Выполните SQL из файла <code>supabase-stats.sql</code> в Supabase (SQL Editor), затем обновите страницу.</p>';
        return;
      }
      const payload = res.data;
      if (!payload || typeof payload !== 'object') {
        el.innerHTML =
          '<p class="survey-chart-note">Пустой ответ статистики. Проверьте функцию <code>survey_public_stats</code>.</p>';
        return;
      }
      render(el, payload);
    })();
  };

  function esc(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/\"/g, '&quot;');
  }
})();
