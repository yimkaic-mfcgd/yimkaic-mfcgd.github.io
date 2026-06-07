fetch(`https://docs.google.com/spreadsheets/d/e/2PACX-1vRwe0aPrTgSRP3cHuN1el-KYAtQ6tbJsYuFSEAFM8xskGbRIhxR2Yx_Kmen7ecbRphUIXPaBy0yzgAJ/pub?gid=0&single=true&output=csv`)
  .then(res => res.text())
  .then(text => {
    const lines = text.trim().split("\n").filter(line => line.trim() !== "");
    const csvHeaders = lines[0].split(",").map(h => h.trim());
    const dataHeaders = csvHeaders.slice(2);
    const headers = [csvHeaders[0], ...dataHeaders, "Balance"];
    const rows = lines.slice(1);

    const thead = document.querySelector("#scoreboard thead");
    const tbody = document.querySelector("#scoreboard tbody");
    const modeToggle = document.querySelector("#score-mode-toggle");
    const modeLabel = document.querySelector("#score-mode-label");

    let currentMode = "lump";
    let parsedRows = [];

    const formatNumber = num => Number(num || 0).toLocaleString("en-GB");

    const render = () => {
      thead.innerHTML = "";
      tbody.innerHTML = "";

      const trHead = document.createElement("tr");
      headers.forEach(h => {
        const th = document.createElement("th");
        th.textContent = h.toLowerCase() === "date" ? "Date" : h;
        trHead.appendChild(th);
      });
      thead.appendChild(trHead);

      const totals = new Array(headers.length).fill(0);

      parsedRows.forEach(row => {
        const tr = document.createElement("tr");
        const displayValues =
          currentMode === "relative"
            ? row.players.map(value => (value === 0 ? 0 : value - row.base))
            : row.players;
        const balance = displayValues.reduce((sum, val) => sum + Number(val || 0), 0);

        [row.date, ...displayValues, balance].forEach((val, i) => {
          const td = document.createElement("td");

          if (i === 0) {
            td.textContent = val;
            td.className = "date";
          } else {
            const num = Number(val || 0);
            td.textContent = formatNumber(num);
            td.className = "num";
            totals[i] += num;
          }

          tr.appendChild(td);
        });

        tbody.appendChild(tr);
      });

      const trTotal = document.createElement("tr");
      trTotal.className = "total-row";

      headers.forEach((_, i) => {
        const td = document.createElement("td");

        if (i === 0) {
          td.textContent = "Total";
          td.className = "date";
        } else {
          td.textContent = formatNumber(totals[i]);
          td.className = "num";
        }

        trTotal.appendChild(td);
      });

      tbody.appendChild(trTotal);

      if (modeLabel) {
        modeLabel.textContent = currentMode === "lump" ? "Showing: Lump sum" : "Showing: Relative difference";
      }
    };

    parsedRows = rows.map(row => {
      const rawValues = row.split(",").map(v => v.trim());
      const values = csvHeaders.map((_, i) => rawValues[i] ?? "");
      const base = Number(values[1] || 0);
      const players = values.slice(2).map(v => Number(v || 0));

      return {
        date: values[0],
        base,
        players,
      };
    });

    if (modeToggle) {
      modeToggle.checked = false;
      modeToggle.addEventListener("change", e => {
        currentMode = e.target.checked ? "relative" : "lump";
        render();
      });
    }

    render();
  })
  .catch(err => {
    console.error("Failed to load scoreboard:", err);
  });
