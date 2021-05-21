const stylesheet = {
  f: function (hostSelector, shadowSelector, nativeShadow) {
    return ["[dir=\"rtl\"]", shadowSelector, " test", shadowSelector, " {order: 0;}"].join('');
  }
}
export default [stylesheet];