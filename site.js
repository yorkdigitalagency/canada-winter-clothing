/* Winter Clothing Canada — shared page logic.
   Loaded after products.js. Each page defines PAGE_MODE ("home" or "guide")
   and PAGE_SLUGS before this file. Home shows the 6 top picks; guide pages
   show their own subset. Quiz + calculator live on home only, across all 50. */
var TOP6_SLUGS=["antarctic","concord","marquam","expeditionist","granger","frost"];
var GUIDE_PAGE={
"antarctic":"parkas-extreme-cold.html","concord":"parkas-extreme-cold.html",
"marlow-extreme-waterproof-down-parka":"parkas-extreme-cold.html","marquam":"parkas-extreme-cold.html",
"landroamer-ii-parka":"parkas-extreme-cold.html","glacier-ridge-down-jacket":"parkas-extreme-cold.html",
"thunder-bay-ii-down-jacket":"parkas-extreme-cold.html","winter-district-ii-interchange-jacket":"parkas-extreme-cold.html",
"sauvie-sky-quad-parka-ic-jacket":"parkas-extreme-cold.html","cape-ridge-parka":"parkas-extreme-cold.html",
"featherpack-extreme-down-packable-jacket":"parkas-extreme-cold.html","ems-ignite-extreme-down-insulated-jacket":"parkas-extreme-cold.html",
"henry-ii-extreme-down-jacket":"parkas-budget.html","ems-stratus-hooded-packable-down-jacket":"parkas-budget.html",
"water-resistant-down-jacket":"parkas-budget.html","frost-extreme-down-jacket":"parkas-budget.html",
"ems-67-down-jacket":"parkas-budget.html","slope-edge-ii-hooded-jacket":"parkas-budget.html",
"powder-lite-ii-jacket":"parkas-budget.html","hikebound-ii-insulated-jacket":"parkas-budget.html",
"pike-lake-ii-jacket":"parkas-budget.html","heat-sealed-down-jacket":"parkas-budget.html",
"featherweight-extreme-down-hooded-jacket":"parkas-budget.html",
"frost-tech-extreme-down-padded-jacket":"parkas-everyday.html","ems-frost-tech-extreme-down-jacket":"parkas-everyday.html",
"tech-down-heat-sealed-coat":"parkas-everyday.html","barlow-pass-turbodown-ii-jacket":"parkas-everyday.html",
"oak-harbor-ii-insulated-jacket":"parkas-everyday.html","lake-22-ii-down-hooded-jacket":"parkas-everyday.html",
"pike-lake-ii-hooded-jacket":"parkas-everyday.html","corelite-down-hooded-jacket":"parkas-everyday.html",
"labyrinth-loop-ii-hooded-jacket":"parkas-everyday.html","street-heights-parka":"parkas-everyday.html",
"last-tracks-iii-jacket":"parkas-everyday.html",
"expeditionist":"boots.html","granger":"boots.html","frost":"boots.html",
"blizzard-snow-boots":"boots.html","ems-vapour-leather-waterproof-thermal-snow-boots":"boots.html",
"filey-snow-boots":"boots.html","quinn-baffled-snow-boots":"boots.html",
"arctic-thermal-extreme-waterproof-snow-boots":"boots.html","nevis-extreme-thermal-waterproof-snow-boots":"boots.html",
"bergen-waterproof-thermal-snow-boots":"boots.html","park-snow-boots":"boots.html",
"bugaboot-iii-boot":"boots.html","bugaboot-iii-xtm-boot":"boots.html",
"bugaboot-peak-wide":"boots.html","snowtrekker-ii-boot":"boots.html",
"fairbanks-omni-heat-boot-wide":"boots.html"
};
function $(id){return document.getElementById(id);}
function bySlug(slug){for(var i=0;i<PRODUCTS.length;i++){if(PRODUCTS[i].slug===slug)return PRODUCTS[i];}return null;}
function pageProducts(){
  if(PAGE_MODE==="home")return TOP6_SLUGS.map(bySlug);
  return PAGE_SLUGS.map(bySlug);
}
/* Link to a product's detail section: same-page anchor when the detail is on
   this page, otherwise the guide page that carries it. */
