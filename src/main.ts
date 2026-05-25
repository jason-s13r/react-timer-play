import r2wc from "@r2wc/react-to-web-component";
import Timer from "./components/timer/Timer.jsx";

const WebTimer = r2wc(Timer, {
  props: {
    Hz: "number",
  },
});


if (!customElements.get("web-timer")) {
  customElements.define("web-timer", WebTimer);
}