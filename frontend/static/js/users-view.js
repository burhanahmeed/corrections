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
      gridOptions: {
        columns: [
          'Username', 
          'Permissions',
          {
            name: 'Action',
            formatter: (cell, row) => gridjs.html(
              `<a class="badge badge-secondary" href="/dashboard/edit/${row.cells[0].data}">Edit</a> | <form id="form_${row.cells[0].data}" class="d-inline-block" method="post" action="/api/dictionary/delete/${row.cells[0].data}"></form><button class="badge badge-danger pointer border-0" onClick="handleDelete(${row.cells[0].data})" type="button">Delete</button>`
            )
          }
        ],
        server: {
          url: 'https://my-json-server.typicode.com/burhanahmeed/sunnah-com-mock/users',
          then: data => data.map(user => [
              user.username,
              user.permissions
            ]
          )
        },
        search: {
          enabled: true
        },
        pagination: {
          buttonsCount: 10,
          limit: 10,
          summary: true,
        },
      },
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
        .then(response => resolve(response))
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
      })
    },
    reloadData () {
      this.gridInstance.updateConfig({
        data: () => this.onInit()
      })
      this.gridInstance.forceRender();
    },
    handleAddUserModal () {
      this.$vm2.open('add-user');
    },
    closeModal () {
      this.$vm2.close('add-user');
    }
  },
  mounted: function () {
    this.gridInstance = new Grid({
      columns: [
        {
          id: 'username',
          name: 'Username'
        },
        {
          id: 'permissions',
          name: 'Permissions',
          formatter: (cell, row) => gridjs.html(
            <span></span>
          )
        },
        {
          name: 'Action',
          formatter: (cell, row) => gridjs.html(
            `<a class="badge badge-secondary" href="/dashboard/edit/${row.cells[0].data}">Edit</a> | <form id="form_${row.cells[0].data}" class="d-inline-block" method="post" action="/api/dictionary/delete/${row.cells[0].data}"></form><button class="badge badge-danger pointer border-0" onClick="handleDelete(${row.cells[0].data})" type="button">Delete</button>`
          )
        }
      ],
      data: () => this.onInit(),
      search: {
        enabled: true,
      },
      pagination: {
        buttonsCount: 10,
        limit: 10,
        summary: true,
      },
    });

    // render gridjs to html
    this.gridInstance.render(document.getElementById("table"));
  }
})
