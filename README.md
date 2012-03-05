# RECanvas - Interactive Canvas Prototyping

An interactive canvas prototyping tool, based on one shown off by Brett Victor, see [http://vimeo.com/36579366](http://vimeo.com/36579366).

## Changelog

So the interactive canvas thing is finally live! You can check it out at [http://elucidatedbinary.com/recanvas](http://elucidatedbinary.com/recanvas). I'll be accepting pull requests - feel free to fork and hack away!

## Issues / TODO

 * Name! This project needs a better name (or does it?) mothereffinginteractivecanvas.com has been suggested, other suggestions are welcome. For now, it is called REcanvas, and living on my server ([http://elucidatedbinary.com](http://elucidatedbinary.com)).

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


