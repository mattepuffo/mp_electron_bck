const appName = window.appConstants.APP_NAME;
const contentArea = document.getElementById('main_content');

function updateAppTitles() {
  const elementsToUpdate = document.querySelectorAll('.app_title');

  elementsToUpdate.forEach(element => {
    element.textContent = appName;
  });
}


//let opzioni = vec!["FTP", "SYNC", "LOG", "BACKUP DB", "PULISCI BCK", "ESCI"];
document.addEventListener('DOMContentLoaded', () => {
  updateAppTitles();
});

document.getElementById('link_ftp').addEventListener('click', async () => {
  await console.log('ok');
  await fetch('renderer/ftp.html')
      .then(response => response.text())
      .then(html => {
        console.log(html);
        contentArea.innerHTML = html;
      })
      .catch(err => console.error("Errore nel caricamento della pagina FTP:", err));
});

document.getElementById("test").addEventListener("click", async () => {
  await window.db.run(
      "INSERT INTO operation_log(operation, date) VALUES(?, datetime('now'))",
      ["startup"]
  );

  const rows = await window.db.all("SELECT * FROM operation_log");
  console.log(rows);
});