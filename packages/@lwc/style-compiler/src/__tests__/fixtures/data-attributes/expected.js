const stylesheet = {
  f: function (hostSelector, shadowSelector, nativeShadow) {
    return ["[data-foo]", shadowSelector, " {}[data-foo=\"bar\"]", shadowSelector, " {}"].join('');
  }
}
export default [stylesheet];