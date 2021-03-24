import Vue from 'https://unpkg.com/vue@2.6.0/dist/vue.esm.browser.min.js';
import {h, Grid, PluginPosition} from 'https://cdn.skypack.dev/gridjs';

function MyPlugin() {
  return h('button', {}, 'Hello world!');
}

Vue.component('users-view', {
  data: function () {
    return {
      hello: 'hellow'
    }
  },
  mounted: function () {
    const gridjsInit = new gridjs.Grid({
      columns: [
        'First name', 
        'Last name', 
        'Role (permission)', 
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
            user.fname,
            user.lname,
            user.role,
            ''
          ]
        )
      },
      search: {
        enabled: true
      },
      pagination: {
        buttonsCount: 10,
        limit: 15,
        summary: true
      },
    });
    gridjsInit.plugin.add({
      id: 'myplugin',
      component: MyPlugin,
      position: PluginPosition.Header,
    });

    // render gridjs to html
    gridjsInit.render(document.getElementById("table"));
  }
})
