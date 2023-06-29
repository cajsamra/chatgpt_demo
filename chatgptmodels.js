//standard models for narration
var chatgpt_models = {
	gpt35turbo: {
	      desc: "Most capable GPT-3.5 model and optimized for chat at 1/10th the cost of text-davinci-003. Will be updated with our latest model iteration 2 weeks after it is released.",
	      model: "gpt-3.5-turbo",
	    },
	gpt35turbo16k: {
	      desc: "Same capabilities as the standard gpt-3.5-turbo model but with 4 times the context.",
	      model: "gpt-3.5-turbo-16k",
	    },
	gpt35turbo0613: {
	      desc: "Snapshot of gpt-3.5-turbo from June 13th 2023 with function calling data. Unlike gpt-3.5-turbo, this model will not receive updates, and will be deprecated 3 months after a new version is released.",
	      model: "gpt-3.5-turbo-0613",
	    },
	textdavinci003: {
	      desc: "Can do any language task with better quality, longer output, and consistent instruction-following than the curie, babbage, or ada models. Also supports some additional features such as inserting text.",
	      model: "text-davinci-003",
	    },
	textdavinci002: {
	      desc: "Similar capabilities to text-davinci-003 but trained with supervised fine-tuning instead of reinforcement learning",
	      model: "text-davinci-002",
	    },
}


var g_selected_model = chatgpt_models.gpt35turbo; //this is the global used by the API to get the config'ed voice object


//create the radio buttons to select the gender and nationality of the model
var radio_cmodel = document.getElementById("chatgpt_models");

var b1 = makeRadioButton('model', 'gpt35turbo', chatgpt_models.gpt35turbo.model + " : " + chatgpt_models.gpt35turbo.desc, true);
radio_cmodel.appendChild(b1);

var b2 = makeRadioButton('model', 'gpt35turbo16k', chatgpt_models.gpt35turbo16k.model + " : " + chatgpt_models.gpt35turbo16k.desc, false);
radio_cmodel.appendChild(b2);

var b3 = makeRadioButton('model', 'gpt35turbo0613', chatgpt_models.gpt35turbo0613.model + " : " + chatgpt_models.gpt35turbo0613.desc, false);
radio_cmodel.appendChild(b3);

var b4 = makeRadioButton('model','textdavinci003', chatgpt_models.textdavinci003.model + " : " + chatgpt_models.textdavinci003.desc, false);
radio_cmodel.appendChild(b4);

var b5 = makeRadioButton('model', 'textdavinci002', chatgpt_models.textdavinci002.model + " : " + chatgpt_models.textdavinci002.desc, false);
radio_cmodel.appendChild(b5);

//add listener for the model choice
var radio_cmodels = document.querySelectorAll('input[type=radio][name="model"]');
radio_cmodels.forEach(radio => radio.addEventListener('change', () => setRadioModelValue(radio.value)));

//sets the selected model global per the clicked model choice    
function setRadioModelValue(modelAbbrev) {

	console.log("chat modelAbbrev selected = " + modelAbbrev);

	switch(modelAbbrev) {
	  case 'gpt35turbo':
	    g_selected_model = chatgpt_models.gpt35turbo;
	    break;
	  case 'gpt35turbo16k':
	    g_selected_model = chatgpt_models.gpt35turbo16k;
	    break;
	  case 'gpt35turbo0613':
	    g_selected_model = chatgpt_models.gpt35turbo0613;
	    break;
	  case 'textdavinci003':
	    g_selected_model = chatgpt_models.textdavinci003;
	    break;
	  case 'textdavinci002':
	    g_selected_model = chatgpt_models.textdavinci002;
	    break;

	  default:
	    g_selected_model = chatgpt_models.gpt35turbo;
	}
}

//generic create radio button div, labels, and radio elements based on the input args
function makeRadioButton(name, value, text, checked) {
  
	var div = document.createElement("div");
	div.className = "radiodiv";

	var label = document.createElement("label");
	label.appendChild(document.createTextNode(text));
	label.className = "radiobutton";

	var radio = document.createElement("input");
	radio.type = "radio";
	radio.name = name;
	radio.value = value;
	
	if ( checked === true ) { radio.setAttribute("checked", "checked"); }
	
	div.appendChild(radio);
	div.appendChild(label);
	
	return div;
}
