const stylesheet = {
  f: function (hostSelector, shadowSelector, nativeShadow) {
    return ["*", shadowSelector, " {}"].join('');
  }
}
export default [stylesheet];