// main.js

var assert = require('power-assert');
var MulticharTranscription = require('../index.js');

describe('MulticharTranscription', function() {
  var tr1 = {
      'a': 'a',
      'ā': 'ā',
      'i': 'i',
      'ī': 'ī',
      'ṛ': 'ṛ',
      'ṝ': 'ṝ',
      'g': 'g',
      'ṅ': 'ṅ',
      'ṇ': 'ṇ',
      'n': 'n',
      'r': 'r'
    },
    tr2 = {
      'a': 'a',
      'ā': 'aa',
      'i': 'i',
      'ī': 'ii',
      'ṛ': '.r',
      'ṝ': ['.r.r', ':r'],
      'g': 'g',
      'ṅ': '.g',
      'ṇ': '.n',
      'n': 'n',
      'r': 'r'
    },
    tr3 = {
      'a': 'a',
      'ā': 'A',
      'i': 'i',
      'ī': 'I',
      'ṛ': 'R',
      'ṝ': ['RR', 'Q', 'QQ'],
      'g': 'g',
      'ṅ': 'G',
      'ṇ': 'N',
      'n': 'n',
      'r': 'r'
    },
    dump;

  var f1to2 = MulticharTranscription.addToNode('tr1', 'tr2', tr1, tr2),
    f2to3 = MulticharTranscription.addToNode('tr2', 'tr3', tr2, tr3),
    f3to1 = MulticharTranscription.addToNode('tr3', 'tr1', tr3, tr1);

  describe('addToNode & dump', function() {
    it('tr1 -> tr2', function() {
      dump = MulticharTranscription.dump('tr1', 'tr2');
      assert.strictEqual(null, dump.replaceString);
      assert.strictEqual(undefined, dump.childNodes['.']);
      assert.strictEqual('.r', dump.childNodes['ṛ'].replaceString);
      assert.strictEqual('.r.r', dump.childNodes['ṝ'].replaceString);
    });
    it('tr2 -> tr3', function() {
      dump = MulticharTranscription.dump('tr2', 'tr3');
      assert.strictEqual(null, dump.replaceString);
      assert.strictEqual(null, dump.childNodes['.'].replaceString);
      assert.strictEqual('r', dump.childNodes['r'].replaceString);
      assert.strictEqual('RR', dump.childNodes['.'].childNodes['r'].childNodes['.'].childNodes['r'].replaceString);
      assert.strictEqual('RR', dump.childNodes[':'].childNodes['r'].replaceString);
    });
    it('tr3 -> tr1', function() {
      dump = MulticharTranscription.dump('tr3', 'tr1');
      assert.strictEqual(null, dump.replaceString);
      assert.strictEqual(undefined, dump.childNodes['.']);
      assert.strictEqual('r', dump.childNodes['r'].replaceString);
      assert.strictEqual('ṝ', dump.childNodes['R'].childNodes['R'].replaceString);
      assert.strictEqual('ṝ', dump.childNodes['Q'].childNodes['Q'].replaceString);
    });
  });

  describe('convert', function() {
    it('tr1 -> tr2', function() {
      assert.strictEqual('aaaiii.r.r.rrg.g.nn',
        MulticharTranscription.convert('tr1', 'tr2', 'aāiīṛṝrgṅṇn'));
    });
    it('tr2 -> tr3', function() {
      assert.strictEqual('AaIiRRRrgGNn',
        MulticharTranscription.convert('tr2', 'tr3', 'aaaiii.r.r.rrg.g.nn'));
      assert.strictEqual('RR RR',
        MulticharTranscription.convert('tr2', 'tr3', '.r.r :r'));
      assert.strictEqual('RR RR',
        MulticharTranscription.convert('tr2', 'tr3', ':r :r'));
    });
    it('tr3 -> tr1', function() {
      assert.strictEqual('aāiīṝṛrgṅṇn',
        MulticharTranscription.convert('tr3', 'tr1', 'aAiIRRRrgGNn'));
      assert.strictEqual('ṝ ṝ ṝ',
        MulticharTranscription.convert('tr3', 'tr1', 'RR Q QQ'));
    });
  });

  describe('converter returned by addToNode', function() {
    it('tr1 -> tr2', function() {
      assert.strictEqual('aaaiii.r.r.rrg.g.nn',
        f1to2('aāiīṛṝrgṅṇn'));
    });
    it('tr2 -> tr3', function() {
      assert.strictEqual('AaIiRRRrgGNn',
        f2to3('aaaiii.r.r.rrg.g.nn'));
      assert.strictEqual('RR RR',
        f2to3('.r.r :r'));
      assert.strictEqual('RR RR',
        f2to3( ':r :r'));
    });
    it('tr3 -> tr1', function() {
      assert.strictEqual('aāiīṝṛrgṅṇn',
        f3to1('aAiIRRRrgGNn'));
      assert.strictEqual('ṝ ṝ ṝ',
        f3to1('RR Q QQ'));
    });
  });
});
