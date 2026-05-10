fetch(`data/scores.csv?v=${Date.now()}`)
  .then(res => res.text())
  .then(text => {
    const lines = text.trim().split("\n");
    const headers = lines[0].split(",");
    const rows = lines.slice(1);

    const thead = document.querySelector("#scoreboard thead");
    const tbody = document.querySelector("#scoreboard tbody");

    // Build header row from CSV
    const trHead = document.createElement("tr");
    headers.forEach(h => {
      const th = document.createElement("th");
      th.textContent = h === "date" ? "Date" : h;
      trHead.appendChild(th);
    });
    thead.appendChild(trHead);

    // Build body
    rows.forEach(row => {
      const values = row.split(",");
      const tr = document.createElement("tr");

      values.forEach((val, i) => {
        const td = document.createElement("td");

        if (i === 0) {
          td.textContent = val;
          td.className = "date";
        } else {
          td.textContent = Number(val).toLocaleString("en-GB");
          td.className = "num";
        }

        tr.appendChild(td);
      });

      tbody.appendChild(tr);
    });
  });
