import { render } from "solid-js/web";
import "./style/index.scss";
import { ascify, AscifyConfig } from "../ascifuner/pkg/index";

import { createEffect, createSignal } from "solid-js";

import { Buffer } from "buffer";

function ConfigPanel({ setAscii }) {
  const [ramp, setRamp] = createSignal("@%#*+=-:. ");
  const [columns, setColumns] = createSignal(40);
  const [invert, setInvert] = createSignal(true);
  const [file, setFile] = createSignal(null);

  createEffect(() => {
    const conf = new AscifyConfig(ramp(), invert(), columns());
    if (file()) {
      const reader = new FileReader();
      reader.readAsArrayBuffer(file());
      reader.onload = (e) => {
        const content = e.target.result;
        const content_b64 = Buffer.from(content as ArrayBuffer).toString(
          "base64"
        );
        console.log(content_b64);
        setAscii(ascify(content_b64, conf));
      };
    }
  });

  return (
    <div class="config">
      <div class="config__block">
        <label for="file">file</label>
        <input
          type="file"
          id="file"
          accept="image/jpeg,image/png"
          onchange={(e) => {
            setFile(e.target.files[0]);
          }}
        />
      </div>

      <div class="config__block">
        <label for="ramp">ramp</label>
        <input
          type="text"
          id="ramp"
          value={ramp()}
          oninput={(e) => {
            setRamp(e.currentTarget.value);
            console.log(ramp());
          }}
        />
      </div>

      <div class="config__block">
        <label for="columns">columns</label>
        <input
          type="number"
          id="columns"
          value={columns()}
          oninput={(e) => {
            const input = e.currentTarget.value;
            if (input == "") {
              setColumns(1);
            } else {
              setColumns(Math.max(parseInt(input), 1));
            }
          }}
        />
      </div>

      <div class="config__block">
        <label for="invert">invert</label>
        <input
          type="checkbox"
          id="invert"
          checked={invert()}
          onchange={(e) => setInvert(e.currentTarget.checked)}
        />
      </div>
    </div>
  );
}

function App() {
  const [ascii, setAscii] = createSignal("");

  return (
    <div class="app-container">
      <ConfigPanel setAscii={setAscii} />
      <div class="output">
        <pre>
          <code innerHTML={ascii() || "loading..."}></code>
        </pre>
      </div>
    </div>
  );
}

render(() => <App />, document.body.appendChild(document.createElement("div")));
