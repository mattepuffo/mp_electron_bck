const appName = window.appConstants.APP_NAME;

function updateAppTitles() {
  const elementsToUpdate = document.querySelectorAll('.app_title');
  elementsToUpdate.forEach(element => {
    element.textContent = appName;
  });
}

document.addEventListener('DOMContentLoaded', () => {
  updateAppTitles();
});

document.getElementById("link_ftp").addEventListener("click", async () => {
  try {
    document.getElementById('main_content').innerHTML = await window.click.tpl("ftp.html");
  } catch (error) {
    console.error("Errore:", error);
  }
});

document.getElementById("test").addEventListener("click", async () => {
  await window.db.run(
      "INSERT INTO operation_log(operation, date) VALUES(?, datetime('now'))",
      ["startup"]
  );

  const rows = await window.db.all("SELECT * FROM operation_log");
  console.log(rows);
});
