import varResolver from "custom-properties-resolver";
const stylesheet = {
  f: function (hostSelector, shadowSelector, nativeShadow) {
    return ["div", shadowSelector, " {background: ", varResolver("--lwc-color",varResolver("--lwc-other","black")), ";}"].join('');
  }
}
export default [stylesheet];