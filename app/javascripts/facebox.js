/*  Facebox for Prototype, version 2.0
 *  By Robert Gaal - http://wakoopa.com 
 *
 *  Heavily based on Facebox by Chris Wanstrath - http://famspam.com/facebox
 *  First ported to Prototype by Phil Burrows - http://blog.philburrows.com
 *  Additional modifications by James Urquhart - http://jamesu.net
 *  Contains code from facybox, Copyright 2009 Mauricio Wolff [ chris@ozmm.org ]
 *
 *  Licensed under the MIT:
 *  http://www.opensource.org/licenses/mit-license.php
 *
 *  Need help?  Join the Google Groups mailing list:
 *  http://groups.google.com/group/facebox/
 *
 *  Dependencies:   prototype & script.aculo.us + images & CSS files from original facebox
 *  Usage:          Append 'rel="facebox"' to an element to call it inside a so-called facebox
 *
 *--------------------------------------------------------------------------*/

var Facebox = Class.create({
  initialize: function() {
    this.preloadImages = [];
    
    $$('#facebox .b:first, #facebox .bl, #facebox .br, #facebox .tl, #facebox .tr, #facebox .loading, #facebox .close').each(function(element) {
      this.preloadImages.push(new Image());
      this.preloadImages.last().src = element.getStyle('background-image').replace(/url\((.+)\)/, '$1');
    }.bind(this));
    
    this.container = $('facebox');
    this.contentHolder = $$('#facebox .content').first();
    this.footer = $$('#facebox .footer').first();
    this.is_image = false;
    
    this.documentEventHandler = this.onDocumentEvent.bindAsEventListener(this);
    
    Event.observe(document, 'keypress', this.documentEventHandler);
    Event.observe(document, 'click', this.documentEventHandler);
    
    Event.observe($$('#facebox .close').first(), 'click', function(e) {
      Event.stop(e);
      this.hide();
    }.bindAsEventListener(this));

	Event.observe($$('#facebox .footer').first(), 'click', function(e) {
	  if (!this.is_image)
	    return false;
      Event.stop(e);
      document.location = this.href;
      this.hide();
    }.bindAsEventListener(this));
  },

  fitContent: function(size) {
	var size = size ? size : this.contentHolder.getDimensions();
	this.footer.setStyle({'width': size.width + 'px', 'height': size.height + 'px'});	
  },
  
  onAnchorClick: function(anchor) {
    this.setLoading();
    this.show();
    this.href = anchor.href;
    
    // support for rel="facebox[.cssclass]" syntax, to add a css class
    var className = anchor.rel.match(/facebox\[\.(\w+)\]/) && RegExp.$1;
    
    if (anchor.href.match(/#/)) {
      var url    = window.location.href.split('#')[0];
      var target = $(anchor.href.replace(url + '#', ''));
      
      // create a new element so as to not delete the original on hide()
      var content = new Element(target.tagName);
      content.innerHTML = target.innerHTML;
      
      this.setContent(content, className);
      this.centralize();
      this.is_image = false;
    } 
    else if (anchor.href.match(/\.(png|jpg|jpeg|gif)$/i)) {
      var image = new Image();
      this.is_image = true;
      image.onload = function() {
        this.setContent('<div class="image"><img src="' + image.src + '" /></div>', className);
        this.centralize();
        this.fitContent({width:image.width, height:image.height});
      }.bind(this);
	  image.src = anchor.href;
    } 
    else {
      this.is_image = false;
      new Ajax.Request(anchor.href, {
        method: 'get',
        onComplete: function(transport) {
          this.setContent(transport.responseText, className);
          this.centralize();
          this.fitContent();
        }.bind(this)
      });
    }
  },
  
  onDocumentEvent: function(e) {
    // hide if ESC is pressed or if there's a click outside of the facebox
    if (e.keyCode == 27 || !Event.element(e).descendantOf(this.container)) {
      this.hide();
    }
  },

  centralize: function() {
	var pageScroll = document.viewport.getScrollOffsets();
	this.container.setStyle({
      'top': pageScroll.top + (document.viewport.getHeight() / 10) + 'px',
      'left': document.viewport.getWidth() / 2 - (this.container.getWidth() / 2) + 'px'
    });	
  },
  
  setLoading: function() {
    if (this.currentClassName) {
      this.contentHolder.removeClassName(this.currentClassName);
      this.currentClassName = null;
    }
    
    this.contentHolder.update('<div class="loading">Loading...</div>');
    this.centralize();
    
    return this;
  },
  
  setContent: function(content, className) {    
    if (className) {
      this.contentHolder.addClassName(className);
      this.currentClassName = className;
    }
    
    this.contentHolder.update(content);
    this.centralize();
    
    this.footer.childElements().invoke('show');
    
    return this;
  },
  
  visible: function() {
    return this.container.visible();
  },
  
  show: function() {
    if (!this.visible()) {
      new Effect.Appear(this.container, { duration: .3 });
    }
    
    return this;
  },
  
  hide: function() {
    if (this.visible()) {
      new Effect.Fade(this.container, { duration: .3 });
    }
    
    return this;
  },
  
  reveal: function(content, className) {
    this.setLoading();
    this.show();
    this.setContent(content, className);
    
    return this;
  }
});

Event.addBehavior({
	"a[rel=facebox]:click": function(e) {
        Event.stop(e);
		window.facebox.onAnchorClick($(this));
	}
});

document.observe('dom:loaded', function() {
  window.facebox = new Facebox();
});

