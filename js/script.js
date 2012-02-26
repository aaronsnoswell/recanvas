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
		editor.setValue(getLocalStorageValue("editorText", editor.getValue()));
		
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





