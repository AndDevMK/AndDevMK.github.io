var fuse; // holds our search engine
var fuseIndex;
var searchVisible = false;
var firstRun = true; // allow us to delay loading json data unless search activated
var list = document.getElementById('search_list'); // targets the <ul>
var first = list.firstChild; // first child of search list
var last = list.lastChild; // last child of search list
var maininput = document.getElementById('input_search_key'); // input box for search
var resultsAvailable = false; // Did we get any search results?

// ==========================================
// The main keyboard event listener running the show
//
// document.addEventListener('keydown', function (event) {

//   // CMD-/ to show / hide Search
//   if (event.altKey && event.which === 191) {
//     // Load json search index if first time invoking search
//     // Means we don't load json unless searches are going to happen; keep user payload small unless needed
//     doSearch(event)
//   }

//   // Allow ESC (27) to close search box
//   if (event.keyCode == 27) {
//     if (searchVisible) {
//       document.getElementById("fastSearch").style.visibility = "hidden";
//       document.activeElement.blur();
//       searchVisible = false;
//     }
//   }

//   // DOWN (40) arrow
//   if (event.keyCode == 40) {
//     if (searchVisible && resultsAvailable) {
//       console.log("down");
//       event.preventDefault(); // stop window from scrolling
//       if (document.activeElement == maininput) { first.focus(); } // if the currently focused element is the main input --> focus the first <li>
//       else if (document.activeElement == last) { last.focus(); } // if we're at the bottom, stay there
//       else { document.activeElement.parentElement.nextSibling.firstElementChild.focus(); } // otherwise select the next search result
//     }
//   }

//   // UP (38) arrow
//   if (event.keyCode == 38) {
//     if (searchVisible && resultsAvailable) {
//       event.preventDefault(); // stop window from scrolling
//       if (document.activeElement == maininput) { maininput.focus(); } // If we're in the input box, do nothing
//       else if (document.activeElement == first) { maininput.focus(); } // If we're at the first item, go to input box
//       else { document.activeElement.parentElement.previousSibling.firstElementChild.focus(); } // Otherwise, select the search result above the current active one
//     }
//   }
// });


// ==========================================
// execute search as each character is typed
//

var searchMask = document.getElementById('search_mask');

var openSearch = document.getElementById('open_search');
openSearch.onclick = function (e) {
  doSearch(e);
}

// 手机搜索按钮点击事件
var mobileOpenSearch = document.getElementById('mobile_open_search');
mobileOpenSearch.onclick = function (e) {
  if (Even.slideout) {
    Even.slideout.close();
  }
  // 延迟打开搜索框，不得已办法，因为和主页面样式有冲突，导致卡顿，不是前端开发不知道怎么解决
  setTimeout(() => {
    doSearch(e);
  }, 500);
}


var closeSearch = document.getElementById('close_search');
closeSearch.onclick = function (e) {
  hideSearch();
}

var inputSearchKey = document.getElementById("input_search_key");
inputSearchKey.onkeyup = function (e) {
  executeSearch(this.value);
}

document.querySelector("body").onclick = function (e) {
  if (e.target.tagName === 'BODY' || e.target.tagName === 'DIV') {
    hideSearch()
  }
}

function doSearch(e) {
  e.stopPropagation();
  if (firstRun) {
    loadSearch() // loads our json data and builds fuse.js search index
    firstRun = false // let's never do this again
  }
  // Toggle visibility of search box
  if (!searchVisible) {
    showSearch() // search visible
  }
  else {
    hideSearch()
  }
}

function hideSearch() {
  searchMask.style.visibility = "hidden";
  searchMask.style.display = "none";
  inputSearchKey.blur() // remove focus from search box 
  inputSearchKey.value = "";
  document.getElementById("search_list").innerHTML = "";
  searchVisible = false
}

function showSearch() {
  searchMask.style.visibility = "visible";
  searchMask.style.display = "flex";
  inputSearchKey.focus() // put focus in input box so you can just start typing
  searchVisible = true
}

// ==========================================
// fetch some json without jquery
//
function fetchJSONFile(path, callback) {
  var httpRequest = new XMLHttpRequest();
  httpRequest.onreadystatechange = function () {
    if (httpRequest.readyState === 4) {
      if (httpRequest.status === 200) {
        var data = JSON.parse(httpRequest.responseText);
        if (callback) callback(data);
      }
    }
  };
  httpRequest.open('GET', path);
  httpRequest.send();
}


// ==========================================
// load our search index, only executed once
// on first call of search box (CMD-/)
//
function loadSearch() {
  fetchJSONFile('/index.json', function (data) {

    var options = { // fuse.js options; check fuse.js website for details
      shouldSort: true,
      location: 0,
      distance: 100,
      threshold: 0.4,
      minMatchCharLength: 2,
      keys: [
        'permalink',
        'title',
        'tags',
        'contents'
      ]
    };
    // Create the Fuse index
    fuseIndex = Fuse.createIndex(options.keys, data)
    fuse = new Fuse(data, options, fuseIndex); // build the index from the json file
  });
}


// ==========================================
// using the index we loaded on CMD-/, run 
// a search query (for "term") every time a letter is typed
// in the search box
//
function executeSearch(term) {
  let results = fuse.search(term); // the actual query being run using fuse.js
  // console.log("结果：" + JSON.stringify(results));
  let searchitems = ''; // our results bucket

  if (results.length === 0) { // no results based on what was typed into the input box
    resultsAvailable = false;
    searchitems = '';
  } else { // build our html
    // console.log(results)
    permalinks = [];
    numLimit = 5;
    for (let item in results) { // only show first 5 results
      if (item > numLimit) {
        break;
      }
      if (permalinks.includes(results[item].item.permalink)) {
        continue;
      }

      var title = formatSearch(results[item].item.title, term);
      // var content = results[item].item.contents;
      var content = formatSearch(results[item].item.contents, term);

      searchitems = searchitems + '<li>'
        + '<a href="' + results[item].item.permalink + '" tabindex="0" style="overflow: hidden;text-overflow: ellipsis;display: -webkit-box;-webkit-box-orient: vertical;-webkit-line-clamp: 2;">' + title + '</a>'
        + '<p style="overflow: hidden;text-overflow: ellipsis;display: -webkit-box;-webkit-box-orient: vertical;-webkit-line-clamp: 3; font-size: 16px; color: rgb(138, 138, 138);">' + content + '</p>'
        + '</li>';
      permalinks.push(results[item].item.permalink);
    }
    resultsAvailable = true;
  }

  document.getElementById("search_list").innerHTML = searchitems;
  if (results.length > 0) {
    first = list.firstChild.firstElementChild; // first result container — used for checking against keyboard up/down location
    last = list.lastChild.firstElementChild; // last result container — used for checking against keyboard up/down location
  }
}

function formatSearch(origin, search) {
  return origin.replace(new RegExp(search, 'ig'), function ($1) {
    return `<span span style="background: #16982b; color: #ffffff">${$1}</span>`;
  });
}

