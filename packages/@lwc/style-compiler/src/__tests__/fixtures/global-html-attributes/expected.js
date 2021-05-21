const stylesheet = {
  f: function (hostSelector, shadowSelector, nativeShadow) {
    return ["[hidden]", shadowSelector, " {}[lang=\"fr\"]", shadowSelector, " {}"].join('');
  }
}
export default [stylesheet];