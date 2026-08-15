var q=new URLSearchParams(location.search).get("kind");
var k=(q==="game"||q==="app")?q:"all";
document.querySelectorAll("[data-kind]").forEach(function(el){el.hidden=k!=="all"&&el.getAttribute("data-kind")!==k;});
document.querySelectorAll("[data-filter]").forEach(function(el){if(el.getAttribute("data-filter")===k)el.setAttribute("aria-current","page");else el.removeAttribute("aria-current");});
var n=document.querySelectorAll("[data-kind]:not([hidden])").length;
var e=document.querySelector("[data-empty]");
if(e)e.hidden=n>0;
