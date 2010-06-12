var assert = require('assert');
var templating = require('josi/templating');

this.name = 'Templating Tests';

var compileTemplate = function(str) {
  var templater = new templating.MicroTemplatingEngine();
  return templater.compile(str);
};

this.tests = {
  'MicroTemplatingEngine simple replacement': function() {
    var template = compileTemplate('a <%= c %> b');
    var rendered = template({ c: 'd' });
    assert.equal(rendered, 'a d b');
  },
  'MicroTemplatingEngine loop': function() {
    var template = compileTemplate('a <% for (var i in c) { %><%= i %> <%= c[i] %> <% } %>b');
    var rendered = template({ c: ['d', 'e', 'f'] });
    assert.equal(rendered, 'a 0 d 1 e 2 f b');
  },
  'MicroTemplatingEngine if': function() {
    var template = compileTemplate('a <% if (showCOnce) { %><%= c %><% } %><% if (showCTwice) { %><%= c %><% } %> b');
    var rendered = template({ showCOnce: true, showCTwice: false, c: 'd' });
    assert.equal(rendered, 'a d b');
  },
  'MicroTemplatingEngine if else': function() {
    var template = compileTemplate(
      'a ' +
      '<% if (showCOnce) { %><%= c %><% } else { %>no<%= c %><% } %> ' +
      '<% if (showCTwice) { %><%= c %><% } else { %>no<%= c %><% } %> ' +
      'b');
    var rendered = template({ showCOnce: true, showCTwice: false, c: 'd' });
    assert.equal(rendered, 'a d nod b');
  },
  'MicroTemplatingEngine single quotes': function() {
    var template = compileTemplate("'<%= c %>'");
    var rendered = template({ c: 'd' });
    assert.equal(rendered, "'d'");
  },
  'MicroTemplatingEngine double quotes': function() {
    var template = compileTemplate('"<%= c %>"');
    var rendered = template({ c: 'd' });
    assert.equal(rendered, '"d"');
  },
  'MicroTemplatingEngine script tag': function() {
    var template = compileTemplate('<%= c %><script type="text/javascript">$(function() { $(\'ul\').css(\'color\', \'red\'); });</script>');
    var rendered = template({ c: 'd' });
    assert.equal(rendered, 'd<script type="text/javascript">$(function() { $(\'ul\').css(\'color\', \'red\'); });</script>');
  },
  'MicroTemplatingEngine inline code': function() {
    var template = compileTemplate('<% var doubleIt = function(it) { return it + it; }; %><%= doubleIt(c) %>');
    var rendered = template({ c: 'd' });
    assert.equal(rendered, 'dd');
  }
};
