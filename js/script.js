/* Author:

*/

;(function(global, $) {
	
	$(document).ready(function() {
		
		// Configure CodeMirror
		var editor = CodeMirror.fromTextArea(document.getElementById("code"), {
			lineNumbers: false,
			indentUnit: 4,
			extraKeys: {
				"Ctrl-Space": function(cm) {
					CodeMirror.simpleHint(cm, CodeMirror.javascriptHint);
				},
				"Ctrl-P": function(cm) {
					var cursor = cm.coordsChar(cm.cursorCoords()),
						token = cm.getTokenAt(cursor),
						val = parseFloat(token.string);
					
					if(isNaN(val)) return;
					var increment = Math.ceil(Math.abs(val) / 30);
					
					var start = {line:cursor.line, ch:token.start},
						stop = {line:cursor.line, ch:token.end};
					
					cm.setSelection(start, stop);
					cm.replaceSelection("" + (val + increment));
				},
				"Ctrl-O": function(cm) {
					var cursor = cm.coordsChar(cm.cursorCoords()),
						token = cm.getTokenAt(cursor),
						val = parseFloat(token.string);
					
					if(isNaN(val)) return;
					var increment = Math.ceil(Math.abs(val) / 30);
					
					var start = {line:cursor.line, ch:token.start},
						stop = {line:cursor.line, ch:token.end};
					
					cm.setSelection(start, stop);
					cm.replaceSelection("" + (val - increment));
				}
			},
			mode: "javascript",
			onChange: function(cm) {
				// Configure the auto-reload feature	
				var text = cm.getValue();
				try {
					//eval(text);
					reset();
					eval(text);
				} catch(e) {
					console.log("Got an error!", e)
				}	
				setLocalStorageValue("editorText", text);
			}
		});
		
		// Try and set the initial text
		var val = getLocalStorageValue("editorText", editor.getValue());
		if(val == "") val = editor.getValue();
		editor.setValue(val);
		
		// Configure the drop down
		$("#preset_opt").change(function() {
			var id = $(this).val();
			
			var text = "";
			if(id != "") {
				// XXX ajs 29/02/12 hacks be here
				text = $("#preset_" + id).html().replace("<![CDATA[", "").replace("]]>", "");
			}
			
			if(text == null) text = "";
			
			editor.setValue(text);
		});
		
		// Configure the export button
		$("#export").click(function() {
			window.open($("#canvas")[0].toDataURL('image/png'));
		});
		
		/**
		 * Destroys and re-creates the canvas
		 */
		function reset() {
			var canvas = $("#canvas")[0],
				parent = canvas.parentNode;

			parent.removeChild(canvas);
			canvas = document.createElement("canvas");
			canvas.id = "canvas";
			parent.appendChild(canvas);
			
			canvas.width = $(canvas).width();
			canvas.height = $(canvas).height();
		}
		
		
		/**
		 * Stores the given key, value pair in localStorage, if it is available
		 */
		function setLocalStorageValue(key, value) {
		    if (Modernizr.localstorage) {
		        try {
		            localStorage.setItem(key, value);
		        } catch (e) {
		            // For some reason we couldn't save the value :(
		            console.log("ERROR | Unable to save to localStorage!", key, value, e);
		        }
		    }
		}

		/**
		 * Gets a value from localStorage
		 * Returns the default if localStorage is unavailable, or there is no
		 * stored value for that key
		 */
		function getLocalStorageValue(key, def) {
		    if (Modernizr.localstorage) {
		        var value = localStorage.getItem(key);
		        if((value == null) || (value == "undefined")) {
		            /* We had a bit of trouble reading the value assumedly
		             * Regardless, try save the value for next time
		             */
		            setLocalStorageValue(key, def);

		            value = def;
		        }
		        return value;
		    }

		    // If localStorage isn't available, return the default
		    return def;
		}

		/**
		 * Clears the given key's value from localStorgage
		 */
		function clearLocalStorageValue(key) {
		    if (Modernizr.localstorage) {
		        try {
		            localStorage.removeItem(key);
		        } catch (e) {
		            // For some reason we couldn't clear the value :S
		            console.log("ERROR | Unable to clear localStorage value!", key, e);
		        }
		    }
		}
		
	});
	
})(this, jQuery);






