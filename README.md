# RECanvas - Interactive Canvas Prototyping

An interactive canvas prototyping tool, based on one shown off by Brett Victor, see [http://vimeo.com/36579366](http://vimeo.com/36579366).

I've also done up a video about this app on YouTube: [http://www.youtube.com/watch?v=DMOIGNjN2ek](http://www.youtube.com/watch?v=DMOIGNjN2ek)

Current features:

 * Live updating of the result as you type
 * Awesome syntax-highlighting and editing thanks to [CodeMirror](http://codemirror.net/)
 * `Ctrl+Space` for auto-complete. Only works for objects defined outside the code pad (eg `Utils.<Ctrl+Space>`) - see the below issue.
 * `Ctrl+o`, `Ctrl+p` will decrement or increment the number under the cursor (sort of, breaks for negative numbers - see the below issue)
 * The codepad will remember the code you typed even if you refershed the page (LocalStorage ftw!)

## Changelog

v0.1 - So the interactive canvas thing is finally live! You can check it out at [http://elucidatedbinary.com/recanvas](http://elucidatedbinary.com/recanvas). I'll be accepting pull requests - feel free to fork and hack away!

## Issues / TODO

I've listed issues I can think of here - some are in **bold**, meaning they should have a higher priority, or are just plain cooler :)

 * Name! This project needs a better name (or does it?) mothereffinginteractivecanvas.com has been suggested, other suggestions are welcome. For now, it is called REcanvas, and living on my server ([http://elucidatedbinary.com](http://elucidatedbinary.com)). Along with this, once we have a name, a logo would be sweet :)

 * Issues for the issues. Need to create github issues for each of these items - that way others can work on them and cross them off :)

 * **Better way of running live js.** At the moment, on every keypress, the user-entered text is eval'd to check for errors, then eval'd again to render to the screen. This is dodgy at best, an utter hack at worst - it also breaks especially hard when the user starts doing things like adding window timeouts (they never get cleared) or DOM event listeners. A ?better? solution would be to have an iframe with a canvas etc in it, then render the js into the frame and let it do it's thing. This is how dabblet, jsfiddle et al work. Thoughts?

 * **Click-to-drag changing of numbers etc.** In Brett Victor's talk, he holds down a key (ctrl) then clicks + drags to change a number in the code pad. Likewise for colors etc. It would be *super* cool to see this functionality added. Similar to the way dabblet shows previews of css values in a pop-up. At the moment pressing Ctrl+o or Ctrl+p will decrement / increment the number currently under the cursor by some relative ammount, but this breaks for negative numbers and is generally hackish. Suggestions / code welcome!

 * **Better auto-completion.** At the moment, pressing Ctrl+Space will show suggestions for the child of an object. (Try `Utils.<Ctrl+Space>`) due to the way this is implemented (using the default codemirror auto-complete feature) this only works for objects defined in the document itself. It would be *amazing* if this auto-complete could work on things like the canvas rendering context (`ctx = canvas.getContext("2d"); ctx.<Ctrl+Space>`). I have no idea how to implement this / how Brett did this.

 * **Better error handling.** At the moment, every time an error is detected, it is simply logged to the console. Perhaps a one-line preview of the error could be shown to the user somewhere on the page?

 * Some way of uploading assets to add to the document. I've played around with adding a sprite png to the html page, then writing a mini-game engine that animates a sprite using this png. It'd be neat if the end user had some way of doing this.

 * A "toggle live update" switch with a sexy padlock / editing icon.

 * A 'refreshing' or 'loading' spinner for the canvas side of the notepad. Sometimes the canvas can take a while to update.

 * Auto-detect when the user is typing quickly then wait for them to finish before updating (this should be an optional feature)

 * Social sharing buttons (twitter, g+, ?facebook?)

 * Learn from Tobias' prior works. Tobias Nurmiranta (https://github.com/tnlogy) beat me to this project and put together a simmilar, but less complete demo. It would be great, if nothing else, to peruse his source code and learn from it. The project is live [here](http://tnlogy.github.com/tnlogy/) and the code is [here](https://github.com/tnlogy/live-coding)

 * HTML5 Build Script breaks. At the moment, the uncompressed, unoptimised version is running on the server - this is because the html5 build script breaks on some of the codemirror javascript. It'd be neat to be able to run all the optimisations etc over things before putting them on the server.

 * More samples. It'd be neat to see more (/cooler) samples in the preset drop down. Or perhaps things should head a different direction, where any user on the live site can create and save public / private presets (like jsfiddle, dabblet etc)? I'm keen to keep as much functionality client-side as possible, but am not opposed to setting up a light Node.js / other server component. Thoughts?

 * Better export to png button. The current one opens the data url in a new window, which requires the user to right click > save file as etc. Anyone know of a neater way to do this?


 * Need a way to automatically update the live version when I pull a change

I tried setting up a PHP script to do this, but the permissions on my (mt) server defeated me. Anyone with any experience with doing this / GitHub webhooks is welcome to comment!

	<?php

	$GIT = "/usr/local/bin/git";

	/** Listen for a WebHook POST and update the repo */
	if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    
	    // Do a hard reset / pull of the repo
		//shell_exec("rm -rf recanvas");
		//shell_exec($GIT . " clone git@github.com:aaronsnoswell/recanvas.git");
	    shell_exec($GIT . " fetch");
	    shell_exec($GIT . " reset --hard origin/master");
    
	    // Let me know that the site was udpated
	    mail("aaronsnoswell@gmail.com", "Recanvas updated", "The site at http://elucidatedbinary.com/recanvas has been udpdated!");
 
	} else {
    
	    echo "Sorry, this URL only works for POST requests :)";
    
	}

	?>


