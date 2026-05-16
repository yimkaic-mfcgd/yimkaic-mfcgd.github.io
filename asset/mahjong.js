fetch(`data/score.csv?v=${Date.now()}`)
  .then(res => res.text())
  .then(text => {
    const lines = text.trim().split("\n").filter(line => line.trim() !== "");
    const csvHeaders = lines[0].split(",").map(h => h.trim());
    const headers = [...csvHeaders, "Balance"];
    const rows = lines.slice(1);

    const thead = document.querySelector("#scoreboard thead");
    const tbody = document.querySelector("#scoreboard tbody");

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

    rows.forEach(row => {
      const rawValues = row.split(",").map(v => v.trim());
      const values = csvHeaders.map((_, i) => rawValues[i] ?? "");
      const balance = values.slice(1).reduce((sum, val) => sum + Number(val || 0), 0);

      const tr = document.createElement("tr");

      [...values, balance].forEach((val, i) => {
        const td = document.createElement("td");

        if (i === 0) {
          td.textContent = val;
          td.className = "date";
        } else {
          const num = Number(val || 0);
          td.textContent = num.toLocaleString("en-GB");
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
        td.textContent = totals[i].toLocaleString("en-GB");
        td.className = "num";
      }

      trTotal.appendChild(td);
    });

    tbody.appendChild(trTotal);
  })
  .catch(err => {
    console.error("Failed to load scoreboard:", err);
  });