Utils = new function() {
	
	/**
	 * A pixel data structure
	 */
	this.Pixel = function(r, g, b, a) {
	    this.r = r;
	    this.g = g;
	    this.b = b;
	    this.a = a;
	}

	/**
	 * Mixes an arbitary number of passed Pixel
	 * objects evenly, returning the result as
	 * a new Pixel
	 */
	this.Pixel.blend = function() {
	    var num = arguments.length,
	        r = 0,
	        g = 0,
	        b = 0,
	        a = 0;

	    for(var p in arguments) {
	        var pixel = arguments[p];
	        r += pixel.r;
	        g += pixel.g;
	        b += pixel.b;
	        a += pixel.a;
	    }

	    return new Pixel(r/num, g/num, b/num, a/num);
	}

	/**
	 * Blends two pixels proportionately
	 */
	this.Pixel.blend2 = function(src, tgt, frac) {
	    return new Pixel(
	        this.lerp(src.r, tgt.r, frac),
	        this.lerp(src.g, tgt.g, frac),
	        this.lerp(src.b, tgt.b, frac),
	        this.lerp(src.a, tgt.a, frac)
	    );
	}

	/**
	 * Utility function to loop in 2D
	 */
	this.loopxy = function(w, h, cb) {
	    var run = true;
	    for(var x=0; x<w; x++) {
	        for(var y=0; y<h; y++) {
	            run = cb(x, y);
	            if(run === false) break;
	        }
	        if(run === false) break;
	    }
	}
	
	/**
	 * Utilty method, gets the pixel at the given
	 * x, y coords
	 */
	this.getpix = function(mid, x, y) {
	    var offset = this.getoffset(mid, x, y);
	    return new Pixel(
	        mid.data[offset + 0],
	        mid.data[offset + 1],
	        mid.data[offset + 2],
	        mid.data[offset + 3]
	    );
	}

	/**
	 * Utility method. Blits an rgba pixel to an
	 * ImageData object
	 */
	this.putpix = function(mid, x, y, pix) {
	    var offset = this.getoffset(mid, x, y);
	    mid.data[offset + 0] = pix.r;
	    mid.data[offset + 1] = pix.g;
	    mid.data[offset + 2] = pix.b;
	    mid.data[offset + 3] = pix.a;
	}

	/* Gets the wrapped pixel offset for the given
	 * x-y coordintaes
	 */
	this.getoffset = function(mid, x, y) {
	    x %= mid.width;
	    y %= mid.height;
	    while(x<0) x+= mid.width;
	    while(y<0) y+= mid.height;
	    return (x + y*mid.width)*4;
	}

	/**
	 * Linear interpolant
	 */
	this.lerp = function(a, b, x) {
	    return  a*(1-x) + b*x;
	}

	/**
	 * Utility method to clear the canvas
	 */
	this.clear = function(canvas, ctx) {
	    ctx.clearRect(0, 0, canvas.width, canvas.height);
	}
	
	
	// This is a port of Ken Perlin's Java code
	this.perlin = function(x, y, z) {
		var p = new Array(512)
		var permutation = [151,160,137,91,90,15,
			131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,142,8,99,37,240,21,10,23,
			190, 6,148,247,120,234,75,0,26,197,62,94,252,219,203,117,35,11,32,57,177,33,
			88,237,149,56,87,174,20,125,136,171,168, 68,175,74,165,71,134,139,48,27,166,
			77,146,158,231,83,111,229,122,60,211,133,230,220,105,92,41,55,46,245,40,244,
			102,143,54, 65,25,63,161, 1,216,80,73,209,76,132,187,208, 89,18,169,200,196,
			135,130,116,188,159,86,164,100,109,198,173,186, 3,64,52,217,226,250,124,123,
			5,202,38,147,118,126,255,82,85,212,207,206,59,227,47,16,58,17,182,189,28,42,
			223,183,170,213,119,248,152, 2,44,154,163, 70,221,153,101,155,167, 43,172,9,
			129,22,39,253, 19,98,108,110,79,113,224,232,178,185, 112,104,218,246,97,228,
			251,34,242,193,238,210,144,12,191,179,162,241, 81,51,145,235,249,14,239,107,
			49,192,214, 31,181,199,106,157,184, 84,204,176,115,121,50,45,127, 4,150,254,
			138,236,205,93,222,114,67,29,24,72,243,141,128,195,78,66,215,61,156,180
		];
		for (var i=0; i < 256 ; i++) 
			p[256+i] = p[i] = permutation[i]; 
	
		// FIND UNIT CUBE THAT CONTAINS POINT
		var X = Math.floor(x) & 255,
		    Y = Math.floor(y) & 255,
		    Z = Math.floor(z) & 255;
	
		// FIND RELATIVE X,Y,Z OF POINT IN CUBE
		x -= Math.floor(x);
		y -= Math.floor(y);
		z -= Math.floor(z);
	
		// COMPUTE FADE CURVES FOR EACH OF X,Y,Z
		var    u = fade(x),
		       v = fade(y),
		       w = fade(z);
	
		// HASH COORDINATES OF THE 8 CUBE CORNERS,
		var A = p[X  ]+Y, AA = p[A]+Z, AB = p[A+1]+Z,
		    B = p[X+1]+Y, BA = p[B]+Z, BB = p[B+1]+Z;
	
		// AND ADD BLENDED RESULTS FROM  8 CORNERS OF CUBE
		return scale(lerp(w, lerp(v, lerp(u, grad(p[AA ], x  , y, z),
		                               grad(p[BA  ], x-1, y  , z   )),
		                       lerp(u, grad(p[AB  ], x  , y-1, z   ),
		                               grad(p[BB  ], x-1, y-1, z   ))),
		               lerp(v, lerp(u, grad(p[AA+1], x  , y  , z-1 ),
		                               grad(p[BA+1], x-1, y  , z-1 )),
		                       lerp(u, grad(p[AB+1], x  , y-1, z-1 ),
		                               grad(p[BB+1], x-1, y-1, z-1 )))));
	}
	
	function fade(t) { return t * t * t * (t * (t * 6 - 15) + 10); }
	function lerp( t, a, b) { return a + t * (b - a); }
	function grad(hash, x, y, z) {
		// CONVERT LO 4 BITS OF HASH CODE INTO 12 GRADIENT DIRECTIONS
		var h = hash & 15;
		var u = h<8 ? x : y,
	    	v = h<4 ? y : h==12||h==14 ? x : z;
		return ((h&1) == 0 ? u : -u) + ((h&2) == 0 ? v : -v);
	}
	function scale(n) { return (1 + n)/2; }
}







