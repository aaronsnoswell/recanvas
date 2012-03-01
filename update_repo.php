<?php

/** Listen for a WebHook POST and update the repo */
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
	
	// Do a hard reset / pull of the repo
    exec("git reset --hard HEAD");
	exec("git pull");
	
	// Let me know that the site was udpated
	mail("aaronsnoswell@gmail.com", "Recanvas updated", "The site at http://elucidatedbinary.com/recanvas has been udpdated!");
	
} else {
	
	echo "Sorry, this URL only works for POST requests :)";
	
}

?>

