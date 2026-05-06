// Опрос без ES-модулей (работает при file:// и на хостинге).
// Требует, чтобы до него был подключен:
// https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.49.1/dist/umd/supabase.min.js
(function () {
  const QUESTIONS = [
    { section: 'Блок 1. Пётр Гринёв', id: 1, text: 'Пушкин описывает Гринёва как честного человека, верного своему слову. Чьё изображение точнее передаёт образ благородного офицера?', options: ['Художнику — лицо открытое и честное', 'ИИ — облик молодого офицера убедителен', 'Оба одинаково передают этот образ', 'Я представляю его иначе', 'Свой ответ'], customLast: true },
    { section: 'Блок 1. Пётр Гринёв', id: 2, text: 'Гринёв говорит: «Только не требуй того, что противно чести моей и христианской совести». Видна ли эта твёрдость характера в изображениях?', options: ['Да, у художника — по позе и взгляду', 'Да, у ИИ — по выражению лица', 'Оба одинаково передают твёрдость', 'Я визуализирую этот момент иначе', 'Свой ответ'], customLast: true },
    { section: 'Блок 1. Пётр Гринёв', id: 3, text: 'Кому лучше удался образ Гринёва?', options: ['Художнику — он передал характер героя через сцену', 'ИИ — детали эпохи и костюма переданы точнее', 'Оба справились одинаково хорошо', 'Я бы нарисовал(а) его иначе', 'Свой ответ'], customLast: true },
    { section: 'Блок 2. Маша Миронова', id: 4, text: 'Пушкин описывает Машу: «круглолицая, румяная, с светло-русыми волосами», скромная, без жеманства. Чьё изображение точнее совпадает с этим описанием?', options: ['Художнику — образ живой и тёплый', 'ИИ — внешние детали совпадают с текстом', 'Оба близки к описанию Пушкина', 'Я представляю её иначе', 'Свой ответ'], customLast: true },
    { section: 'Блок 2. Маша Миронова', id: 5, text: 'Маша решается обратиться к самой императрице, чтобы спасти Гринёва. Видна ли эта внутренняя сила в изображениях?', options: ['Да, у художника — в сцене и позе чувствуется характер', 'Да, у ИИ — взгляд говорит о силе духа', 'Оба одинаково передают внутреннюю силу', 'Я визуализирую этот образ иначе', 'Свой ответ'], customLast: true },
    { section: 'Блок 2. Маша Миронова', id: 6, text: 'Кому лучше удался образ Маши?', options: ['Художнику — он передал хрупкость и внутреннюю силу', 'ИИ — образ нежной девушки получился убедительным', 'Оба справились одинаково хорошо', 'Я бы нарисовал(а) её иначе', 'Свой ответ'], customLast: true },
    { section: 'Блок 3. Емельян Пугачёв', id: 7, text: 'Пушкин описывает Пугачёва: «лицо приятное, но плутовское», «огненный взгляд». Чьё изображение точнее соответствует этому описанию?', options: ['Художнику — он уловил хитрость и силу', 'ИИ — детали внешности совпадают с текстом', 'Оба хорошо передают описание Пушкина', 'Я представляю его иначе', 'Свой ответ'], customLast: true },
    { section: 'Блок 3. Емельян Пугачёв', id: 8, text: 'Гринёв называет Пугачёва «злодеем для всех, кроме одного меня». Видна ли эта двойственность — жестокость и человечность одновременно — в изображениях?', options: ['Да, у художника — он показал это через сцену', 'Да, у ИИ — во взгляде читается и угроза, и ум', 'Оба одинаково передают двойственность', 'Я визуализирую этот образ иначе', 'Свой ответ'], customLast: true },
    { section: 'Блок 3. Емельян Пугачёв', id: 9, text: 'Кому лучше удался образ Пугачёва?', options: ['Художнику — он передал народную стихию и силу характера', 'ИИ — внешний облик казацкого вожака получился убедительным', 'Оба справились одинаково хорошо', 'Я бы нарисовал(а) его иначе', 'Свой ответ'], customLast: true },
    { section: 'Блок 4. Швабрин', id: 10, text: 'Пушкин пишет о Швабрине: «смуглый, некрасивый, но чрезвычайно живой», умный и острый на язык. Чьё изображение точнее передаёт этот образ?', options: ['Художнику — он показал живость и скрытую угрозу', 'ИИ — внешние черты совпадают с описанием', 'Оба дают похожее представление', 'Я представляю его иначе', 'Свой ответ'], customLast: true },
    { section: 'Блок 4. Швабрин', id: 11, text: 'Швабрин предаёт всех и падает на колени перед Пугачёвым. Гринёв пишет: «с омерзением глядел я на дворянина, валяющегося в ногах беглого казака». Чувствуется ли трусость и двуличие в изображениях?', options: ['Да, у художника — сцена говорит сама за себя', 'Да, у ИИ — во взгляде есть скрытая угроза', 'Оба одинаково передают двуличие', 'Я визуализирую этот момент иначе', 'Свой ответ'], customLast: true },
    { section: 'Блок 4. Швабрин', id: 12, text: 'Кому лучше удался образ Швабрина?', options: ['Художнику — он показал моральное падение через сцену', 'ИИ — внешний облик опасного человека передан точно', 'Оба справились одинаково хорошо', 'Я бы нарисовал(а) его иначе', 'Свой ответ'], customLast: true },
    { section: 'Блок 5. Савельич', id: 13, text: 'Пушкин почти не описывает внешность Савельича — важны его слова и поступки. Чьё изображение точнее передаёт образ преданного пожилого слуги?', options: ['Художнику — он передал заботу и верность через сцену', 'ИИ — облик пожилого крестьянина убедителен', 'Оба одинаково хорошо передают образ', 'Я представляю его иначе', 'Свой ответ'], customLast: true },
    { section: 'Блок 5. Савельич', id: 14, text: 'Савельич говорит: «Коли ты уж решился ехать, то я хоть пешком да пойду за тобой, а тебя не покину». Видна ли эта преданность в изображениях?', options: ['Да, у художника — в сцене и позе', 'Да, у ИИ — во взгляде читается забота', 'Оба одинаково передают преданность', 'Я визуализирую этот образ иначе', 'Свой ответ'], customLast: true },
    { section: 'Блок 5. Савельич', id: 15, text: 'Кому лучше удался образ Савельича?', options: ['Художнику — живая сцена трогает больше, чем портрет', 'ИИ — образ пожилого мудрого человека получился убедительным', 'Оба справились одинаково хорошо', 'Я бы нарисовал(а) его иначе', 'Свой ответ'], customLast: true },
    { section: 'Блок 6. Итоговые выводы', id: 16, text: 'У кого в целом лучше получились образы героев?', options: ['У художников — они передают характер и душу персонажа', 'У ИИ — точность деталей и внешнего облика выше', 'Оба справились одинаково хорошо', 'Зависит от персонажа — у каждого свои сильные стороны', 'Свой ответ'], customLast: true },
    { section: 'Блок 6. Итоговые выводы', id: 17, text: 'Что лучше всего удаётся ИИ при создании образов героев?', options: ['Точная передача внешности по описанию из текста', 'Детали исторической эпохи — костюм, фон, обстановка', 'Фотореалистичность и чёткость изображения', 'ИИ хорошо справляется со всем перечисленным', 'Свой ответ'], customLast: true },
    { section: 'Блок 6. Итоговые выводы', id: 18, text: 'Что лучше всего удаётся художникам-иллюстраторам?', options: ['Передача характера и внутреннего мира персонажа', 'Эмоциональность — изображение вызывает чувства', 'Сюжетная сцена — показан живой момент из книги', 'Художники хорошо справляются со всем перечисленным', 'Свой ответ'], customLast: true },
    { section: 'Блок 6. Итоговые выводы', id: 19, text: 'Способен ли ИИ, по вашему мнению, заменить художника в создании образов литературных героев?', options: ['Да, ИИ справляется не хуже и даже точнее', 'Частично — для деталей да, но душу героя не передаёт', 'Нет, художник чувствует текст, а ИИ только выполняет задание', 'Затрудняюсь ответить', 'Свой ответ'], customLast: true },
    { section: 'Блок 6. Итоговые выводы', id: 20, text: 'Как вы считаете, нужен ли был такой сайт для исследования, или достаточно было просто текста?', options: ['Да, сайт наглядно показал разницу между человеком и ИИ', 'Свой ответ'], customLast: true },
  ];

  function esc(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/\"/g, '&quot;');
  }

  function renderForm(formEl) {
    let lastSection = '';
    const html = QUESTIONS.map((q) => {
      let block = '';
      if (q.section !== lastSection) {
        lastSection = q.section;
        block = `<div class="survey-block-label">${esc(q.section)}</div>`;
      }
      const radios = q.options
        .map((opt, idx) => {
          const id = `q${q.id}_o${idx}`;
          const custom =
            q.customLast && idx === q.options.length - 1
              ? `<div class="survey-custom-wrap" id="custom-${q.id}">
                   <textarea name="custom_${q.id}" aria-label="Свой ответ на вопрос ${q.id}" placeholder="Ваш текст…"></textarea>
                 </div>`
              : '';
          return `<label class="survey-opt" for="${id}">
            <input type="radio" name="q${q.id}" id="${id}" value="${idx}" data-q="${q.id}" data-idx="${idx}">
            <span>${esc(opt)}</span>
          </label>${custom}`;
        })
        .join('');
      return `${block}
        <div class="survey-q" data-qid="${q.id}">
          <p class="survey-qtext"><span class="survey-qnum">${q.id}.</span>${esc(q.text)}</p>
          <div class="survey-options">${radios}</div>
        </div>`;
    }).join('');
    formEl.innerHTML = html;

    formEl.querySelectorAll('input[type="radio"]').forEach((inp) => {
      inp.addEventListener('change', () => {
        const qid = inp.dataset.q;
        const idx = Number(inp.dataset.idx);
        const q = QUESTIONS.find((x) => String(x.id) === String(qid));
        const wrap = document.getElementById(`custom-${qid}`);
        if (!wrap || !q) return;
        const show = q.customLast && idx === q.options.length - 1;
        wrap.classList.toggle('show', show);
      });
    });
  }

  function collectAnswers(feedbackEl) {
    const answers = {};
    for (const q of QUESTIONS) {
      const sel = document.querySelector(`input[name="q${q.id}"]:checked`);
      if (!sel) {
        feedbackEl.textContent = `Ответьте на вопрос ${q.id}.`;
        feedbackEl.className = 'survey-msg err';
        return null;
      }
      const idx = Number(sel.value);
      const label = q.options[idx];
      answers[String(q.id)] = label;
      if (q.customLast && idx === q.options.length - 1) {
        const ta = document.querySelector(`textarea[name="custom_${q.id}"]`);
        const text = (ta && ta.value.trim()) || '';
        if (!text) {
          feedbackEl.textContent = `Допишите свой ответ к вопросу ${q.id}.`;
          feedbackEl.className = 'survey-msg err';
          return null;
        }
        answers[`${q.id}_custom`] = text;
      }
    }
    return answers;
  }

  function classifyAnswer(label) {
    const s = String(label || '').toLowerCase();
    if (s.includes('свой ответ')) return 'custom';
    if (s.includes('ии')) return 'ai';
    if (s.includes('худож')) return 'human';
    if (s.includes('оба')) return 'both';
    return 'other';
  }

  function computeAiHumanSummary(answers) {
    let ai = 0;
    let human = 0;
    let both = 0;
    let other = 0;
    for (const q of QUESTIONS) {
      const v = answers[String(q.id)];
      const k = classifyAnswer(v);
      if (k === 'ai') ai += 1;
      else if (k === 'human') human += 1;
      else if (k === 'both') both += 1;
      else other += 1;
    }
    const total = ai + human + both + other;
    const pct = (x) => (total ? Math.round((x * 1000) / total) / 10 : 0);
    return { ai, human, both, other, total, aiPct: pct(ai), humanPct: pct(human), bothPct: pct(both) };
  }

  function renderSummary(el, summary) {
    if (!el) return;
    el.classList.add('show');
    el.innerHTML = `
      <div class="survey-summary-title">Итог по ответам</div>
      <div class="survey-summary-grid survey-summary-grid--3">
        <div class="survey-stat">
          <div class="survey-stat-label">За ИИ</div>
          <div class="survey-stat-value">${summary.aiPct}%</div>
          <div class="survey-stat-sub">${summary.ai} из ${summary.total}</div>
        </div>
        <div class="survey-stat">
          <div class="survey-stat-label">За художника</div>
          <div class="survey-stat-value">${summary.humanPct}%</div>
          <div class="survey-stat-sub">${summary.human} из ${summary.total}</div>
        </div>
        <div class="survey-stat">
          <div class="survey-stat-label">Оба / другое</div>
          <div class="survey-stat-value">${summary.bothPct}%</div>
          <div class="survey-stat-sub">${summary.both} «оба» + ${summary.other} другое</div>
        </div>
      </div>
      <div class="survey-summary-note">Это быстрый итог по ключевым вариантам («ИИ», «Художнику», «Оба»). «Свой ответ» и варианты «представляю иначе» попадают в «другое».</div>
    `;
  }

  window.mountKapSurvey = function mountKapSurvey(cfg) {
    const form = document.getElementById('survey-form');
    const btn = document.getElementById('survey-send');
    const feedback = document.getElementById('survey-feedback');
    const summaryEl = document.getElementById('survey-summary');
    if (!form || !btn || !feedback) return;

    renderForm(form);

    const url = (cfg && cfg.supabaseUrl) || '';
    const key = (cfg && cfg.supabaseAnonKey) || '';
    if (!url.startsWith('http') || key.length < 20) {
      feedback.textContent = 'Не указан Supabase URL/anon key.';
      feedback.className = 'survey-msg err';
      btn.disabled = true;
      return;
    }
    if (!window.supabase || !window.supabase.createClient) {
      feedback.textContent = 'Supabase SDK не загрузился (проверьте интернет/блокировщики).';
      feedback.className = 'survey-msg err';
      btn.disabled = true;
      return;
    }

    const sb = window.supabase.createClient(url, key);

    btn.addEventListener('click', async () => {
      feedback.textContent = '';
      feedback.className = 'survey-msg';
      if (summaryEl) {
        summaryEl.classList.remove('show');
        summaryEl.innerHTML = '';
      }
      const answers = collectAnswers(feedback);
      if (!answers) return;
      btn.disabled = true;
      const res = await sb.from('survey_responses').insert({ answers });
      btn.disabled = false;
      if (res.error) {
        feedback.textContent = 'Не удалось сохранить: ' + res.error.message;
        feedback.className = 'survey-msg err';
        return;
      }
      feedback.textContent = 'Спасибо! Ответы сохранены.';
      feedback.className = 'survey-msg ok';
      renderSummary(summaryEl, computeAiHumanSummary(answers));
      form.querySelectorAll('input[type="radio"]').forEach((el) => (el.checked = false));
      form.querySelectorAll('.survey-custom-wrap').forEach((el) => el.classList.remove('show'));
      form.querySelectorAll('textarea').forEach((el) => (el.value = ''));
    });
  };
})();

