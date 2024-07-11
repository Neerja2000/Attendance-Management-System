document.addEventListener('DOMContentLoaded', function () {
  "use strict";

  // Function to handle active class for routerLink
  function setActiveClass(url) {
    var path = url.replace(window.location.protocol + "//" + window.location.host + "/", "");
    document.querySelectorAll("ul#sidebarnav a").forEach(function (el) {
      if (el.getAttribute("href") === url || el.getAttribute("href") === path) {
        el.classList.add("active");
        el.closest("li").classList.add("selected");
        var parent = el.closest("ul#sidebarnav > li > a");
        if (parent) {
          parent.classList.add("active");
          var nextUl = parent.nextElementSibling;
          if (nextUl && nextUl.tagName === "UL") {
            nextUl.classList.add("in");
          }
        }
      }
    });
  }

  // Set initial active class
  setActiveClass(window.location.href);

  // Handle click events for routerLink
  document.querySelectorAll("#sidebarnav a").forEach(function (el) {
    el.addEventListener('click', function (e) {
      e.preventDefault();
      var target = e.currentTarget;

      // Remove active and in classes from all elements
      document.querySelectorAll("ul#sidebarnav .in").forEach(function (ul) {
        ul.classList.remove("in");
      });
      document.querySelectorAll("ul#sidebarnav .active, ul#sidebarnav .selected").forEach(function (a) {
        a.classList.remove("active", "selected");
      });

      // Toggle the active class for the clicked element and its parent elements
      if (!target.classList.contains("active")) {
        target.classList.add("active");
        target.closest("li").classList.add("selected");
        var parent = target.closest("ul#sidebarnav > li > a");
        if (parent) {
          parent.classList.add("active");
          var nextUl = parent.nextElementSibling;
          if (nextUl && nextUl.tagName === "UL") {
            nextUl.classList.add("in");
          }
        }
      } else {
        target.classList.remove("active");
        target.closest("li").classList.remove("selected");
        var parent = target.closest("ul#sidebarnav > li > a");
        if (parent) {
          parent.classList.remove("active");
          var nextUl = parent.nextElementSibling;
          if (nextUl && nextUl.tagName === "UL") {
            nextUl.classList.remove("in");
          }
        }
      }

      // Navigate to the href location using routerLink
      window.location.href = target.getAttribute("href");
    });
  });
});
