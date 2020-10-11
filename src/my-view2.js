import { PolymerElement, html } from "@polymer/polymer/polymer-element.js";
import "./shared-styles.js";
import "@polymer/paper-input/paper-input.js";
import "@polymer/paper-button/paper-button.js";
import "@polymer/iron-form/iron-form.js";

class MyView2 extends PolymerElement {
  static get properties() {
    return {
      fullname: {
        type: String,
      },
      email: {
        type: String,
      },
      phone: {
        type: Number,
      },
      dateOfBirth: {
        type: String,
      },
      indexedDBRef: {
        value:
          window.indexedDB ||
          window.mozIndexedDB ||
          window.webkitIndexedDB ||
          window.msIndexedDB,
      },
    };
  }

  constructor() {
    super();
    var thiss = this;
    this.addEventListener("iron-form-submit", function (event) {
      event.preventDefault();
      thiss.add(thiss.fullname, thiss.phone, thiss.dateOfBirth, thiss.email);
    });
    if (!this.indexedDBRef) {
      window.alert(
        "Your browser doesn't support a stable version of IndexedDB. Data will be stored in local storage. You might want to update your browser!!"
      );
    } else {
      console.log("Indexed DB is supported!");
    }
  }

  static get template() {
    return html`
      <style include="shared-styles">
            :host {
              display: block,
              padding: 10px
            }
        paper-button.green {
          background-color: var(--paper-green-500);
          color: white;
        }
      </style>

      <div class="card">
        <h3>Add user:</h3>
        <div class="output"></div>
        <hr />
        <iron-form id="form1" onsubmit="{{handleSubmit}}">
          <form method="POST" onsubmit="handleSubmit" target="_self">
            <paper-input
              label="Full name"
              value="{{fullname}}"
              type="text"
              maxlength="50"
              autoValidate
              required
            ></paper-input>
            <paper-input
              required
              label="Email"
              type="email"
              value="{{email}}"
              autoValidate
            ></paper-input>
            <paper-input
              label="Phone number"
              required
              type="number"
              min="100000000"
              max="999999999"
              value="{{phone}}"
              autoValidate
            >
              <div slot="prefix">+255</div>
            </paper-input>
            <paper-input
              required
              label="Birth date"
              type="date"
              value="{{dateOfBirth}}"
            ></paper-input>
            <paper-button
              id="submit"
              type="submit"
              class="green"
              on-tap="submit"
              >Submit user
            </paper-button>
          </form>
        </iron-form>
      </div>
    `;
  }

  submit(e) {
    this.$.form1.submit();
  }
  reset() {
    this.$.form1.reset();
  }

  add(fullname, phone, dateOfBirth, email) {
    var db;
    var name = fullname;
    var request = this.indexedDBRef.open("user", 3);
    var thiss = this;
    request.onupgradeneeded = (event) => {
      db = event.target.result;
      console.log(db);
      db.createObjectStore("user", { keyPath: "id" });
      console.log("upgrade");
    };
    request.onsuccess = function (event) {
      //wait hre
      db = request.result;
      var store = db
        .transaction(["user"], "readwrite", "relaxed")
        .objectStore("user");
      store.add({
        id: new Date(),
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
      alert(name + " was successfully added");
      thiss.reset();
    };

    request.onerror = function (event) {
      console.log("unsuccessful connection");
    };
  }
}

window.customElements.define("my-view2", MyView2);
