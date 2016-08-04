DialogTriggerJS
===============

Some simple Javascript code using jQuery that lets a dialog be triggered based on some user behavior such as a timeout, by scrolling by some amount, or based on exit intent.

This is useful if you want to pop-up something like a newsletter sign-up form in a more intelligent way instead of just doing it instantly.

You can even chain events together, such as requiring the user to scroll down by some amount like 25% of the page, then back up by 10%, etc.

Basic Usage:

var dt = new DialogTrigger(callback, options);

"callback" is the Javascript function that should be called when the trigger behavior is met
"options" consists of a "trigger" and any additional parameters as follows:
   trigger: 'exit_intent'
   Call 'callback' when a user intends to exit (such as moving cursor off page or coming back to the top)
   
   trigger: 'target'
   Call 'callback' when a user reaches a particular target element (set 'target' to the name of the element, such as '#mytarget')
   
   trigger: 'scrollDown'
   Call 'callback' when a user scrolls down by a certain percent from when the object is instantiated (set 'percentDown' to the percentage 0-100)
   
   trigger: 'scrollUp'
   Call 'callback' when a user scrolls up by a certain percent from when the object is instantiated (set 'percentUp' to the percentage 0-100)
   
   trigger: 'timeout'
   Call 'callback' after a certain number of milliseconds have elapsed (set 'timeout' to the desired milliseconds)

Examples:

   function testPopup() {
      alert('Hello there!');
   }
   
   // A trigger based on a timeout of 5 seconds
   var dtTimeout = new DialogTrigger(testPopup, { trigger: 'timeout', timeout: 5000 });
   
   // A trigger based on the user scrolling down to a target element on the page named '#all'
   var dtElement = new DialogTrigger(testPopup, { trigger: 'target', target: '#all' });
   
   // A trigger based on the user scrolling down at least 50% of the page
   var dtScrollDown = new DialogTrigger(testPopup, { trigger: 'scrollDown', percentDown: 50 });
   
   // A trigger based on "exit intent" when the cursor is detected to go above the top of the browser window (useful in desktop scenarios)
   var dtExit = new DialogTrigger(testPopup, { trigger: 'exit_intent' });
   
   // Triggers can also be chained for a sequence of behaviors (such as scroll down by 50%, then up by 10%):
   var dtPercentDown = new DialogTrigger(function() {
      var dtPercentUp = new DialogTrigger(testPopup, { trigger: 'scrollUp', percentUp: 10 });
   }, { trigger: 'scrollDown', percentDown: 50 });
