document.getElementById("test").addEventListener("click", async () => {
  await window.db.run(
      "INSERT INTO operation_log(operation, date) VALUES(?, datetime('now'))",
      ["startup"]
  );

  const rows = await window.db.all("SELECT * FROM operation_log");
  console.log(rows);
});