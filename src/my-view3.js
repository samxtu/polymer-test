import { LitElement, html, css } from "lit-element";
import "./shared-styles.js";
import "@polymer/paper-input/paper-input.js";
import "@polymer/paper-button/paper-button.js";
import "@polymer/iron-form/iron-form.js";

class MyView3 extends LitElement {
  static get properties() {
    return {
      userId: {
        type: String,
      },
      fullname: {
        type: String,
      },
      email: {
        type: String,
      },
      phone: {
        type: String,
      },
      dateOfBirth: {
        type: String,
      },
    };
  }

  static get styles() {
    return css`
      :host {
        display: block;
        padding: 10px;
      }
      paper-button.blue {
        background-color: var(--paper-blue-500);
        color: white;
      }
    `;
  }

  constructor() {
    super();
    console.log("constructor", window.location.search.split("=")[1]);
    var thiss = this;
    var indexedDBRef =
      window.indexedDB ||
      window.mozIndexedDB ||
      window.webkitIndexedDB ||
      window.msIndexedDB;
    console.log(this.userId);
    this.addEventListener("iron-form-submit", function (event) {
      event.preventDefault();
      thiss.fullname = this.shadowRoot.getElementById("fullname").value;
      thiss.phone = this.shadowRoot.getElementById("phone").value;
      thiss.dateOfBirth = this.shadowRoot.getElementById("dateOfBirth").value;
      thiss.email = this.shadowRoot.getElementById("email").value;
      console.log("name at event listener", thiss.fullname);
      thiss._update(
        thiss.fullname,
        thiss.phone,
        thiss.dateOfBirth,
        thiss.email,
        thiss.userId
      );
    });
    if (!indexedDBRef) {
      window.alert(
        "Your browser doesn't support a stable version of IndexedDB. Data will be stored in local storage. You might want to update your browser!!"
      );
    } else {
      console.log("Indexed DB is supported!");
    }
    this.fullname = "";
    this.phone = "";
    this.dateOfBirth = "";
    this.email = "";
  }

  render() {
    return html`
      <div>
        <h3>Edit user:</h3>
        <hr />
        <iron-form id="form2">
          <form id="form22" method="POST" target="_self">
            <paper-input
              label="Full name"
              id="fullname"
              .value="${this.fullname}"
              type="text"
              maxlength="50"
              autoValidate
              required
            ></paper-input>
            <paper-input
              required
              label="Email"
              id="email"
              type="email"
              .value="${this.email}"
              autoValidate
            ></paper-input>
            <paper-input
              label="Phone number"
              required
              type="number"
              min="100000000"
              id="phone"
              max="999999999"
              .value="${this.phone}"
              autoValidate
            >
              <div slot="prefix">+255</div>
            </paper-input>
            <paper-input
              required
              label="Birth date"
              id="dateOfBirth"
              type="date"
              .value="${this.dateOfBirth}"
            ></paper-input>
            <paper-button
              id="submit"
              type="submit"
              class="blue"
              @click="${() => {
                this.shadowRoot.getElementById("form2").submit();
              }}"
              >Update user
            </paper-button>
          </form>
        </iron-form>
      </div>
    `;
  }
  async performUpdate() {
    this._setUsers().then((res) => {
      res.forEach((i) => {
        if (i.email === window.location.search.split("=")[1]) {
          this.userId = i.id;
          this.fullname = i.fullname;
          this.phone = i.phone;
          this.dateOfBirth = i.dateOfBirth;
          this.email = i.email;
        }
      });
      super.performUpdate();
    });
  }

  _update(fullname, phone, dateOfBirth, email, id) {
    var indexedDBRef =
      window.indexedDB ||
      window.mozIndexedDB ||
      window.webkitIndexedDB ||
      window.msIndexedDB;
    var db;
    var name = fullname;
    var request = indexedDBRef.open("user", 3);
    var thiss = this;
    request.onsuccess = function (event) {
      //wait hre
      db = request.result;
      db.transaction(["user"], "readwrite", "relaxed").objectStore("user").put({
        id: id,
        fullname: fullname,
        dateOfBirth: dateOfBirth,
        email: email,
        phone: phone,
      });
      db.onerror = function (event) {
        alert(
          "Unable to add " +
            name +
            ", probably he/she is already in the database! "
        );
      };
      alert("successfully updated");
      window.location.replace(window.location.href.split("/view")[0]);
    };
    request.onerror = function (event) {
      console.log("unsuccessful connection");
    };
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

customElements.define("my-view3", MyView3);
