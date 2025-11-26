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
    let rows = await window.db.all("SELECT * FROM ftp");

    document.getElementById('main_content').innerHTML = await window.click.tpl("ftp.html");

    const populateTable = async (data) => {
      const tbody = document.querySelector('tbody');

      const template = `
        {{#rows}}
          <tr>
            <td>{{name}}</td>
            <td>{{host}}</td>
            <td>
              <button type="button" class="btn btn-outline-warning btn_edit" 
                      data-name="{{name}}" 
                      data-host="{{host}}" 
                      data-username="{{username}}" 
                      data-password="{{password}}">
                <i class="bi bi-pen"></i>
              </button>
              <button type="button" class="btn btn-outline-success btn_play" 
                      data-name="{{name}}">
                <i class="bi bi-play-fill"></i>
              </button>
              <button type="button" class="btn btn-outline-danger btn_delete" 
                      data-name="{{name}}">
                <i class="bi bi-trash"></i>
              </button>
            </td>
          </tr>
        {{/rows}}
  `;

      tbody.innerHTML = await window.mustache.render(template, {rows: data});
    };

    populateTable(rows);

    document.querySelector('tbody').addEventListener('click', async (e) => {
      const buttonEdit = e.target.closest('.btn_edit');
      const buttonDelete = e.target.closest('.btn_delete');

      if (buttonEdit) {
        const rowData = {
          id: buttonEdit.dataset.id,
          name: buttonEdit.dataset.name,
          host: buttonEdit.dataset.host,
          username: buttonEdit.dataset.username
        };

        document.getElementById('name').value = rowData.name;
        document.getElementById('host').value = rowData.host;
        document.getElementById('username').value = rowData.username;
        document.getElementById('password').value = rowData.password;
      }

      if (buttonDelete) {
        const query = "DELETE FROM ftp WHERE name = ?";
        await window.db.run(query, [buttonDelete.dataset.name]);

        rows = await window.db.all("SELECT * FROM ftp");
        populateTable(rows);
      }
    });

    document.getElementById("ftp_save").addEventListener("click", async () => {
      const name = document.getElementById('name');
      const host = document.getElementById('host');
      const username = document.getElementById('username');
      const password = document.getElementById('password');

      if (name.value.trim().length > 0 && host.value.trim().length > 0 && username.value.trim().length > 0 && password.value.trim().length > 0) {
        const params = [
          name.value.trim().toLowerCase(),
          host.value.trim().toLowerCase(),
          username.value.trim().toLowerCase(),
          password.value.trim().toLowerCase(),
          // DO UPDATE
          host.value.trim().toLowerCase(),
          username.value.trim().toLowerCase(),
          password.value.trim().toLowerCase(),
        ];

        const query = "INSERT INTO ftp (name, host, username, password) " +
            "VALUES (?, ?, ?, ?) " +
            "ON CONFLICT (name) DO UPDATE SET host = ?, username = ?, password = ?"

        await window.db.run(query, params);

        rows = await window.db.all("SELECT * FROM ftp");
        populateTable(rows);

        name.value = "";
        host.value = "";
        username.value = "";
        password.value = "";
      } else {
        const modalAlert = new bootstrap.Modal('#modal_alert', {
          keyboard: false
        });
        modalAlert.show();
      }
    });
  } catch (error) {
    console.error("Errore:", error);
  }
});

