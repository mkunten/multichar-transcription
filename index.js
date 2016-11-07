// multichar-transcription.js

module.exports = (function() {
  // Node
  var Node = function() {
    var _depth = 0
      , _replaceString = null
      , _childNodes = {}
    function dump() {
      var keys = Object.keys(_childNodes)
      var res = {}
      if (keys.length > 0) {
        res = {
          replaceString: _replaceString
        , childNodes: keys.reduce(function(prev, key) {
            prev[key] = _childNodes[key].dump()
            return prev
          }, {})
        }
      }
      else {
        res = {
          replaceString: _replaceString
        }
      }
      return res
    }
    function addEntry(src, depth, dest) {
      _depth = depth
      if (src.length === depth) {
        _replaceString = dest
      }
      else {
        if (!_childNodes[src[depth]]) {
          _childNodes[src[depth]] = new Node()
        }
        _childNodes[src[depth]].addEntry(src, depth + 1, dest)
      }
    }
    function getDepth() {
      return _depth
    }
    function getReplaceString() {
      return _replaceString
    }
    function searchNode(src, depth) {
      if (src.length === depth) {
        return this
      }
      if (_childNodes[src[depth]]) {
        var terminal = _childNodes[src[depth]].searchNode(src, depth + 1)
        if (terminal !== null) {
          return terminal
        }
        else {
          if (_replaceString !== null) {
            return this
          }
        }
      }
      if (_replaceString === null) {
        return null
      }
      else {
        return this
      }
    }
    return {
      dump: dump
    , addEntry: addEntry
    , getDepth: getDepth
    , getReplaceString: getReplaceString
    , searchNode: searchNode
    }
  }

  //
  var _nodes = {}
  function dump(from, to) {
    return _nodes[from][to].dump()
  }
  function addToNode(from, to, fromChars, toChars) {
    if (!_nodes[from]) {
      _nodes[from] = {}
    }
    _nodes[from][to] = new Node()
    Object.keys(fromChars).forEach(function(key) {
      toChar = toChars[key] instanceof Array ? toChars[key][0] : toChars[key]
      if(fromChars[key] instanceof Array) {
        fromChars[key].forEach(function(fromChar) {
          _nodes[from][to].addEntry(fromChar, 0, toChar)
        })
      }
      else {
        _nodes[from][to].addEntry(fromChars[key], 0, toChar)
      }
    })
    return (function(src) {
      return convert(from, to, src)
    })
  }
  function convert(from, to, src) {
    var dest = []
      , node
      , start
    for (start = 0; start < src.length; ) {
      node = _nodes[from][to].searchNode(src, start)
      if (node === null) {
        dest.push(src[start])
        start++
      }
      else {
        dest.push(node.getReplaceString())
        start += node.getDepth()
      }
    }
    return dest.join('')
  }

  // export
  return {
    dump: dump
  , addToNode: addToNode
  , convert: convert
  }
})()
