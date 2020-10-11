import { rootPath } from "@polymer/polymer/lib/utils/settings";
import { LitElement, html, css } from "lit-element";

class MyView404 extends LitElement {
  static get styles() {
    return css`
      :host {
        display: block;

        padding: 10px 20px;
      }
      p {
        font-family: Roboto;
        font-size: 16px;
        font-weight: 500;
      }
      .red {
        color: red;
      }
      .blue {
        color: blue;
      }
    `;
  }
  render() {
    return html`
      Oops you hit a 404. <a href="${rootPath}">Head back to home.</a>
    `;
  }
}

window.customElements.define("my-view404", MyView404);
