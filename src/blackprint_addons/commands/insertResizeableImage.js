(function(wysihtml5) {
  var NODE_NAME = "IMG";

  wysihtml5.commands.insertResizeableImage = {
    /**
     * Inserts an <img>
     * If selection is already an image link, it removes it
     * 
     * @example
     *    // either ...
     *    wysihtml5.commands.insertResizeableImage.exec(composer, "insertResizeableImage", "http://www.google.de/logo.jpg");
     *    // ... or ...
     *    wysihtml5.commands.insertResizeableImage.exec(composer, "insertResizeableImage", { src: "http://www.google.de/logo.jpg", title: "foo" });
     */
    exec: function(composer, command, value) {
      value = typeof(value) === "object" ? value : {
        src: value
      };

      var doc = composer.doc,
        image = this.state(composer),
        textNode, parent;

      if (image) {
        // Image already selected, set the caret before it and delete it
        composer.selection.setBefore(image);
        parent = image.parentNode;
        parent.removeChild(image);

        // and it's parent <a> too if it hasn't got any other relevant child nodes
        wysihtml5.dom.removeEmptyTextNodes(parent);
        if (parent.nodeName === "A" && !parent.firstChild) {
          composer.selection.setAfter(parent);
          parent.parentNode.removeChild(parent);
        }

        // firefox and ie sometimes don't remove the image handles, even though the image got removed
        wysihtml5.quirks.redraw(composer.element);
        return;
      }

      imageWrapper = doc.createElement("span");
      imageWrapper.setAttribute('class', 'image-wrapper');

      image = doc.createElement(NODE_NAME);
      //console.dir('INSERTING IMAGE');
      composer.iframe.setAttribute('id', 'simpleIFrame');
      console.dir(composer.iframe)

      //$(composer.iframe).webkitimageresize().webkittableresize().webkittdresize();
       $("#simpleIFrame").webkitimageresize().webkittableresize().webkittdresize();


       /////

      for (var i in value) {
        image.setAttribute(i === "className" ? "class" : i, value[i]);
      }

      imageWrapper.appendChild(image);

      composer.selection.insertNode(image);
      //composer.selection.insertNode(imageWrapper);
      if (wysihtml5.browser.hasProblemsSettingCaretAfterImg()) {
        textNode = doc.createTextNode(wysihtml5.INVISIBLE_SPACE);
        composer.selection.insertNode(textNode);
        composer.selection.setAfter(textNode);
      } else {
        composer.selection.setAfter(image);
        //composer.selection.insertNode(imageWrapper);
      }
    },

    state: function(composer) {
      var doc = composer.doc,
        selectedNode, text, imagesInSelection;

      if (!wysihtml5.dom.hasElementWithTagName(doc, NODE_NAME)) {
        return false;
      }

      selectedNode = composer.selection.getSelectedNode();
      if (!selectedNode) {
        return false;
      }

      if (selectedNode.nodeName === NODE_NAME) {
        // This works perfectly in IE
        return selectedNode;
      }

      if (selectedNode.nodeType !== wysihtml5.ELEMENT_NODE) {
        return false;
      }

      text = composer.selection.getText();
      text = wysihtml5.lang.string(text).trim();
      if (text) {
        return false;
      }

      imagesInSelection = composer.selection.getNodes(wysihtml5.ELEMENT_NODE, function(node) {
        return node.nodeName === "IMG";
      });

      if (imagesInSelection.length !== 1) {
        return false;
      }

      return imagesInSelection[0];
    }
  };
})(wysihtml5);