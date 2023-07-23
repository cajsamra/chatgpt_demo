// Function to prompt for a folder of files
function promptForFolder() {
  return new Promise((resolve, reject) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = 'true';
    input.webkitdirectory = 'true';
    input.addEventListener('change', (event) => {
      const files = Array.from(event.target.files);
      resolve(files);
    });
    input.click();
  });
}

// Function to read file contents
function readFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const contents = event.target.result;
      resolve(contents);
    };
    reader.onerror = (event) => {
      reject(new Error(`Error reading file ${file.name}: ${event.target.error}`));
    };
    reader.readAsArrayBuffer(file);
  });
}

// Function to extract the body content from a .docx file
async function extractDocxBody(file) {
  const zip = new JSZip();
  const zipData = await zip.loadAsync(file);

  const contentXml = await zipData.file('word/document.xml').async('string');
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(contentXml, 'application/xml');

  const bodyNodes = xmlDoc.getElementsByTagName('w:p');
  let bodyContent = '';
  for (let i = 0; i < bodyNodes.length; i++) {
    const node = bodyNodes[i];
    const textNodes = node.getElementsByTagName('w:t');
    for (let j = 0; j < textNodes.length; j++) {
      const textNode = textNodes[j];
      const text = textNode.textContent;
      bodyContent += text;
    }
    bodyContent += '\n';
  }

  return bodyContent;
}

// Function to call the ChatGPT API - input param is text content
const generate = async (cnts) => {
  
  const resultText = document.getElementById("resultText");

  //console.log('Calling ChatGPT API with content:', cnts);
  console.log('Using ChatGPT API URL:', API_URL);
  console.log('Using ChatGPT model:', g_selected_model.model);
  
  //create the message object
  let msg = [
    {
     role: "system",
     content: ROLE_DESC,
    },
    {
     role: "user",
     content: cnts,
    }
  ];

  const InProgress = document.getElementById("InProgress");
  InProgress.innerText = "ChatGPT is generating your Bio using the " + g_selected_model.model + " model. This may take a minute...";

  try {
    // Fetch the response from the OpenAI API with the signal from AbortController
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: API_KEY,
      },
      body: JSON.stringify({
        model: g_selected_model.model,
        messages: msg,
      }),
    });

    const data = await response.json();
    resultText.innerText = data.choices[0].message.content;
    
    var element = document.getElementById("resultText");
	element.scrollIntoView();

  } catch (error) {
    console.log("Error returned from API Call"); 
    resultText.innerText = "Error occurred while generating your bio. Please try a different model or check your ChatGPT usage rate.";
  }
};


// Main function to handle folder selection and file reading
async function processFolder() {

  const inputText = document.getElementById("inputText");

  try {
    // Prompt for folder selection
    const files = await promptForFolder();

    // Sort files by filename
    files.sort((a, b) => a.name.localeCompare(b.name));

    // Display chosen files as a list
    const fileList = document.getElementById('fileList');
    fileList.innerHTML = ''; // Clear previous list
    files.forEach((file) => {
      const listItem = document.createElement('li');
      listItem.textContent = file.name;
      fileList.appendChild(listItem);
    });

    // Read and concatenate .docx file contents
    let concatenatedContents = '';
    for (const file of files) {
      if (file.name.endsWith('.docx')) {
        const contents = await readFile(file);
        const bodyContent = await extractDocxBody(contents);
        concatenatedContents += bodyContent;
      }
    }

	//add the last part to explain to ChatGPT that you expect a bio...and display what you are sending on the page.
	concatenatedContents += " Please write a detailed bio for me using the above content.";
    inputText.innerText = concatenatedContents;

//	console.log(concatenatedContents);
    var element = document.getElementById("chatButton");
	element.scrollIntoView();
		
	var inputDiv = document.getElementById("Step2");
    inputDiv.style.display = "block";

    // Activate button to call ChatGPT API
    const chatButton = document.getElementById('chatButton');
    chatButton.disabled = false;
    chatButton.addEventListener('click', async () => {
      await generate(concatenatedContents);
	  var resultDiv = document.getElementById("Step3");
	  resultDiv.style.display = "block";
    });
  } catch (error) {
    if (typeof error != "undefined") console.error('Error:', error.message);
	else console.error("error detected during processing of folders");
  }
}

// Call the main function
function mainfolderfileassemble() {
	processFolder();

    // Activate button to call ChatGPT API
    const resetButton = document.getElementById('resetButton');
    resetButton.disabled = false;
    resetButton.addEventListener('click', async () => {
		location.reload(true);
    });

}
