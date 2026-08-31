(function () {
  var root = document.getElementById("leak-check");
  if (!root) return;

  var QUESTIONS = [
    {
      id: "staffing",
      area: "Staffing & capacity",
      prompt:
        "When you look at last month’s labor cost, how clearly can you say which sessions, providers, or locations were over- or under-staffed?",
      options: [
        {
          score: 0,
          label: "We can point to specific sessions and the dollar impact.",
        },
        {
          score: 1,
          label: "We have reports and a hunch — not dollars.",
        },
        {
          score: 2,
          label: "Labor is up and nobody can explain where.",
        },
      ],
    },
    {
      id: "noshows",
      area: "No-shows & unused capacity",
      prompt: "How do you treat missed appointments today?",
      options: [
        {
          score: 0,
          label: "We know which visit types and slots leak the most revenue.",
        },
        {
          score: 1,
          label: "We track a no-show rate, and that’s about it.",
        },
        {
          score: 2,
          label: "We know it’s a problem; we don’t measure it in dollars.",
        },
      ],
    },
    {
      id: "collections",
      area: "Collections & cash",
      prompt: "When collections slow down, what happens next?",
      options: [
        {
          score: 0,
          label: "We can see which payers, visit types, or sites are driving the lag.",
        },
        {
          score: 1,
          label: "Someone runs a report; the next action is still a debate.",
        },
        {
          score: 2,
          label: "We find out when cash is already tight.",
        },
      ],
    },
    {
      id: "pricing",
      area: "Pricing & service margin",
      prompt:
        "Can you name which services or locations are underpriced relative to cost and payer mix?",
      options: [
        { score: 0, label: "Yes — with current numbers." },
        { score: 1, label: "We have a fee schedule and a gut feel." },
        { score: 2, label: "Not with any confidence." },
      ],
    },
    {
      id: "performance",
      area: "Site & provider performance",
      prompt:
        "If two locations (or two providers) look equally busy, can you tell which one actually makes money?",
      options: [
        { score: 0, label: "Yes." },
        { score: 1, label: "Sometimes, after a scramble in Excel." },
        { score: 2, label: "Busy is the only number we trust." },
      ],
    },
    {
      id: "reports",
      area: "Decision quality",
      prompt: "Your current reports mostly:",
      options: [
        {
          score: 0,
          label: "Recommend a next action with a number attached.",
        },
        { score: 1, label: "Describe last month accurately." },
        {
          score: 2,
          label: "Arrive late and still start an argument.",
        },
      ],
    },
    {
      id: "recurrence",
      area: "How often it comes back",
      prompt:
        "The staffing, pricing, or performance question you’re living with:",
      options: [
        { score: 0, label: "We settled it, and it stays settled." },
        {
          score: 1,
          label: "A few times a year, when something breaks.",
        },
        { score: 2, label: "We relitigate it every month." },
      ],
    },
    {
      id: "delay",
      area: "Cost of waiting",
      prompt: "If you wait 90 days to get clarity, what happens?",
      options: [
        { score: 0, label: "Mild annoyance. The business can absorb it." },
        { score: 1, label: "Another quarter of the same leak." },
        {
          score: 2,
          label:
            "Cash, a covenant, or a board / lender conversation gets worse.",
        },
      ],
    },
  ];

  var AREA_COPY = {
    staffing:
      "Labor is moving without a session-level explanation. The first job is to attach dollars to over- and under-capacity — not to hire another analyst.",
    noshows:
      "A single no-show rate hides which misses actually cost you. Visit type, payer, and lead time usually concentrate the leakage.",
    collections:
      "Cash lag that shows up as a surprise is a routing problem. The useful output is which payers, sites, or visit types to work first.",
    pricing:
      "Fee schedules without cost and payer mix are a guess. Underpricing often sits in a handful of services or locations.",
    performance:
      "Busy is not margin. If sites or providers can’t be compared on contribution, staffing and growth decisions are flying blind.",
    reports:
      "Descriptive reports keep the argument going. You need a next action with a number attached.",
  };

  var answers = [];
  var current = 0;
  var selected = null;

  var progressEl = root.querySelector(".lc__progress");
  var stepLabel = root.querySelector(".lc__step-label");
  var areaLabel = root.querySelector(".lc__area-label");
  var bar = root.querySelector(".lc__bar");
  var barFill = root.querySelector(".lc__bar-fill");
  var questionPanel = root.querySelector('[data-lc-panel="question"]');
  var resultsPanel = root.querySelector('[data-lc-panel="results"]');
  var promptEl = root.querySelector(".lc__prompt");
  var optionsEl = root.querySelector(".lc__options");
  var backBtn = root.querySelector(".lc__back");
  var nextBtn = root.querySelector(".lc__next");
  var copyBtn = root.querySelector(".lc__copy");
  var copyStatus = root.querySelector(".lc__copy-status");
  var mailtoLink = root.querySelector(".lc__mailto");

  function track(eventName, params) {
    if (typeof gtag === "function") {
      gtag("event", eventName, params || {});
    }
  }

  function renderQuestion() {
    var q = QUESTIONS[current];
    var total = QUESTIONS.length;
    progressEl.hidden = false;
    questionPanel.hidden = false;
    resultsPanel.hidden = true;

    stepLabel.textContent = "Question " + (current + 1) + " of " + total;
    areaLabel.textContent = q.area;
    bar.setAttribute("aria-valuenow", String(current + 1));
    bar.setAttribute("aria-valuemax", String(total));
    barFill.style.width = ((current + 1) / total) * 100 + "%";

    promptEl.textContent = q.prompt;
    optionsEl.innerHTML = "";

    var saved = typeof answers[current] === "number" ? answers[current] : null;
    selected = saved;

    q.options.forEach(function (opt, index) {
      var id = "lc-" + q.id + "-" + index;
      var label = document.createElement("label");
      label.className = "lc__option";
      label.setAttribute("for", id);

      var input = document.createElement("input");
      input.type = "radio";
      input.name = "lc-" + q.id;
      input.id = id;
      input.value = String(opt.score);
      if (saved === opt.score) {
        input.checked = true;
        label.classList.add("is-selected");
      }

      input.addEventListener("change", function () {
        selected = opt.score;
        Array.prototype.forEach.call(
          optionsEl.querySelectorAll(".lc__option"),
          function (el) {
            el.classList.remove("is-selected");
          }
        );
        label.classList.add("is-selected");
        nextBtn.disabled = false;
      });

      var span = document.createElement("span");
      span.textContent = opt.label;

      label.appendChild(input);
      label.appendChild(span);
      optionsEl.appendChild(label);
    });

    backBtn.hidden = current === 0;
    nextBtn.disabled = selected === null;
    nextBtn.textContent = current === total - 1 ? "See the readout" : "Continue";
  }

  function hottestAreas(scoresById) {
    var ranked = QUESTIONS.filter(function (q) {
      return AREA_COPY[q.id];
    })
      .map(function (q) {
        return { id: q.id, area: q.area, score: scoresById[q.id] };
      })
      .filter(function (row) {
        return row.score >= 1;
      })
      .sort(function (a, b) {
        return b.score - a.score;
      });
    return ranked.slice(0, 2);
  }

  function interpret(total, recurrence, delay, hot) {
    var shape;
    var eyebrow;
    var title;
    var lede;
    var auditNote;

    if (total <= 4) {
      eyebrow = "Leak pressure: low";
      title = "You may not need an engagement.";
      shape = "No engagement — unless one question is still loud";
      lede =
        "From these answers, the operating picture looks relatively settled. If one specific decision is still expensive to get wrong, a narrow Answer can still be worth it. Otherwise, don’t hire this work.";
      auditNote =
        "The audit is free, and I will say no if there isn’t a believable ROI path. Only book it if you have one concrete question in mind.";
    } else if (total <= 9) {
      eyebrow = "Leak pressure: concentrated";
      title = "There is a findable leak in a handful of places.";
      shape = "Likely shape: Answer";
      lede =
        "You don’t need a transformation. You need one decision settled in plain language — usually the hottest area below — with a next step your team can take.";
      auditNote =
        "The 45-minute Operations Audit is the right next step. We’ll confirm what’s knowable from data you already have, then scope a fixed-price Answer or tell you it’s not a fit.";
    } else if (recurrence >= 2 || delay >= 2) {
      eyebrow = "Leak pressure: compounding";
      title = "This question is costing you every month you wait.";
      shape =
        delay >= 2 && recurrence >= 2
          ? "Likely shape: System, with Engine on the table"
          : "Likely shape: System";
      lede =
        "The same staffing, pricing, or performance argument is coming back. A one-off readout helps once; a lightweight system stops the relitigation. If delay is already hitting cash or a board conversation, ongoing monitoring may belong in scope.";
      auditNote =
        "Book the audit. We’ll diagnose pressure, findability, and ROI, then recommend System, Engine, or — if the ROI isn’t there — no engagement.";
    } else {
      eyebrow = "Leak pressure: elevated";
      title = "The leak is real, and it will keep showing up.";
      shape = "Likely shape: Answer first, System if it repeats";
      lede =
        "Start by settling the hottest area. If that same decision comes back next month, that’s the signal to build a system your team owns instead of re-buying the analysis.";
      auditNote =
        "The Operations Audit will pick the first paid step — usually a fixed-price Answer — and leave System as an option only if the first project earns it.";
    }

    if (hot.length === 0 && total > 4) {
      lede +=
        " None of the operating areas scored as a crisis; the pressure is in how decisions get made and how often they return.";
    }

    return { shape: shape, eyebrow: eyebrow, title: title, lede: lede, auditNote: auditNote };
  }

  function readoutText(total, interp, hot) {
    var lines = [
      "Changepoint Margin Leak Check",
      interp.eyebrow + " (" + total + " / 16)",
      interp.title,
      "",
      interp.lede,
      "",
      "Hottest areas:",
    ];
    if (hot.length === 0) {
      lines.push("None scored as a primary leak.");
    } else {
      hot.forEach(function (row) {
        lines.push("- " + row.area + ": " + AREA_COPY[row.id]);
      });
    }
    lines.push("");
    lines.push(interp.shape);
    lines.push(interp.auditNote);
    lines.push("");
    lines.push("Next step: https://changepointdata.com/audit/");
    return lines.join("\n");
  }

  function renderResults() {
    var scoresById = {};
    var total = 0;
    QUESTIONS.forEach(function (q, i) {
      scoresById[q.id] = answers[i];
      total += answers[i];
    });

    var hot = hottestAreas(scoresById);
    var interp = interpret(
      total,
      scoresById.recurrence,
      scoresById.delay,
      hot
    );
    var text = readoutText(total, interp, hot);

    progressEl.hidden = true;
    questionPanel.hidden = true;
    resultsPanel.hidden = false;

    root.querySelector(".lc__eyebrow").textContent = interp.eyebrow;
    root.querySelector(".lc__result-title").textContent = interp.title;
    root.querySelector(".lc__result-lede").textContent = interp.lede;
    root.querySelector(".lc__shape").innerHTML =
      "<p><strong>" +
      interp.shape +
      "</strong></p><p>This is a directional read from eight answers — not a diagnosis. The audit is where we check it against your actual data.</p>";
    root.querySelector(".lc__audit-note").textContent = interp.auditNote;

    var areasEl = root.querySelector(".lc__areas");
    areasEl.innerHTML = "";
    if (hot.length) {
      var heading = document.createElement("h3");
      heading.textContent = hot.length === 1 ? "Hottest area" : "Hottest areas";
      areasEl.appendChild(heading);
      hot.forEach(function (row) {
        var item = document.createElement("div");
        item.className = "lc__area";
        item.innerHTML =
          "<strong>" +
          row.area +
          "</strong><p>" +
          AREA_COPY[row.id] +
          "</p>";
        areasEl.appendChild(item);
      });
    }

    var subject = encodeURIComponent("Margin Leak Check readout");
    var body = encodeURIComponent(text);
    mailtoLink.href =
      "mailto:john@changepointdata.com?subject=" + subject + "&body=" + body;
    copyBtn.setAttribute("data-readout", text);

    resultsPanel.scrollIntoView({ behavior: "smooth", block: "start" });
    root.querySelector(".lc__result-title").focus();

    track("leak_check_complete", {
      leak_score: total,
      leak_shape: interp.shape,
    });
  }

  nextBtn.addEventListener("click", function () {
    if (selected === null) return;
    answers[current] = selected;
    if (current === QUESTIONS.length - 1) {
      renderResults();
      return;
    }
    current += 1;
    selected = typeof answers[current] === "number" ? answers[current] : null;
    renderQuestion();
  });

  backBtn.addEventListener("click", function () {
    if (current === 0) return;
    current -= 1;
    selected = typeof answers[current] === "number" ? answers[current] : null;
    renderQuestion();
  });

  copyBtn.addEventListener("click", function () {
    var text = copyBtn.getAttribute("data-readout") || "";
    function done() {
      copyStatus.textContent = "Copied. Paste it into an email or send it to an advisor.";
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done).catch(function () {
        copyStatus.textContent = "Copy failed — use Email this to John instead.";
      });
    } else {
      copyStatus.textContent = "Copy isn’t available in this browser — use Email this to John.";
    }
  });

  track("leak_check_start");
  renderQuestion();
})();
