(function () {
  const AXES = [
    {
      id: "flex",
      short: "Цифровая гибкость",
      question: "Насколько легко я осваиваю новые цифровые инструменты (ИИ, МЭШ, сервисы)?",
    },
    {
      id: "attention",
      short: "Адаптация к вниманию",
      question: "Насколько я умею переформатировать урок под короткие фокусы внимания (45 сек)?",
    },
    {
      id: "moderator",
      short: "Роль модератора",
      question: "Насколько комфортно чувствую себя в роли наставника/фасилитатора, а не «говорящей головы»?",
    },
    {
      id: "ai",
      short: "ИИ-компетенция",
      question: "Насколько понимаю, как ИИ может генерировать задания и экономить моё время?",
    },
    {
      id: "tasks",
      short: "Задания без ИИ",
      question: "Насколько готов создавать задачи, которые ученик не сможет списать у нейросети?",
    },
    {
      id: "balance",
      short: "Баланс человека",
      question: "Насколько сохраняю человеческое тепло и эмпатию при активном использовании цифры?",
    },
  ];

  const TYPES = {
    transformer: {
      title: "Педагог-трансформер",
      text: "Ты уже на острие! Ты сочетаешь цифру, эмпатию и креатив. Твоя паутина — эталон. Но помни: лекция подчёркивает, что технологии не заменяют тебя. Твоя задача сейчас — не учиться новому, а стать наставником для коллег, передать этот опыт. Попробуй провести мастер-класс для своих коллег по генерации заданий в ИИ.",
    },
    techno: {
      title: "Техно-гуманист",
      text: "Ты отлично владеешь цифровыми инструментами и чувствуешь детей, но тебе не хватает переупаковки контента под короткое внимание и заданий, неподвластных ИИ. Это твоя зона роста. Рекомендация: в следующем уроке замени одну лекционную часть на «криптолабиринт» или «эмоджи-пересказ». Начни с малого — удиви себя!",
    },
    live: {
      title: "Мастер живого общения",
      text: "Ты — педагог от Бога, у тебя горят глаза и горят глаза учеников. Но ты пока не доверяешь цифре. Лекция показала, что ИИ — это не враг, а помощник, который возьмёт на себя рутину (журналы, планирование). Рекомендация: начни с малого — попроси нейросеть сгенерировать 5 вопросов для викторины по твоей теме. Просто попробуй, это займёт 2 минуты.",
    },
    system: {
      title: "Системный организатор",
      text: "Ты отлично структурируешь, используешь МЭШ, генерируешь задания. Но твоя паутина показывает, что ты меньше внимания уделяешь гибкой подаче и живой роли модератора. Рекомендация: попробуй на одном из уроков отдать часть управления ученикам — пусть они сами формулируют критерии оценки. Ты увидишь, как это повысит вовлечённость без потери системности.",
    },
    explorer: {
      title: "Исследователь",
      text: "Ты в начале пути, но у тебя нет перекосов — это здорово! Ты как чистый лист, который можно заполнить гармонично. Рекомендация: выбери одну из осей (например, «ИИ-компетенция») и прокачай её в течение месяца. Остальное подтянется. Лекция дала тебе карту — теперь просто выбери маршрут.",
    },
  };

  const values = AXES.map(() => 5);

  const slidersRoot = document.getElementById("sliders");
  const avgEl = document.getElementById("avg-score");
  const typeEl = document.getElementById("result-type");
  const textEl = document.getElementById("result-text");
  const areaEl = document.getElementById("radar-area");
  const dotsEl = document.getElementById("radar-dots");
  const gridEl = document.getElementById("radar-grid");
  const labelsEl = document.getElementById("radar-labels");

  const CX = 180;
  const CY = 180;
  const R = 118;

  function mean(arr) {
    return arr.reduce((a, b) => a + b, 0) / arr.length;
  }

  function pick(idxs) {
    return idxs.map((i) => values[i]);
  }

  function classify() {
    const allHigh = values.every((v) => v >= 8);
    if (allHigh) return "transformer";

    const min = Math.min(...values);
    const max = Math.max(...values);
    const avg = mean(values);
    if (avg >= 3.5 && avg <= 6.5 && max - min <= 2.5) return "explorer";

    const techno =
      mean(pick([0, 2, 3, 5])) - mean(pick([1, 4]));
    const live =
      mean(pick([1, 2, 5])) - mean(pick([0, 3]));
    const system =
      mean(pick([0, 3, 4])) - mean(pick([1, 2, 5]));

    const ranked = [
      { id: "techno", score: techno },
      { id: "live", score: live },
      { id: "system", score: system },
    ].sort((a, b) => b.score - a.score);

    if (ranked[0].score < 0.8) return "explorer";
    return ranked[0].id;
  }

  function point(i, value, radius) {
    const angle = (-Math.PI / 2) + (i * 2 * Math.PI) / AXES.length;
    const r = (radius * value) / 10;
    return {
      x: CX + r * Math.cos(angle),
      y: CY + r * Math.sin(angle),
      angle,
    };
  }

  function buildGrid() {
    let html = "";
    for (let level = 2; level <= 10; level += 2) {
      const pts = AXES.map((_, i) => {
        const p = point(i, level, R);
        return `${p.x.toFixed(1)},${p.y.toFixed(1)}`;
      }).join(" ");
      html += `<polygon points="${pts}" fill="none" stroke="#d8dce8" stroke-width="1"/>`;
    }
    for (let i = 0; i < AXES.length; i++) {
      const p = point(i, 10, R);
      html += `<line x1="${CX}" y1="${CY}" x2="${p.x.toFixed(1)}" y2="${p.y.toFixed(1)}" stroke="#d8dce8" stroke-width="1"/>`;
    }
    gridEl.innerHTML = html;

    let labels = "";
    AXES.forEach((axis, i) => {
      const p = point(i, 10, R + 28);
      const anchor =
        Math.abs(p.x - CX) < 8 ? "middle" : p.x > CX ? "start" : "end";
      labels += `<text x="${p.x.toFixed(1)}" y="${p.y.toFixed(1)}" text-anchor="${anchor}" dominant-baseline="middle" class="radar-label">${axis.short}</text>`;
    });
    labelsEl.innerHTML = labels;
  }

  function renderRadar() {
    const pts = values.map((v, i) => {
      const p = point(i, v, R);
      return `${p.x.toFixed(1)},${p.y.toFixed(1)}`;
    });
    areaEl.setAttribute("points", pts.join(" "));

    dotsEl.innerHTML = values
      .map((v, i) => {
        const p = point(i, v, R);
        return `<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="5" fill="#3e529b"/>`;
      })
      .join("");
  }

  function renderResult() {
    const avg = mean(values);
    avgEl.textContent = avg.toFixed(1);
    const key = classify();
    typeEl.textContent = TYPES[key].title;
    textEl.textContent = TYPES[key].text;
  }

  function buildSliders() {
    slidersRoot.innerHTML = AXES.map((axis, i) => {
      return `
        <label class="slider-card" for="s-${axis.id}">
          <div class="slider-card__top">
            <span class="slider-card__num">${String(i + 1).padStart(2, "0")}</span>
            <span class="slider-card__title">${axis.short}</span>
            <span class="slider-card__val" id="v-${axis.id}">${values[i]}</span>
          </div>
          <p class="slider-card__q">${axis.question}</p>
          <input
            id="s-${axis.id}"
            type="range"
            min="1"
            max="10"
            step="1"
            value="${values[i]}"
            data-index="${i}"
          />
          <div class="slider-card__scale"><span>1</span><span>10</span></div>
        </label>
      `;
    }).join("");

    slidersRoot.querySelectorAll("input[type=range]").forEach((input) => {
      input.addEventListener("input", () => {
        const idx = Number(input.dataset.index);
        values[idx] = Number(input.value);
        document.getElementById(`v-${AXES[idx].id}`).textContent = values[idx];
        renderRadar();
        renderResult();
      });
    });
  }

  buildGrid();
  buildSliders();
  renderRadar();
  renderResult();
})();
