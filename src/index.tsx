import { render } from "solid-js/web";
import "./style/index.scss";
import { ascify } from "../ascifuner/pkg/index";

import { createSignal } from "solid-js";

import { Buffer } from "buffer";

function App() {
  let [ascii, setAscii] = createSignal("");

  fetch(
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRb2GJhj2pL0ucqdr5niq0YbS6phdjDy95scMKQmk6K5Q&s"
  ).then((req) =>
    req.arrayBuffer().then((buf) => {
      console.log("dupa");
      setAscii(
        ascify(Buffer.from(buf).toString("base64"), {
          ramp: "",
          inverse_ramp: false,
          columns: 80,
          free: () => {},
        })
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
