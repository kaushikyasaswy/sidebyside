function addSelect(element) {
	var selected = element.getAttribute("selected");
	var p_to_insert = document.getElementById("selected_options_text");
	var category_name = element.getElementsByTagName('p')[0].innerText;
	
	if (selected == "true") {
		element.setAttribute("selected", "false")
		element.style.opacity = "0.4";
		
		//the current text in the div
		var current_text = p_to_insert.innerHTML;
		current_text = current_text.replace(category_name + ',', '');
		p_to_insert.innerHTML = current_text;

	} else {
		element.setAttribute("selected", "true");
		element.style.opacity = "1.0";
		var current_text = p_to_insert.innerHTML;
		current_text = current_text.concat(category_name, ", ");
		p_to_insert.innerHTML = current_text;
	}
}


function getCategories() {
	var text = "";
	var selected = $("[selected='true']");
	for (var i = 0; i < selected.length; i++) {
		var innerText = selected[i].innerText.trim();
		text = text.concat(innerText,';');
	}
	console.log(text);
}

