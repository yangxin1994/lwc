const stylesheet = {
  f: function (hostSelector, shadowSelector, nativeShadow) {
    return [":checked", shadowSelector, " {}ul", shadowSelector, " li:first-child", shadowSelector, " a", shadowSelector, " {}"].join('');
  }
}
export default [stylesheet];