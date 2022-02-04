(function(){
var cssId = 'legacy-jse7tmw'; 
if (! document.getElementById(cssId)) {
    var head   = document.getElementsByTagName('head')[0];
    var link   = document.createElement('link');
    link.id    = cssId;
    link.rel   = 'stylesheet';
    link.type  = 'text/css';
    link.href  = 'https://typeface.nyt.com/css/jse7tmw.css';
    link.media = 'all';
    head.appendChild(link);
}
document.documentElement.className = document.documentElement.className.replace( 'wf-loading', 'wf-active');
})();
