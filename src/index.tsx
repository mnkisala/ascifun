import { render } from "solid-js/web";
import "./style/index.scss";
import { ascify, AscifyConfig } from "../ascifuner/pkg/index";

import { createEffect, createSignal, For } from "solid-js";

import { Buffer } from "buffer";

function Input({ name, displayName, type, forward }) {
  return (
    <div class="input__container">
      <label class="input__label" for={name}>
        {displayName || name}
      </label>
      <input
        class="input__input"
        type={type}
        name={name}
        id={name}
        {...forward}
      />
    </div>
  );
}

function CoolRadioButtons({ active, setActive, options }) {
  return (
    <div class="cool_radio_buttons__container">
      <For each={options}>
        {(option: any) => (
          <button
            class={`cool_radio_buttons__button ${
              option.key == active() && "cool_radio_buttons__button-active"
            }`}
            value={option.key}
            onclick={(e: any) => setActive(e.target.value)}
          >
            {option.name}
          </button>
        )}
      </For>
    </div>
  );
}

function ConfigPanel({
  setAscii,
  colorMode,
  setColorMode,
  fontSize,
  setFontSize,
}) {
  const [ramp, setRamp] = createSignal("@%#*+=-:. ");
  const [columns, setColumns] = createSignal(80);
  const [file, setFile] = createSignal(null);

  createEffect(() => {
    setFontSize((1 / columns()) * 600); // TOOD: proper auto resize formula
  });

  createEffect(() => {
    const conf = new AscifyConfig(ramp(), colorMode() == "dark", columns());
    if (file()) {
      const reader = new FileReader();
      reader.readAsArrayBuffer(file());
      reader.onload = (e) => {
        const content = e.target.result;
        const content_b64 = Buffer.from(content as ArrayBuffer).toString(
          "base64"
        );
        setAscii(ascify(content_b64, conf));
      };
    }
  });

  return (
    <div class="config">
      <Input
        type="file"
        name="file"
        displayName="Input file"
        forward={{
          accept: "image/jpeg,image/png",
          onchange: (e: any) => setFile(e.target.files[0]),
        }}
      />
      <Input
        type="text"
        name="ramp"
        displayName="Character ramp"
        forward={{
          value: ramp(),
          oninput: (e: any) => setRamp(e.target.value),
        }}
      />
      <Input
        type="number"
        name="columns"
        displayName="Columns"
        forward={{
          value: columns(),
          oninput: (e: any) => setColumns(Math.max(1, e.target.value)),
          min: "1",
          onchange: (e: any) => {
            if (e.target.value != "") {
              e.target.value = Math.max(1, e.target.value);
            }
          },
        }}
      />

      <CoolRadioButtons
        active={colorMode}
        setActive={(e) => setColorMode(e)}
        options={[
          {
            key: "dark",
            name: "dark",
          },
          {
            key: "light",
            name: "light",
          },
        ]}
      />

      <Input
        type="number"
        name="fontsize"
        displayName="Preview font size"
        forward={{
          value: fontSize(),
          oninput: (e: any) => setFontSize(Math.max(1, e.target.value)),
          onchange: (e: any) => {
            if (e.target.value != "") {
              e.target.value = Math.max(1, e.target.value);
            }
          },
        }}
      />
    </div>
  );
}

function Logo() {
  return (
    <div class="logo__container">
      <h1 class="logo__header">ascifun</h1>
    </div>
  );
}

function App() {
  const [ascii, setAscii] = createSignal("");
  const [fontSize, setFontSize] = createSignal(8);
  const [colorMode, setColorMode] = createSignal("dark");

  return (
    <>
      <div class="app-container">
        <Logo />
        <ConfigPanel
          colorMode={colorMode}
          setColorMode={setColorMode}
          setAscii={setAscii}
          fontSize={fontSize}
          setFontSize={setFontSize}
        />
        <div class={`output__container output__container-${colorMode()}`}>
          <div class="output__output" style={`font-size: ${fontSize()}px;`}>
            <pre>
              <code innerHTML={ascii() || "preview"}></code>
            </pre>
          </div>
        </div>
      </div>
    </>
  );
}

render(() => <App />, document.body.appendChild(document.createElement("div")));
