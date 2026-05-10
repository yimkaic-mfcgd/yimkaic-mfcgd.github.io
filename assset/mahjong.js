fetch("data/scores.csv")
  .then(res => res.text())
  .then(text => {
    const rows = text.trim().split("\n").slice(1);
    const tbody = document.querySelector("#scoreboard tbody");

    rows.forEach(row => {
      const [date, player, score] = row.split(",");
      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td>${date}</td>
        <td>${player}</td>
        <td class="num">${Number(score).toLocaleString("en-GB")}</td>
      `;

      tbody.appendChild(tr);
    });
  });
