const stylesheet = {
  f: function (hostSelector, shadowSelector, nativeShadow) {
    return ["h1", shadowSelector, " {}.foo", shadowSelector, " {}[data-foo]", shadowSelector, " {}[data-foo=\"bar\"]", shadowSelector, " {}"].join('');
  }
}
export default [stylesheet];