document.getElementById("link_sync").addEventListener("click", async () => {

  try {
    document.getElementById('main_content').innerHTML = await window.click.tpl("sync.html");

    // DRPDOWN TYPES
    const types = ['ftp', 'local'];
    const templateType = `
      <option value="" selected>Seleziona un tipo</option>
      {{#types}}
      <option value="{{.}}">{{.}}</option>
      {{/types}}
    `;
    document.getElementById('type').innerHTML = await window.mustache.render(templateType, {types: types});

    // DRPDOWN SERVERS
    let ftpServers = await window.db.all("SELECT * FROM ftp");
    const templateFtp = `
      <option value="" selected>Seleziona un server</option>
      {{#ftpServers}}
      <option value="{{name}}">{{name}}</option>
      {{/ftpServers}}
    `;
    document.getElementById('server').innerHTML = await window.mustache.render(templateFtp, {ftpServers: ftpServers});

    let rows = await window.db.all("SELECT * FROM sync");
    const populateTable = async (data) => {
      const tbody = document.querySelector('tbody');

      const template = `
        {{#rows}}
          <tr>
            <td>{{name}}</td>
            <td>{{directory}}</td>
            <td>{{server}}</td>
            <td>{{path}}</td>
            <td>{{type}}</td>
            <td>
              <button type="button"
                      class="btn btn-outline-warning btn_edit"
                      data-name="{{name}}" 
                      data-directory="{{directory}}"
                      data-server="{{server}}" 
                      data-path="{{path}}" 
                      data-type="{{type}}">
                <i class="bi bi-pen"></i>
              </button>
              <button type="button" class="btn btn-outline-success btn_play" 
                      data-name="{{name}}">
                <i class="bi bi-play-fill"></i>
              </button>
              <button type="button" class="btn btn-outline-danger btn_delete" 
                      data-name="{{name}}">
                <i class="bi bi-trash"></i>
              </button>
            </td>
          </tr>
        {{/rows}}
      `;

      tbody.innerHTML = await window.mustache.render(template, {rows: data});
    };

    populateTable(rows);

    document.querySelector('tbody').addEventListener('click', async (e) => {
      const buttonEdit = e.target.closest('.btn_edit');
      const buttonDelete = e.target.closest('.btn_delete');

      if (buttonEdit) {
        const rowData = {
          id: buttonEdit.dataset.id,
          name: buttonEdit.dataset.name,
          directory: buttonEdit.dataset.directory,
          server: buttonEdit.dataset.server,
          path: buttonEdit.dataset.path,
          type: buttonEdit.dataset.type,
        };

        document.getElementById('name').value = rowData.name;
        document.getElementById('directory').value = rowData.directory;
        document.getElementById('server').value = rowData.server;
        document.getElementById('path').value = rowData.path;
        document.getElementById('type').value = rowData.type;
      }

      if (buttonDelete) {
        const query = "DELETE FROM sync WHERE name = ?";
        await window.db.run(query, [buttonDelete.dataset.name]);

        rows = await window.db.all("SELECT * FROM sync");
        populateTable(rows);
      }
    });

    document.getElementById("sync_save").addEventListener("click", async () => {
      const name = document.getElementById('name');
      const directory = document.getElementById('directory');
      const server = document.getElementById('server');
      const path = document.getElementById('path');
      const type = document.getElementById('type');

      if (name.value.trim().length > 0 && directory.value.trim().length > 0 && server.value.trim().length > 0 && path.value.trim().length > 0 && type.value.trim().length > 0) {
        const params = [
          name.value.trim().toLowerCase(),
          directory.value.trim().toLowerCase(),
          server.value.trim().toLowerCase(),
          path.value.trim().toLowerCase(),
          type.value.trim().toLowerCase(),
          // DO UPDATE
          directory.value.trim().toLowerCase(),
          server.value.trim().toLowerCase(),
          path.value.trim().toLowerCase(),
          type.value.trim().toLowerCase(),
        ];

        const query = "INSERT INTO sync (name, directory, server, path, type) " +
            "VALUES (?, ?, ?, ?, ?) " +
            "ON CONFLICT (name) DO UPDATE SET directory = ?, server = ?, path = ?, type = ?"

        await window.db.run(query, params);

        rows = await window.db.all("SELECT * FROM sync");
        populateTable(rows);

        name.value = "";
        directory.value = "";
        server.value = "";
        path.value = "";
        type.value = "";
      } else {
        const modalAlert = new bootstrap.Modal('#modal_alert', {
          keyboard: false
        });
        modalAlert.show();
      }
    });
  } catch (error) {
    console.error("Errore:", error);
  }
});

// const populateTable = (data) => {
//   const tbody = document.querySelector('tbody');
//   tbody.innerHTML = '';
//
//   data.forEach(row => {
//     const tr = document.createElement('tr');
//     tr.innerHTML = `
//       <td>${row.name}</td>
//       <td>${row.host}</td>
//       <td>
//         <button type="button" class="btn btn-outline-warning btn_edit" data-name="${row.name}" data-host="${row.host}" data-username="${row.username}" data-password="${row.password}">
//           <i class="bi bi-pen"></i>
//         </button>
//         <button type="button" class="btn btn-outline-success btn_play" data-name="${row.name}">
//           <i class="bi bi-play-fill"></i>
//         </button>
//         <button type="button" class="btn btn-outline-danger btn_delete" data-name="${row.name}">
//           <i class="bi bi-trash"></i>
//         </button>
//       </td>
//     `;
//     tbody.appendChild(tr);
//   });
// };