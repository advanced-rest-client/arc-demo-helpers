[![Build Status](https://travis-ci.org/advanced-rest-client/arc-demo-helpers.svg?branch=master)](https://travis-ci.org/advanced-rest-client/arc-demo-helpers)  

# arc-demo-snippet

The `<arc-demo-snippet>` displays a parsed code of the code sample and renders the element
initializing Polymer's data binding.
It similar to use Google's `<demo-snippet>` but you don't need to add `is="dom-bind"` to the
template and you can set initial values on the `arc-demo-snippet` element itself.

## Example
```
<arc-demo-snippet initialValue="5" selected="thisElement">
  <template>
    <some-element init="{{initialValue}}"></some-element>
    <other-element selected="[[selected]]"></other-element>
  </template>
</arc-demo-snippet>
```
This is equivalent to:
```
<demo-snippet>
  <template is="dom-bind">
    <some-element init="{{initialValue}}"></some-element>
    <other-element selected="[[selected]]"></other-element>
    <script>
      (function(app) {
        app.initialValue = 0;
        app.selected = 'thisElement';
      })(document.querySelector('template[is="dom-bind"]'));
    </script>
  </template>
</demo-snippet>
```
But it's just less work to do it.

Inside the template you can use usual data binding.

# raml-demo-parser

# `<raml-docs-parser>`
The `<raml-docs-parser>` is an element that is intended to use in demo pages as a
set of RAML parser, RAML entry lookup and produces JSON output that is used by
other elements.

## Usage
```
<raml-docs-parser raml="{{raml}}"></raml-docs-parser>
```
The `raml` property will contain a JSON output from the parser. Also `raml-ready` event will
be fired with the `raml` property on the detail object.

