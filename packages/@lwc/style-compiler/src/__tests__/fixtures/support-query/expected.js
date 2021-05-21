const stylesheet = {
  f: function (hostSelector, shadowSelector, nativeShadow) {
    return ["@supports (display: flex) {h1", shadowSelector, " {}}"].join('');
  }
}
export default [stylesheet];