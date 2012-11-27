var fs = require('fs'),
    path = require('path'),
    marked = require('marked'),
    cheerio = require('cheerio');
    hogan = require("hogan.js");

console.log(process.argv);

var markdown = fs.readFileSync(process.argv[2]).toString(),
    template = fs.readFileSync(process.argv[3]).toString(),
    outp = process.argv[4];

/* Markdown to HTML */

// Set default options
marked.setOptions({
  gfm: true,
  pedantic: false,
  sanitize: true,
});

var html = marked(markdown);


/* HTML cleanup and processing */

var data = {
  nav: [],
  sidenav: []
};

$ = cheerio.load(html);

var linkify = function(el, anchor_prefix) {
  var text = $(el).text(),
      anchor = text;

  if (anchor_prefix !== undefined) {
    anchor = anchor_prefix + '/' + anchor;
  }

  $(el).empty();
  $(el).attr('id', anchor);
  $(el).append('<a href="#' + anchor + '">' + text + '</a>' );

  return anchor;
}

var toc = {},
    tl = null,
    parent_anchor;

$.root().children().each(function(i, el) {
  var anchor;
  if (el.name == 'h1') {
    tl = $(this).text();
    anchor = linkify(el);
    toc[tl] = [];
    data.nav.push({anchor: tl, name: tl});
    data.sidenav.push({anchor: tl, name: tl, top_level: true});
    parent_anchor = tl;
  } else if (el.name == 'h2') {
    var text = $(this).text();
    toc[tl].push(text)
    anchor = linkify(el, parent_anchor);
    data.sidenav.push({anchor: anchor, name: text});
  }
});

var partials = {
  body: $.html()
};

/* Template processing */

var template = hogan.compile(template);

var output = template.render(data, partials);

/* Final write out */

fs.writeFileSync(path.join(outp, "index.html"), output);
