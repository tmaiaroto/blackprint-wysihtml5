/**
 * Forked from: https://github.com/artillery/bootstrap-wysihtml5
 * Uses Font Awesome for icons now instead of default Twitter Bootstrap glyphs.
 * Also adds a few new plugins.
 *
 * This forked configuration, the add-ons, and the forked wysihtml5 editor itself
 * assumes you are using the Blackprint CMS, which uses Twitter Bootstrap and
 * Font Awesome. However, while the Blackprint CMS isn't required to use these
 * enhancements, certain add-ons won't really work out of the box.
 *
 * The original bootstrap-wysihtml5 project was lagging behind in terms of supporting
 * Twitter Bootstrap 3. Artillery's version was better, but Font Awesome's icons are nicer
 * and Blackprint is going to have some additional need for custom plugins anyway...
 * So... Why not? It's just one less external asset to fetch and since it's nothing super
 * complex and the other repositories are updating slowly, it's not a huge deal to retrace
 * some of their steps. Though this version is certainly more simplistic, thee code isn't
 * separated out into a "src" directory all organized, with build and tests, etc.
 * 
 * The original wysihtml5 project was also lagging behind a bit in terms of features
 * and growth. At the time of this fork, no new commits were made to the repository
 * in over 10 months. The bulk of the work for wysihtml5 was done a year to two years
 * ago and so I figured the project was stalled or satisfied the requirements of the
 * creator and no further work was really going to take place.
 *
 * While I hate forking things, I decided to fork this editor. The hard work put in
 * by the Xing team is more than appreciated. This is a wonderful editor, but in order
 * to work for the Blackprint CMS, it needs a few additional features. It is important
 * to note that the "style" attribute has been allowed now (pulled in changes from
 * various pull requests) and this fork will make no attempt to stay JavaScript library
 * agnostic. In fact, it now requires jQuery (I figured not a huge pill to swallow).
 *
*/
!function($, wysi) {
	"use strict";

	var tpl = {
		"font-styles": function(locale, options) {
			var size = (options && options.size) ? ' btn-'+options.size : '';
			return "<li class='dropdown'>" +
			  "<a class='btn btn-default btn" + size + " dropdown-toggle' data-toggle='dropdown' href='#'>" +
			  "<i class='fa fa-font'></i>&nbsp;<span class='current-font'>" + locale.font_styles.normal + "</span>&nbsp;<b class='caret'></b>" +
			  "</a>" +
			  "<ul class='dropdown-menu'>" +
				"<li><a data-wysihtml5-command='formatBlock' data-wysihtml5-command-value='div' tabindex='-1'>" + locale.font_styles.normal + "</a></li>" +
				"<li><a data-wysihtml5-command='formatBlock' data-wysihtml5-command-value='h1' tabindex='-1'>" + locale.font_styles.h1 + "</a></li>" +
				"<li><a data-wysihtml5-command='formatBlock' data-wysihtml5-command-value='h2' tabindex='-1'>" + locale.font_styles.h2 + "</a></li>" +
				"<li><a data-wysihtml5-command='formatBlock' data-wysihtml5-command-value='h3' tabindex='-1'>" + locale.font_styles.h3 + "</a></li>" +
				"<li><a data-wysihtml5-command='formatBlock' data-wysihtml5-command-value='h4'>" + locale.font_styles.h4 + "</a></li>" +
				"<li><a data-wysihtml5-command='formatBlock' data-wysihtml5-command-value='h5'>" + locale.font_styles.h5 + "</a></li>" +
				"<li><a data-wysihtml5-command='formatBlock' data-wysihtml5-command-value='h6'>" + locale.font_styles.h6 + "</a></li>" +
			  "</ul>" +
			"</li>";
		},

		"emphasis": function(locale, options) {
			var size = (options && options.size) ? ' btn-'+options.size : '';
			return "<li>" +
			  "<div class='btn-group'>" +
				"<a class='btn btn-default btn" + size + "' data-wysihtml5-command='bold' title='CTRL+B' tabindex='-1'><i class='fa fa-bold'></i></a>" +
				// "<a class='btn btn-default btn" + size + "' data-wysihtml5-command='bold' title='CTRL+B' tabindex='-1'>" + locale.emphasis.bold + "</a>" +
				"<a class='btn btn-default btn" + size + "' data-wysihtml5-command='italic' title='CTRL+I' tabindex='-1'><i class='fa fa-italic'></i></a>" +
				// "<a class='btn btn-default btn" + size + "' data-wysihtml5-command='italic' title='CTRL+I' tabindex='-1'>" + locale.emphasis.italic + "</a>" +
				"<a class='btn btn-default btn" + size + "' data-wysihtml5-command='underline' title='CTRL+U' tabindex='-1'><i class='fa fa-underline'></i></a>" +
				// "<a class='btn btn-default btn" + size + "' data-wysihtml5-command='underline' title='CTRL+U' tabindex='-1'>" + locale.emphasis.underline + "</a>" +
			  "</div>" +
			"</li>";
		},

		"lists": function(locale, options) {
			var size = (options && options.size) ? ' btn-'+options.size : '';
			return "<li>" +
			  "<div class='btn-group'>" +
				"<a class='btn btn-default btn" + size + "' data-wysihtml5-command='insertUnorderedList' title='" + locale.lists.unordered + "' tabindex='-1'><i class='fa fa-list-ul'></i></a>" +
				"<a class='btn btn-default btn" + size + "' data-wysihtml5-command='insertOrderedList' title='" + locale.lists.ordered + "' tabindex='-1'><i class='fa fa-list-ol'></i></a>" +
				"<a class='btn btn-default btn" + size + "' data-wysihtml5-command='Outdent' title='" + locale.lists.outdent + "' tabindex='-1'><i class='fa fa-outdent'></i></a>" +
				"<a class='btn btn-default btn" + size + "' data-wysihtml5-command='Indent' title='" + locale.lists.indent + "' tabindex='-1'><i class='fa fa-indent'></i></a>" +
			  "</div>" +
			"</li>";
		},

		"justify": function(locale, options) {
			var size = (options && options.size) ? ' btn-'+options.size : '';
			return "<li>" +
			  "<div class='btn-group'>" +
				"<a class='btn btn-default btn" + size + "' data-wysihtml5-command='justifyLeft' tabindex='-1'><i class='fa fa-align-left'></i></a>" +
				"<a class='btn btn-default btn" + size + "' data-wysihtml5-command='justifyCenter' tabindex='-1'><i class='fa fa-align-center'></i></a>" +
				"<a class='btn btn-default btn" + size + "' data-wysihtml5-command='justifyRight' title='CTRL+U' tabindex='-1'><i class='fa fa-align-right'></i></a>" +
			  "</div>" +
			"</li>";
		},

		"link": function(locale, options) {
			var size = (options && options.size) ? ' btn-'+options.size : '';
			return "<li>" +
			  "<div class='bootstrap-wysihtml5-insert-link-modal modal fade'>" +
				"<div class='modal-dialog'>" +
				  "<div class='modal-content'>" +
					"<div class='modal-header'>" +
					  "<a class='close' data-dismiss='modal'>&times;</a>" +
					  "<h3 class='modal-title'>" + locale.link.insert + "</h3>" +
					"</div>" +
					"<div class='modal-body'>" +
					  "<input value='http://' class='bootstrap-wysihtml5-insert-link-url form-control'>" +
					  "<label class='checkbox'> <input type='checkbox' class='bootstrap-wysihtml5-insert-link-target' checked>" + locale.link.target + "</label>" +
					"</div>" +
					"<div class='modal-footer'>" +
					  "<a href='#' class='btn btn-default' data-dismiss='modal'>" + locale.link.cancel + "</a>" +
					  "<a href='#' class='btn btn-primary' data-dismiss='modal'>" + locale.link.insert + "</a>" +
					"</div>" +
				  "</div>" +
				"</div>" +
			  "</div>" +
			  "<a class='btn btn-default" + size + "' data-wysihtml5-command='createLink' title='" + locale.link.insert + "' tabindex='-1'><i class='fa fa-link'></i></a>" +
			"</li>";
		},

		"image": function(locale, options) {
			var size = (options && options.size) ? ' btn-'+options.size : '';
			return "<li>" +
			  "<div class='bootstrap-wysihtml5-insert-image-modal modal fade'>" +
				"<div class='modal-dialog'>" +
				  "<div class='modal-content'>" +
					"<div class='modal-header'>" +
					  "<a class='close' data-dismiss='modal'>&times;</a>" +
					  "<h3 class='modal-title'>" + locale.image.insert + "</h3>" +
					"</div>" +
					"<div class='modal-body'>" +
					  "<input value='http://' class='bootstrap-wysihtml5-insert-image-url form-control'>" +
					  // "All sorts of HTML for asset manager here..." +
					"</div>" +
					"<div class='modal-footer'>" +
					  "<a href='#' class='btn btn-default' data-dismiss='modal'>" + locale.image.cancel + "</a>" +
					  "<a href='#' class='btn btn-primary' data-dismiss='modal'>" + locale.image.insert + "</a>" +
					"</div>" +
				  "</div>" +
				"</div>" +
			  "</div>" +
			  "<a class='btn btn-default btn" + size + "' data-wysihtml5-command='insertImage' title='" + locale.image.insert + "' tabindex='-1'><i class='fa fa-picture-o'></i></a>" +
			"</li>";
		},

		"html": function(locale, options) {
			var size = (options && options.size) ? ' btn-'+options.size : '';
			return "<li>" +
			  "<div class='btn-group'>" +
				"<a class='btn btn-default btn" + size + "' data-wysihtml5-action='change_view' title='" + locale.html.edit + "' tabindex='-1'><i class='fa fa-code'></i></a>" +
			  "</div>" +
			"</li>";
		},

		"color": function(locale, options) {
			var size = (options && options.size) ? ' btn-'+options.size : '';
			return "<li class='dropdown'>" +
			  "<a class='btn btn-default dropdown-toggle" + size + "' data-toggle='dropdown' href='#' tabindex='-1'>" +
				"<span class='current-color'>" + locale.colours.black + "</span>&nbsp;<b class='caret'></b>" +
			  "</a>" +
			  "<ul class='dropdown-menu'>" +
				"<li><div class='wysihtml5-colors' data-wysihtml5-command-value='black'></div><a class='wysihtml5-colors-title' data-wysihtml5-command='foreColor' data-wysihtml5-command-value='black'>" + locale.colours.black + "</a></li>" +
				"<li><div class='wysihtml5-colors' data-wysihtml5-command-value='silver'></div><a class='wysihtml5-colors-title' data-wysihtml5-command='foreColor' data-wysihtml5-command-value='silver'>" + locale.colours.silver + "</a></li>" +
				"<li><div class='wysihtml5-colors' data-wysihtml5-command-value='gray'></div><a class='wysihtml5-colors-title' data-wysihtml5-command='foreColor' data-wysihtml5-command-value='gray'>" + locale.colours.gray + "</a></li>" +
				"<li><div class='wysihtml5-colors' data-wysihtml5-command-value='maroon'></div><a class='wysihtml5-colors-title' data-wysihtml5-command='foreColor' data-wysihtml5-command-value='maroon'>" + locale.colours.maroon + "</a></li>" +
				"<li><div class='wysihtml5-colors' data-wysihtml5-command-value='red'></div><a class='wysihtml5-colors-title' data-wysihtml5-command='foreColor' data-wysihtml5-command-value='red'>" + locale.colours.red + "</a></li>" +
				"<li><div class='wysihtml5-colors' data-wysihtml5-command-value='purple'></div><a class='wysihtml5-colors-title' data-wysihtml5-command='foreColor' data-wysihtml5-command-value='purple'>" + locale.colours.purple + "</a></li>" +
				"<li><div class='wysihtml5-colors' data-wysihtml5-command-value='green'></div><a class='wysihtml5-colors-title' data-wysihtml5-command='foreColor' data-wysihtml5-command-value='green'>" + locale.colours.green + "</a></li>" +
				"<li><div class='wysihtml5-colors' data-wysihtml5-command-value='olive'></div><a class='wysihtml5-colors-title' data-wysihtml5-command='foreColor' data-wysihtml5-command-value='olive'>" + locale.colours.olive + "</a></li>" +
				"<li><div class='wysihtml5-colors' data-wysihtml5-command-value='navy'></div><a class='wysihtml5-colors-title' data-wysihtml5-command='foreColor' data-wysihtml5-command-value='navy'>" + locale.colours.navy + "</a></li>" +
				"<li><div class='wysihtml5-colors' data-wysihtml5-command-value='blue'></div><a class='wysihtml5-colors-title' data-wysihtml5-command='foreColor' data-wysihtml5-command-value='blue'>" + locale.colours.blue + "</a></li>" +
				"<li><div class='wysihtml5-colors' data-wysihtml5-command-value='orange'></div><a class='wysihtml5-colors-title' data-wysihtml5-command='foreColor' data-wysihtml5-command-value='orange'>" + locale.colours.orange + "</a></li>" +
			  "</ul>" +
			"</li>";
		}
	};

	var templates = function(key, locale, options) {
		return tpl[key](locale, options);
	};


	var Wysihtml5 = function(el, options) {
		this.el = el;
		var toolbarOpts = options || defaultOptions;
		for(var t in toolbarOpts.customTemplates) {
		  tpl[t] = toolbarOpts.customTemplates[t];
		}
		this.toolbar = this.createToolbar(el, toolbarOpts);
		this.editor =  this.createEditor(options);

		window.editor = this.editor;

		$('iframe.wysihtml5-sandbox').each(function(i, el){
			$(el.contentWindow).off('focus.wysihtml5').on({
				'focus.wysihtml5' : function(){
					$('li.dropdown').removeClass('open');
				}
			});
		});
	};

	Wysihtml5.prototype = {

		constructor: Wysihtml5,

		createEditor: function(options) {
			options = options || {};
			
			// Add the toolbar to a clone of the options object so multiple instances
			// of the WYISYWG don't break because "toolbar" is already defined
			options = $.extend(true, {}, options);
			options.toolbar = this.toolbar[0];

			var editor = new wysi.Editor(this.el[0], options);

			if(options && options.events) {
				for(var eventName in options.events) {
					editor.on(eventName, options.events[eventName]);
				}
			}
			return editor;
		},

		createToolbar: function(el, options) {
			var self = this;
			var toolbar = $("<ul/>", {
				'class' : "wysihtml5-toolbar",
				'style': "display:none"
			});
			var culture = options.locale || defaultOptions.locale || "en";
			for(var key in defaultOptions) {
				var value = false;

				if(options[key] !== undefined) {
					if(options[key] === true) {
						value = true;
					}
				} else {
					value = defaultOptions[key];
				}

				if(value === true) {
					toolbar.append(templates(key, locale[culture], options));

					if(key === "html") {
						this.initHtml(toolbar);
					}

					if(key === "link") {
						this.initInsertLink(toolbar);
					}

					if(key === "image") {
						this.initInsertImage(toolbar);
					}
				}
			}

			if(options.toolbar) {
				for(key in options.toolbar) {
					toolbar.append(options.toolbar[key]);
				}
			}

			toolbar.find("a[data-wysihtml5-command='formatBlock']").click(function(e) {
				var target = e.target || e.srcElement;
				var el = $(target);
				self.toolbar.find('.current-font').text(el.html());
			});

			toolbar.find("a[data-wysihtml5-command='foreColor']").click(function(e) {
				var target = e.target || e.srcElement;
				var el = $(target);
				self.toolbar.find('.current-color').text(el.html());
			});

			this.el.before(toolbar);

			return toolbar;
		},

		initHtml: function(toolbar) {
			var changeViewSelector = "a[data-wysihtml5-action='change_view']";
			toolbar.find(changeViewSelector).click(function(e) {
				toolbar.find('a.btn').not(changeViewSelector).toggleClass('disabled');
			});
		},

		initInsertImage: function(toolbar) {
			var self = this;
			var insertImageModal = toolbar.find('.bootstrap-wysihtml5-insert-image-modal');
			var urlInput = insertImageModal.find('.bootstrap-wysihtml5-insert-image-url');
			var insertButton = insertImageModal.find('a.btn-primary');
			var initialValue = urlInput.val();
			var caretBookmark;

			var insertImage = function() {
				var url = urlInput.val();
				urlInput.val(initialValue);
				self.editor.currentView.element.focus();
				if (caretBookmark) {
				  self.editor.composer.selection.setBookmark(caretBookmark);
				  caretBookmark = null;
				}
				// self.editor.composer.commands.exec("insertImage", url);
				self.editor.composer.commands.exec("insertResizeableImage", url);
			};

			urlInput.keypress(function(e) {
				if(e.which == 13) {
					insertImage();
					insertImageModal.modal('hide');
				}
			});

			insertButton.click(insertImage);

			insertImageModal.on('shown', function() {
				urlInput.focus();
			});

			insertImageModal.on('hide', function() {
				self.editor.currentView.element.focus();
			});

			toolbar.find('a[data-wysihtml5-command=insertImage]').click(function() {
				var activeButton = $(this).hasClass("wysihtml5-command-active");

				if (!activeButton) {
					self.editor.currentView.element.focus(false);
					caretBookmark = self.editor.composer.selection.getBookmark();
					insertImageModal.appendTo('body').modal('show');
					insertImageModal.on('click.dismiss.modal', '[data-dismiss="modal"]', function(e) {
						e.stopPropagation();
					});
					return false;
				}
				else {
					return true;
				}
			});
		},

		initInsertLink: function(toolbar) {
			var self = this;
			var insertLinkModal = toolbar.find('.bootstrap-wysihtml5-insert-link-modal');
			var urlInput = insertLinkModal.find('.bootstrap-wysihtml5-insert-link-url');
			var targetInput = insertLinkModal.find('.bootstrap-wysihtml5-insert-link-target');
			var insertButton = insertLinkModal.find('a.btn-primary');
			var initialValue = urlInput.val();
			var caretBookmark;

			var insertLink = function() {
				var url = urlInput.val();
				urlInput.val(initialValue);
				self.editor.currentView.element.focus();
				if (caretBookmark) {
				  self.editor.composer.selection.setBookmark(caretBookmark);
				  caretBookmark = null;
				}

				var newWindow = targetInput.prop("checked");
				self.editor.composer.commands.exec("createLink", {
					'href' : url,
					'target' : (newWindow ? '_blank' : '_self'),
					'rel' : (newWindow ? 'nofollow' : '')
				});
			};
			var pressedEnter = false;

			urlInput.keypress(function(e) {
				if(e.which == 13) {
					insertLink();
					insertLinkModal.modal('hide');
				}
			});

			insertButton.click(insertLink);

			insertLinkModal.on('shown', function() {
				urlInput.focus();
			});

			insertLinkModal.on('hide', function() {
				self.editor.currentView.element.focus();
			});

			toolbar.find('a[data-wysihtml5-command=createLink]').click(function() {
				var activeButton = $(this).hasClass("wysihtml5-command-active");

				if (!activeButton) {
					self.editor.currentView.element.focus(false);
					caretBookmark = self.editor.composer.selection.getBookmark();
					insertLinkModal.appendTo('body').modal('show');
					insertLinkModal.on('click.dismiss.modal', '[data-dismiss="modal"]', function(e) {
						e.stopPropagation();
					});
					return false;
				}
				else {
					return true;
				}
			});
		}
	};

	// these define our public api
	var methods = {
		resetDefaults: function() {
			$.fn.wysihtml5.defaultOptions = $.extend(true, {}, $.fn.wysihtml5.defaultOptionsCache);
		},
		bypassDefaults: function(options) {
			return this.each(function () {
				var $this = $(this);
				$this.data('wysihtml5', new Wysihtml5($this, options));
			});
		},
		shallowExtend: function (options) {
			var settings = $.extend({}, $.fn.wysihtml5.defaultOptions, options || {}, $(this).data());
			var that = this;
			return methods.bypassDefaults.apply(that, [settings]);
		},
		deepExtend: function(options) {
			var settings = $.extend(true, {}, $.fn.wysihtml5.defaultOptions, options || {});
			var that = this;
			return methods.bypassDefaults.apply(that, [settings]);
		},
		init: function(options) {
			var that = this;
			return methods.shallowExtend.apply(that, [options]);
		}
	};

	$.fn.wysihtml5 = function ( method ) {
		if ( methods[method] ) {
			return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
			return methods.init.apply( this, arguments );
		} else {
			$.error( 'Method ' +  method + ' does not exist on jQuery.wysihtml5' );
		}    
	};

	$.fn.wysihtml5.Constructor = Wysihtml5;

	var defaultOptions = $.fn.wysihtml5.defaultOptions = {
		"font-styles": true,
		"color": false,
		"emphasis": true,
		"lists": true,
		"html": false,
		"link": true,
		"image": true,
		"justify": true,
		events: {},
		parserRules: {
			classes: {
				"wysiwyg-color-silver" : 1,
				"wysiwyg-color-gray" : 1,
				"wysiwyg-color-white" : 1,
				"wysiwyg-color-maroon" : 1,
				"wysiwyg-color-red" : 1,
				"wysiwyg-color-purple" : 1,
				"wysiwyg-color-fuchsia" : 1,
				"wysiwyg-color-green" : 1,
				"wysiwyg-color-lime" : 1,
				"wysiwyg-color-olive" : 1,
				"wysiwyg-color-yellow" : 1,
				"wysiwyg-color-navy" : 1,
				"wysiwyg-color-blue" : 1,
				"wysiwyg-color-teal" : 1,
				"wysiwyg-color-aqua" : 1,
				"wysiwyg-color-orange" : 1,
				"wysiwyg-text-align-left": 1,
				"wysiwyg-text-align-center": 1,
				"wysiwyg-text-align-right": 1
			},
			tags: {
				"b":  {},
				"i":  {},
				"br": {},
				"ol": {},
				"ul": {},
				"li": {},
				"h1": {},
				"h2": {},
				"h3": {},
				"h4": {},
				"h5": {},
				"h6": {},
				"blockquote": {},
				"u": 1,
				"img": {
					"allow_attributes": [
						"style"
					],
					"check_attributes": {
						"width": "numbers",
						"alt": "alt",
						"src": "url",
						"height": "numbers",
						"style": "style"
					}
				},
				"a":  {
					check_attributes: {
						'href': "url", // important to avoid XSS
						'target': 'alt',
						'rel': 'alt'
					}
				},
				"span": 1,
				"div": 1,
				// to allow save and edit files with code tag hacks
				"code": 1,
				"pre": 1
			}
		},
		// Two style sheets here. The first is Blackprint's default styles for the classes this editor uses (text alignments, colors, etc.).
		// The second doesn't exist by default (so there won't be any repository conflicts), acts as an override.
		// NOTE: These are the default settings, different style sheets could be passed.
		stylesheets: ["/blackprint/css/content.css", "/css/content.css"],
		locale: "en"
	};

	if (typeof $.fn.wysihtml5.defaultOptionsCache === 'undefined') {
		$.fn.wysihtml5.defaultOptionsCache = $.extend(true, {}, $.fn.wysihtml5.defaultOptions);
	}

	var locale = $.fn.wysihtml5.locale = {
		en: {
			font_styles: {
				normal: "Normal text",
				h1: "Heading 1",
				h2: "Heading 2",
				h3: "Heading 3",
				h4: "Heading 4",
				h5: "Heading 5",
				h6: "Heading 6"
			},
			emphasis: {
				bold: "Bold",
				italic: "Italic",
				underline: "Underline"
			},
			lists: {
				unordered: "Unordered list",
				ordered: "Ordered list",
				outdent: "Outdent",
				indent: "Indent"
			},
			link: {
				insert: "Insert link",
				cancel: "Cancel",
				target: "Open link in new window"
			},
			image: {
				insert: "Insert image",
				cancel: "Cancel"
			},
			html: {
				edit: "Edit HTML"
			},
			colours: {
				black: "Black",
				silver: "Silver",
				gray: "Grey",
				maroon: "Maroon",
				red: "Red",
				purple: "Purple",
				green: "Green",
				olive: "Olive",
				navy: "Navy",
				blue: "Blue",
				orange: "Orange"
			}
		}
	};

}(window.jQuery, window.wysihtml5);