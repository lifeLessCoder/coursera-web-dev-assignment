$(function() { // Same as document.addEventListener('DOMContentLoaded', ... );

	// Same as document.querySelector('#navbarToggle').addEventListener('blur', ... );
	$('#navbarToggle').blur(function(event) {
		var screenWidth = window.innerWidth;
		if(screenWidth < 768){
			$('#collapsable-nav').collapse('hide');
		}
	});
});

(function(global) {

	var dc = {};

	var homeHtml = '/snippets/home-snippet.html';
	var allCategoriesUrl = 'http://davids-restaurant.herokuapp.com/categories.json';
	var categoriesTitleHtml = 'snippets/categories-title-snippet.html';
	var categoryHtml = 'snippets/category-snippet.html';

	// Convenience function for inserting innerHtml for 'select'
	var insertHtml = function(selector, html) {
		var targetElement = document.querySelector(selector);
		targetElement.innerHtml = html;
	};

	// Show loading icon inside the element defined by 'selector'
	var showLoading = function(selector) {
		var html = '<div class="text-center">';
		html += '<img src="images/ajax-loader.gif"></div>';
		insertHtml(selector, html);
	};

	// Return the substitute of '{{propName}}'
	// with 'propValue' in the given 'string'
	var insertProperty = function(string, propName, propValue) {
		var propToReplace = '{{' + propName + '}}';
		string = string.replace(new RegExp(propToReplace, 'g'), propValue);
		return string;
	};

	// On page load (before images or css)
	document.addEventListener('DOMContentLoaded', function(event) {

		// On first load, show home view
		showLoading('#main-content');
		$ajaxUtils.sendGetRequest(
			homeHtml,
			function(responseText) {
				document.querySelector('#main-content').innerHTML = responseText;
			},
			false
		);

		// Load the menu categories view
		dc.loadMenuCategories = function() {
			showLoading('#main-content');
			$ajaxUtils.sendGetRequest(allCategoriesUrl, buildAndShowCategoriesHTML);
		};

	});

	// Builds HTML for the categories page based on the data
	// from the server
	function buildAndShowCategoriesHTML(categories) {
		// Load the title snippet of categories page
		$ajaxUtils.sendGetRequest(
			categoriesTitleHtml,
			function(categoriesTitleHtml) {
				// Retrieve the single category snippet
				$ajaxUtils.sendGetRequest(
					categoryHtml,
					function(categoryHtml) {
						var categoriesViewHtml = 
							buildCategoriesViewHTML(categories, categoriesTitleHtml, categoryHtml);
						insertHtml('#main-content', categoriesViewHtml);
					},
					false
				);
			},
			false
		);
	}

	// Using categories data and snippets html
	// build categories view HTML to be inserted into page
	function buildCategoriesViewHTML(categories, categoriesTitleHtml, categoryHtml) {
		var finalHtml = categoriesTitleHtml;
		finalHtml += '<section class=\'row\'>';

		for (var i = 0; i < categories.length; i++) {
			// Insert category values
			var html = categoryHtml;
			var name = "" + categories[i].name;
			var short_name = "" + categories[i].short_name;

			html = insertProperty(html, 'name', name);
			html = insertProperty(html, 'short_name', short_name);

			finalHtml += html;
		}

		finalHtml += '</section>';
		return finalHtml;
	}

	global.$dc = dc;
})(window);
