import { render } from "solid-js/web";
import "./style/index.scss";
import { ascify, AscifyConfig } from "../ascifuner/pkg/index";

import { createSignal } from "solid-js";

import { Buffer } from "buffer";

function App() {
  let [ascii, setAscii] = createSignal("");

  fetch(
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRb2GJhj2pL0ucqdr5niq0YbS6phdjDy95scMKQmk6K5Q&s"
  ).then((req) =>
    req.arrayBuffer().then((buf) => {
      setAscii(
        ascify(
          Buffer.from(buf).toString("base64"),
          new AscifyConfig("@#1=1", false, 80)
        )
      );
    })
  );

  return (
    <div class="app-container">
      <h1>hello world</h1>
      <pre>
        <code>{ascii() || "loading..."}</code>
      </pre>
    </div>
  );
}

render(() => <App />, document.body.appendChild(document.createElement("div")));
