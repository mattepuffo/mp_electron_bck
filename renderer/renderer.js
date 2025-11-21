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

    document.getElementById("ftp_save").addEventListener("click", async () => {
      const name = document.getElementById('name').value;
      const host = document.getElementById('host').value;
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;

      if (name.trim().length > 0 && host.trim().length > 0 && username.trim().length > 0 && password.trim().length > 0) {
        const params = [name, host, username, password];
        await window.ftp.save('SQL', params);
      } else {
        alert('Please enter a valid username and password');
      }

      // await window.db.run(
      //     "INSERT INTO operation_log(operation, date) VALUES(?, datetime('now'))",
      //     ["startup"]
      // );
      //
      // const rows = await window.db.all("SELECT * FROM operation_log");
      // console.log(rows);
    });
  } catch (error) {
    console.error("Errore:", error);
  }
});
