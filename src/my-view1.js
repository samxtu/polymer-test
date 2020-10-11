import { LitElement, html, css } from "lit-element";
import "./shared-styles.js";
import "@polymer/paper-card/paper-card.js";
import "@polymer/paper-button/paper-button.js";

class MyView1 extends LitElement {
  static get properties() {
    return {
      usersAvailable: {
        type: Boolean,
        reflectToAttribute: true,
      },
      users: {
        type: Array,
        reflectToAttribute: true,
      },
      editor: {
        type: Object,
      },
    };
  }

  constructor() {
    super();
    this.users = [
      {
        id: "",
        fullname: "",
        phone: "",
        dateOfBirth: "",
        email: "",
      },
    ];
  }

  static get styles() {
    return css`
      :host {
        display: block;
        padding: 5px;
      }
      .cafe-header {
        @apply --paper-font-headline;
        color: var(--paper-black-500);
        padding: 0;
      }
      .card-content {
        padding: "5px";
      }
      .cafe-reserve {
        color: var(--google-blue-500);
        padding: 0;
      }
      .cafe-delete {
        color: var(--google-red-500);
        padding: 0;
      }
      p {
        @apply --paper-font-headline;
        color: var(--paper-amber-500);
        padding: 0;
      }
      .user-card {
        margin-top: 10px;
      }
    `;
  }
  attributeChangedCallback(name, oldVal, newVal) {
    console.log("attribute change: ", name, newVal);
    super.attributeChangedCallback(name, oldVal, newVal);
  }
  shouldUpdate(changedProperties) {
    if (changedProperties.has("users")) {
      return true;
    }
    return true;
  }
  render() {
    console.log("this fires get template");
    return html`
      <h2>Users:</h2>
      <div class="card" id="div">
        ${this.users.map(
          (user) =>
            html`
              <paper-card class="user-card">
                <div class="card-content">
                  <div class="cafe-header">
                    Full name:
                    <h4>${user.fullname}</h4>
                  </div>
                  <div class="cafe-header">
                    Email:
                    <h4>${user.email}</h4>
                  </div>
                  <div class="cafe-header">
                    Phone number:
                    <h4>${user.phone}</h4>
                  </div>
                  <div class="cafe-header">
                    Date of birth:
                    <h4>${user.dateOfBirth}</h4>
                  </div>
                </div>
                <div class="card-actions">
                  <a href="${"/view3?email=" + user.email}"
                    ><paper-button class="cafe-reserve">Edit</paper-button></a
                  >
                  <paper-button
                    @click="${() => this._handleDelete(user.id, user.fullname)}"
                    class="cafe-delete"
                    >Delete</paper-button
                  >
                </div>
              </paper-card>
            `
        )}
      </div>
    `;
  }

  async performUpdate() {
    this._setUsers()
      .then((res) => {
        this.users = res.map((i) => {
          return i;
        });
        console.log(this.users);
        super.performUpdate();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  _handleDelete(id, username) {
    var thiss = this;
    //delete code
    var indexedDBRef =
      window.indexedDB ||
      window.mozIndexedDB ||
      window.webkitIndexedDB ||
      window.msIndexedDB;
    var db = indexedDBRef.open("user", 3);
    db.onsuccess = () => {
      console.log("db connected successfully");
      var request = db.result
        .transaction(["user"], "readwrite")
        .objectStore("user")
        .delete(id);

      request.onsuccess = function (event) {
        alert(username + " removed from your database.");
        thiss.users = thiss.users.map((u) => {
          if (u.id !== id) return u;
        });
      };
    };
  }

  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      console.log(`${propName} changed. oldValue: ${oldValue}`);
    });
  }

  _setUsers() {
    return this.openDB().then((res) => {
      return this.getAllDB(res);
    });
  }
  openDB() {
    return new Promise(function (resolve, reject) {
      var request = window.indexedDB.open("user", 3);
      request.onsuccess = () => resolve(request.result);
    });
  }
  getAllDB(dbRef) {
    return new Promise(function (resolve, reject) {
      var request = dbRef.transaction("user").objectStore("user").getAll();
      request.onsuccess = () => resolve(request.result);
    });
  }
}

customElements.define("my-view1", MyView1);