function detailLink(p){
  if(PAGE_MODE==="home"&&TOP6_SLUGS.indexOf(p.slug)>-1)return "#d-"+p.slug;
  if(PAGE_MODE==="guide"&&PAGE_SLUGS.indexOf(p.slug)>-1)return "#d-"+p.slug;
  return GUIDE_PAGE[p.slug]+"#d-"+p.slug;
}
function money(n){return "$"+Number(n).toFixed(2);}
function esc(s){return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");}
function savePct(p){return p.was?Math.round((1-p.price/p.was)*100):0;}
function lowestSeen(p){var m=p.history[0].price;for(var i=1;i<p.history.length;i++){if(p.history[i].price<m)m=p.history[i].price;}return m;}
function dropBadge(p){
  if(p.history.length<2)return "";
  var last=p.history[p.history.length-1],prev=p.history[p.history.length-2];
  if(last.price<prev.price){return ' <span class="drop">Price dropped '+money(prev.price-last.price)+' since '+prev.date+'</span>';}
  return "";
}
function priceHtml(p){
  var h='<span class="price">'+money(p.price)+'</span>';
  if(p.was){h+=' <span class="was">'+money(p.was)+'</span> <span class="save">SAVE '+savePct(p)+'%</span>';}
  h+=dropBadge(p);
  return h;
}
function trackLine(p){return '<p class="track">Lowest we have seen: '+money(lowestSeen(p))+' · Checked: '+CHECKED_LABEL+'</p>';}
function picHtml(p,cls){
  if(p.picture){return '<a href="'+detailLink(p)+'"><img class="'+cls+'" src="'+p.picture+'" alt="'+esc(p.alt)+'"></a>';}
  return '<a href="'+detailLink(p)+'"><div class="ph"><b>'+esc(p.name)+'</b><span>Picture coming</span></div></a>';
}
function badgeHtml(p){
  if(!p.badge)return "";
  var cls=p.badge==="Warmest"?"badge warm":"badge";
  return '<span class="'+cls+'">'+esc(p.badge)+'</span>';
}
/* ---------- picks-first summary (guide pages, like GearJunkie/OGL) ---------- */
var ROLE_ORDER=["Top pick","Best value","Budget pick","Warmest"];
function pagePicks(){
  if(PAGE_MODE!=="guide")return [];
  var ps=pageProducts().filter(function(p){return p.badge;});
  ps.sort(function(a,b){return ROLE_ORDER.indexOf(a.badge)-ROLE_ORDER.indexOf(b.badge);});
  return ps;
}
function renderPicks(){
  var el=$("picks");if(!el)return;
  var ps=pagePicks();
  if(!ps.length){el.innerHTML="";return;}
  var h='<h2 class="splithead">Our picks</h2><div class="picks">';
  ps.forEach(function(p){
    h+='<div class="pick">'+picHtml(p,"")+'<div class="b">'+badgeHtml(p)+'<h3>'+esc(p.name)+'</h3><p class="spec">'+esc(p.specLine)+'</p><p>'+priceHtml(p)+'</p><p><a href="'+detailLink(p)+'">Read the details \u2193</a></p></div></div>';
  });
  h+='</div>';
  el.innerHTML=h;
}
/* ---------- wishlist + compare state ---------- */
var wish=[];try{wish=JSON.parse(localStorage.getItem("wcc-wishlist")||"[]");}catch(e){wish=[];}
var cmp=[];
function updateWishCount(){var el=$("wishCount");if(!el)return;el.textContent=wish.length?("\u2665 "+wish.length+" saved"):"";}
function toggleWish(id){var i=wish.indexOf(id);if(i>-1){wish.splice(i,1);}else{wish.push(id);}try{localStorage.setItem("wcc-wishlist",JSON.stringify(wish));}catch(e){}updateWishCount();renderCards();}
function toggleCmp(id){
  var i=cmp.indexOf(id);
  if(i>-1){cmp.splice(i,1);}
  else{if(cmp.length>=3){alert("Pick up to 3 products to compare.");return;}cmp.push(id);}
  renderCards();renderCmpTray();
}
function clearCmp(){cmp=[];renderCards();renderCmpTray();}
/* ---------- filtering / sorting ---------- */
var maxPrice=550;
var coldReq=null;
function visibleProducts(){
  var qEl=$("search"),q=qEl?qEl.value.toLowerCase().trim():"";
  var sortEl=$("sort"),s=sortEl?sortEl.value:"featured";
  var list=pageProducts().filter(function(p){
    var okQ=!q||(p.name+" "+p.brand).toLowerCase().indexOf(q)>-1;
    var okPrice=p.price<=maxPrice;
    var okCold=coldReq===null||(p.warmthC!==null&&p.warmthC<=coldReq);
    return okQ&&okPrice&&okCold;
  });
  if(s==="price-asc")list.sort(function(a,b){return a.price-b.price;});
  else if(s==="price-desc")list.sort(function(a,b){return b.price-a.price;});
  else if(s==="warmest")list.sort(function(a,b){var x=a.warmthC===null?999:a.warmthC,y=b.warmthC===null?999:b.warmthC;return x-y;});
  else if(s==="discount")list.sort(function(a,b){return savePct(b)-savePct(a);});
  return list;
}
function cardHtml(p){
  var h='<div class="card">';
  h+=picHtml(p,"");
  h+='<div class="b">'+badgeHtml(p)+'<h3>'+esc(p.name)+'</h3>';
  h+='<p class="spec">'+esc(p.specLine)+'</p><p>'+priceHtml(p)+'</p>'+trackLine(p)+'</div>';
  h+='<div class="go"><a href="'+esc(p.url)+'" target="_blank" rel="noopener">View at '+esc(p.retailer)+' \u2192</a>';
  h+='<a class="detail" href="'+detailLink(p)+'">Details \u2193</a>';
  h+='<div class="tools"><button class="'+(wish.indexOf(p.slug)>-1?"saved":"")+'" onclick="toggleWish(\''+p.slug+'\')">'+(wish.indexOf(p.slug)>-1?"\u2665 Saved":"\u2661 Save")+'</button>';
  h+='<button class="'+(cmp.indexOf(p.slug)>-1?"picked":"")+'" onclick="toggleCmp(\''+p.slug+'\')">'+(cmp.indexOf(p.slug)>-1?"\u2713 Comparing":"+ Compare")+'</button></div>';
  h+='</div></div>';
  return h;
}
function renderCards(){
  var grid=$("shop");if(!grid)return;
  var list=visibleProducts();
  var limited=false;
  if(PAGE_MODE==="guide"&&!showAll&&isUnfiltered()&&!isPaged()&&list.length>6){list=list.slice(0,6);limited=true;}
  grid.innerHTML=list.map(cardHtml).join("");
  var cl=$("countLine");
  if(cl){
    if(PAGE_MODE==="home")cl.textContent="Our six top picks.";
    else if(isPaged()&&isUnfiltered())cl.textContent="Showing "+PAGE_RANGE[0]+"\u2013"+PAGE_RANGE[1]+" of 16 boots.";
    else cl.textContent="Showing "+list.length+" of "+pageProducts().length+" products on this page.";
  }
  var sm=$("seeMore");
  if(sm){
    if(limited)sm.innerHTML='<p><button class="btn alt" onclick="toggleSeeMore()">See all '+pageProducts().length+' products</button></p>';
    else if(PAGE_MODE==="guide"&&showAll&&isUnfiltered()&&pageProducts().length>6)sm.innerHTML='<p><button class="btn alt" onclick="toggleSeeMore()">Show fewer</button></p>';
    else sm.innerHTML="";
  }
}
/* GearJunkie-style "See more picks": the grid shows the first 6 until the
   visitor asks for the rest. Filters and search always show all matches. */
var showAll=false;
function isPaged(){return typeof PAGE_PAGED!=="undefined"&&PAGE_PAGED;}
function isUnfiltered(){
  var qEl=$("search"),q=qEl?qEl.value.trim():"";
  return !q&&maxPrice>=550&&coldReq===null;
}
function toggleSeeMore(){showAll=!showAll;renderCards();}
/* ---------- pager (REI/Backcountry pattern: real pages, real links) ---------- */
function renderPager(){
  var el=$("pager");if(!el)return;
  if(typeof PAGE_NUM==="undefined"){el.innerHTML="";return;}
  var h='<div class="pager">';
  if(PAGE_PREV)h+='<a href="'+PAGE_PREV+'">\u2190 Previous</a>';
  for(var i=1;i<=PAGE_TOTAL;i++){
    var url=i===1?"boots.html":"boots-page-"+i+".html";
    h+=i===PAGE_NUM?'<b>'+i+'</b>':'<a href="'+url+'">'+i+'</a>';
  }
  if(PAGE_NEXT)h+='<a href="'+PAGE_NEXT+'">Next \u2192</a>';
  h+='</div>';
  el.innerHTML=h;
}
/* ---------- detail sections ---------- */
function detailHtml(p){
  var h='<section class="box detail" id="d-'+p.slug+'"><div class="pdp">';
  if(p.picture){h+='<img src="'+p.picture+'" alt="'+esc(p.alt)+'">';}
  else{h+='<div class="ph"><b>'+esc(p.name)+'</b><span>Picture coming</span></div>';}
  h+='<div><h3>'+esc(p.name)+'</h3><p class="pdp-price">'+priceHtml(p)+'</p>';
  if(p.rating){h+='<p class="pdp-rate">'+esc(p.rating)+'</p>';}
  h+='<p class="pdp-meta">'+esc(p.metaColours)+' · '+esc(p.metaSizes)+'</p>';
  h+=trackLine(p);
  h+='<p><a class="btn" href="'+esc(p.url)+'" target="_blank" rel="noopener">View at '+esc(p.retailer)+' \u2192</a></p></div></div>';
  h+='<ul>'+p.specs.map(function(s){return '<li>'+esc(s)+'</li>';}).join("")+'</ul>';
  h+='<p class="catch">The catch: '+esc(p.catch)+'</p>';
  if(p.extra){h+='<p>'+esc(p.extra)+'</p>';}
  h+='</section>';
  return h;
}
function renderDetails(){
  var box=$("details");if(!box)return;
  var all=pageProducts();
  var picks=pagePicks();
  var rest=all.filter(function(p){return !p.badge;});
  var h="";
  if(picks.length&&rest.length){
    h+='<h2 class="splithead">Our picks in full</h2>';
    h+=picks.map(detailHtml).join("");
    h+='<h2 class="splithead">The full list</h2>';
    h+=rest.map(detailHtml).join("");
  }else{
    h+=all.map(detailHtml).join("");
  }
  box.innerHTML=h;
}
/* ---------- compare: static table (dual render) ---------- */
function renderCompareTable(){
  var box=$("compareTable");if(!box)return;
  var list=PAGE_MODE==="home"?PRODUCTS:pageProducts();
  var h='<table class="tbl-desktop"><tr><th>Product</th><th>Warmth claim</th><th>Water protection</th><th>Price</th></tr>';
  list.forEach(function(p){
    h+='<tr><td><a href="'+detailLink(p)+'">'+esc(p.name)+'</a></td><td>'+esc(p.warmthText)+'</td><td>'+esc(p.waterText)+'</td><td>'+money(p.price)+'</td></tr>';
  });
  h+='</table>';
  h+='<div class="tbl-mobile">';
  list.forEach(function(p){
    h+='<div class="dcard"><h4><a href="'+detailLink(p)+'">'+esc(p.name)+'</a></h4>'
      +'<div class="dl"><b>Warmth</b><span class="v">'+esc(p.warmthText)+'</span></div>'
      +'<div class="dl"><b>Water protection</b><span class="v">'+esc(p.waterText)+'</span></div>'
      +'<div class="dl"><b>Price</b><span class="v">'+money(p.price)+'</span></div></div>';
  });
  h+='</div>';
  box.innerHTML=h;
}
/* ---------- discounts: sortable, dual render ---------- */
var discSort="pct";
function sortedSale(){
  var sale=PRODUCTS.filter(function(p){return p.was;});
  if(discSort==="saved")sale.sort(function(a,b){return (b.was-b.price)-(a.was-a.price);});
  else if(discSort==="price")sale.sort(function(a,b){return a.price-b.price;});
  else sale.sort(function(a,b){return savePct(b)-savePct(a);});
  return sale;
}
function renderDiscountTable(){
  var box=$("discountTable");if(!box)return;
  var sale=sortedSale();
  var h='<table class="tbl-desktop"><tr><th>Product</th><th>Current price</th><th>Was</th><th>SAVE</th><th>Retailer</th></tr>';
  sale.forEach(function(p){
    h+='<tr><td><a href="'+detailLink(p)+'">'+esc(p.name)+'</a></td><td>'+money(p.price)+'</td><td>'+money(p.was)+'</td><td>'+savePct(p)+'% ('+money(p.was-p.price)+' off)</td><td>'+esc(p.retailer)+'</td></tr>';
  });
  h+='</table>';
  h+='<div class="tbl-mobile">';
  sale.forEach(function(p){
    h+='<div class="dcard"><h4><a href="'+detailLink(p)+'">'+esc(p.name)+'</a></h4>'
      +'<div class="dl"><b>Current price</b><span class="v">'+money(p.price)+'</span></div>'
      +'<div class="dl"><b>Was</b><span class="v">'+money(p.was)+'</span></div>'
      +'<div class="dl"><b>SAVE</b><span class="v">'+savePct(p)+'% ('+money(p.was-p.price)+' off)</span></div>'
      +'<div class="dl"><b>Retailer</b><span class="v">'+esc(p.retailer)+'</span></div></div>';
  });
  h+='</div>';
  box.innerHTML=h;
  document.querySelectorAll("[data-dsort]").forEach(function(b){
    b.classList.toggle("on",b.getAttribute("data-dsort")===discSort);
  });
}
/* ---------- summary strip (home) ---------- */
function renderSummary(){
  var el=$("summaryStrip");if(!el)return;
  var onSale=PRODUCTS.filter(function(p){return p.was;});
  var best=null,bestPct=0;
  onSale.forEach(function(p){var s=savePct(p);if(s>bestPct){bestPct=s;best=p;}});
  el.innerHTML=
    '<b>'+PRODUCTS.length+' products tracked</b> · '+onSale.length+' on sale right now · Biggest saving: <b>'+bestPct+'% ('+money(best.was-best.price)+' off)</b> on '+esc(best.name)+' · Last full check: '+CHECKED_LONG;
}
/* ---------- compare tray: live, dual render ---------- */
function renderCmpTray(){
  var box=$("cmpTray");if(!box)return;
  if(!cmp.length){
    box.innerHTML='<p>No products picked yet — tap “+ Compare” on any card above (up to 3) to see them side by side here.</p><p><a class="btn" href="#shop">Pick products to compare</a></p>';
    return;
  }
  var picked=cmp.map(bySlug);
  var h='<table class="tbl-desktop"><tr><th></th>'+picked.map(function(p){return '<th><a href="'+detailLink(p)+'">'+esc(p.name)+'</a></th>';}).join("")+'</tr>';
  var rows=[["Warmth",function(p){return p.warmthText;}],["Water protection",function(p){return p.waterText;}],["Price",function(p){return money(p.price)+(p.was?" (was "+money(p.was)+")":"");}],["Lowest seen",function(p){return money(lowestSeen(p));}],["Retailer",function(p){return p.retailer;}]];
  rows.forEach(function(r){
    h+='<tr><td><b>'+r[0]+'</b></td>'+picked.map(function(p){return '<td>'+esc(r[1](p))+'</td>';}).join("")+'</tr>';
  });
  h+='</table>';
  h+='<div class="tbl-mobile">';
  picked.forEach(function(p){
    h+='<div class="dcard"><h4><a href="'+detailLink(p)+'">'+esc(p.name)+'</a></h4>'
      +'<div class="dl"><b>Warmth</b><span class="v">'+esc(p.warmthText)+'</span></div>'
      +'<div class="dl"><b>Water protection</b><span class="v">'+esc(p.waterText)+'</span></div>'
      +'<div class="dl"><b>Price</b><span class="v">'+money(p.price)+(p.was?' (was '+money(p.was)+')':'')+'</span></div>'
      +'<div class="dl"><b>Lowest seen</b><span class="v">'+money(lowestSeen(p))+'</span></div>'
      +'<div class="dl"><b>Retailer</b><span class="v">'+esc(p.retailer)+'</span></div></div>';
  });
  h+='</div>';
  h+='<p><button class="btn alt" onclick="clearCmp()">Clear comparison</button> <a class="btn" href="#shop">Back to products</a></p>';
  box.innerHTML=h;
}
/* ---------- calculator options (home) ---------- */
function renderCalcOptions(){
  var el=$("cProduct");if(!el)return;
  el.innerHTML=PRODUCTS.map(function(p){return '<option value="'+p.price+'">'+esc(p.name)+' — '+money(p.price)+'</option>';}).join("");
}
/* ---------- quiz + calculator (home) ---------- */
function quiz(){
  var res=$("quizResult");if(!res)return;
  var cold=$("qCold").value;
  var type=$("qType").value;
  var budget=$("qBudget").value;
  var cat=type==="boots"?"boots":"parka";
  var need=null;
  if(cold==="extreme")need=(type==="boots"?-30:-40);
  else if(cold==="cold")need=-20;
  var pool=PRODUCTS.filter(function(p){return p.category===cat;});
  var cands=need===null?pool.slice():pool.filter(function(p){return p.warmthC!==null&&p.warmthC<=need;});
  if(!cands.length)cands=pool.slice();
  if(budget==="low"){var cheap=cands.filter(function(p){return p.price<200;});if(cheap.length)cands=cheap;}
  cands.sort(function(a,b){return a.price-b.price;});
  var pick=cands[0];
  res.innerHTML='Start here: <a href="'+detailLink(pick)+'">'+esc(pick.name)+'</a> — '+money(pick.price)+', '+esc(pick.warmthText)+' — a suggested starting point, not a guarantee. Check its details and the retailer page before buying.';
}
function calc(){
  var sel=$("cProduct");if(!sel)return;
  var price=parseFloat(sel.value);
  var years=parseInt($("cYears").value,10);
  $("cYearsOut").textContent=years;
  $("calcResult").textContent="$"+price.toFixed(2)+" \u00f7 "+years+" winters = $"+(price/years).toFixed(2)+" per winter.";
}
/* ---------- checked dates (dynamic, so the price updater only touches products.js) ---------- */
function fillCheckedDates(){
  document.querySelectorAll("[data-checked-long]").forEach(function(el){el.textContent=CHECKED_LONG;});
  document.querySelectorAll("[data-checked-label]").forEach(function(el){el.textContent=CHECKED_LABEL;});
}
/* ---------- wire up (only elements present on this page) ---------- */
function wire(id,ev,fn){var el=$(id);if(el)el.addEventListener(ev,fn);}
wire("search","input",renderCards);
document.querySelectorAll("[data-dsort]").forEach(function(b){
  b.addEventListener("click",function(){discSort=b.getAttribute("data-dsort");renderDiscountTable();});
});
wire("sort","change",renderCards);
wire("budget","input",function(){
  maxPrice=parseInt(this.value,10);
  var o=$("budgetOut");if(o)o.textContent=maxPrice>=550?"Any":"$"+maxPrice;
  renderCards();
});
wire("coldSel","change",function(){
  coldReq=this.value==="any"?null:parseInt(this.value,10);
  renderCards();
});
["qCold","qType","qBudget"].forEach(function(id){wire(id,"change",quiz);});
wire("cProduct","change",calc);
wire("cYears","input",calc);
fillCheckedDates();
renderPicks();
renderPager();
renderDetails();
renderCompareTable();
renderDiscountTable();
renderSummary();
renderCmpTray();
renderCalcOptions();
renderCards();
updateWishCount();
quiz();
calc();
