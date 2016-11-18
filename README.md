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

