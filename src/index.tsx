import { render } from "solid-js/web";
import "./style/index.scss";
import { ascify, AscifyConfig } from "../ascifuner/pkg/index";

import { createEffect, createSignal } from "solid-js";

import { Buffer } from "buffer";

function App() {
  const [ascii, setAscii] = createSignal("");

  const [url, setUrl] = createSignal(
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRb2GJhj2pL0ucqdr5niq0YbS6phdjDy95scMKQmk6K5Q&s"
  );
  /*
  const [url, setUrl] = createSignal(
    "https://static.wikia.nocookie.net/shingekinokyojin/images/f/f0/Levi_Ackermann_%28Anime%29_character_image_%28850%29.png/revision/latest?cb=20210124214225"
  );
  */
  const [ramp, setRamp] = createSignal("@%#*+=-:. ");
  const [columns, setColumns] = createSignal(40);
  const [invert, setInvert] = createSignal(true);

  createEffect(() => {
    console.log(ramp(), columns(), invert());
  });

  createEffect(() => {
    const conf = new AscifyConfig(ramp(), invert(), columns());

    console.log("dupa");
    setAscii("");
    fetch(url())
      .then((req) => req.blob())
      .then((blob) => blob.arrayBuffer())
      .then((buf) => {
        setAscii(ascify(Buffer.from(buf).toString("base64"), conf));
      })
      .catch((reason) => {
        setAscii(`error:<br/><br/>${reason}`);
      });
  });

  return (
    <div class="app-container">
      <div class="config">
        <div class="config__block">
          <label for="url">url</label>
          <input
            type="text"
            id="url"
            value={url()}
            oninput={(e) => setUrl(e.currentTarget.value)}
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
      <div class="output">
        <pre>
          <code innerHTML={ascii() || "loading..."}></code>
        </pre>
      </div>
    </div>
  );
}

render(() => <App />, document.body.appendChild(document.createElement("div")));
