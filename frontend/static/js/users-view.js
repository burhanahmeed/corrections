import Vue from 'https://unpkg.com/vue@2.6.0/dist/vue.esm.browser.min.js';
import {h, Grid, PluginPosition} from 'https://cdn.skypack.dev/gridjs';
import VueModal from "https://unpkg.com/@burhanahmeed/vue-modal-2/dist/vue-modal-2.esm.js";

Vue.use(VueModal, {
  componentName: 'VueModal'
})

Vue.component('users-view', {
  data: function () {
    return {
      gridInstance: null,
      users: [],
    }
  },
  methods: {
    onInit () {
      return new Promise(resolve => {
        fetch('https://my-json-server.typicode.com/burhanahmeed/sunnah-com-mock/users', {
          method: 'GET'
        })
        .then(response => response.json())
        .then(response => {
          console.log(response);
          this.users = response;
          // this.reloadData();
          resolve(response);
        })
      })
    },
    reloadButton () {
      const vm = this;

      const tableHead = document.getElementsByClassName('gridjs-head');
      if (tableHead) {
        tableHead[0].innerHTML = `
          <a id="add-button" class="btn btn-primary" style="position: absolute; right: 10px;">
            Add user
          </a>
        `;
      }

      document.getElementById('add-button').addEventListener('click', () => {
        vm.handleAddUserModal();
      })
    },
    reloadData () {
      this.gridInstance.updateConfig({
        // data: () => this.onInit()
        from: document.getElementById("tableContent"),
      })
      this.gridInstance.forceRender();
      this.reloadButton();
    },
    handleAddUserModal () {
      this.$vm2.open('add-user');
    },
    closeModal () {
      this.$vm2.close('add-user');
    },
    handleDelete () {
      if (confirm('Are you sure want to delete this user?')) {
        console.log('deleted!');
      }
    }
  },
  mounted: async function () {
    await this.onInit();
    this.gridInstance = new Grid({
      // columns: [
      //   {
      //     id: 'username',
      //     name: 'Username'
      //   },
      //   {
      //     id: 'permissions',
      //     name: 'Permissions',
      //     formatter: (cell, row) => gridjs.html(
            
      //     )
      //   },
      //   {
      //     name: 'Action',
      //     formatter: (cell, row) => gridjs.html(
      //       `<a href="/dashboard/edit/${row.cells[0].data}">
      //         <i class="far fa-edit"></i>
      //       </a>
      //       \u00A0
      //       <a class="text-danger" href="/dashboard/edit/${row.cells[0].data}">
      //         <i class="far fa-trash-alt"></i>
      //       </a>`
      //     )
      //   }
      // ],
      // data: () => this.onInit(),
      search: {
        enabled: true,
      },
      from: document.getElementById("tableContent"),
      pagination: {
        buttonsCount: 10,
        limit: 10,
        summary: true,
      },
    });

    // render gridjs to html
    this.gridInstance.render(document.getElementById("table"));
    
    setTimeout(() => {
      this.reloadData();  
    }, 1000);
  }
})
