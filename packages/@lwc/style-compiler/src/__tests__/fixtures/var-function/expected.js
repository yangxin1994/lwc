import varResolver from "custom-properties-resolver";
const stylesheet = {
  f: function (hostSelector, shadowSelector, nativeShadow) {
    return ["div", shadowSelector, " {color: ", varResolver("--lwc-color"), ";}div", shadowSelector, " {color: ", varResolver("--lwc-color","black"), ";}div", shadowSelector, " {color: ", varResolver("--lwc-color"), " important;}"].join('');
  }
}
export default [stylesheet];