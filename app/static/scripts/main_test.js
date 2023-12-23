document.addEventListener('DOMContentLoaded', (event) => {
    console.log("Test")
    document.getElementById('addnumtest').addEventListener('click', function() {
        fetch('/get_new', {
            method: "POST",
            body: JSON.stringify({
                "data": 1
            }),
        })
            .then(response => response.json())
            .then(data => {
                console.log(data.content)
                var test = JSON.parse(data.content)
                for(var i = 0; i < test.length; i++){
                    var newElement = document.createElement('span');
                    console.log(test, "test in loop")
                    console.log(test, "test in loop")
                    newElement.textContent = test[i];
                    newElement.classList.add("initial-grow")
                    newElement.style.zIndex = globalZ;
                    globalZ -= 1;
                    document.getElementById('testingdiv').appendChild(newElement);
                // const elements = document.querySelectorAll('.initial-grow');
                // elements.forEach(element => {
                //     element.classList.remove('initial-grow');
                //   });
            }
                removeInitialGrowClass();
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    });
});

document.addEventListener('DOMContentLoaded', (event) => {
    console.log("Test")
    document.getElementById('addnumtestmult').addEventListener('click', function() {
        fetch('/get_new')
            .then(response => response.json())
            .then(data => {
                for(var i = 0; i < 5; i++){
                    var newElement = document.createElement('span');
                    newElement.textContent = data.content;
                    newElement.classList.add("initial-grow")
                    newElement.style.zIndex = globalZ;
                    globalZ -= 1;
                    document.getElementById('testingdiv').appendChild(newElement);
                    // const elements = document.querySelectorAll('.initial-grow');
                    // elements.forEach(element => {
                    //     element.classList.remove('initial-grow');
                    //   });
                    removeInitialGrowClass();
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    });
});

document.addEventListener('DOMContentLoaded', (event) => {
    console.log("Test")
    document.getElementById('addnumtestdyn').addEventListener('click', function() {
        fetch('/get_new')
            .then(response => response.json())
            .then(data => {
                var newElement = document.createElement('span');
                newElement.textContent = data.content;
                newElement.classList.add("initial-grow")
                newElement.style.zIndex = globalZ;
                globalZ -= 1;
                document.getElementById('testingdiv').appendChild(newElement);
                // const elements = document.querySelectorAll('.initial-grow');
                // elements.forEach(element => {
                //     element.classList.remove('initial-grow');
                //   });
                function addNewChildElement() {
                    var anotherElement = document.createElement('div'); 
                    anotherElement.textContent = "I'm a new child!"; 
                    anotherElement.classList.add("initial-grow");
                    newElement.appendChild(anotherElement); 
            
                    removeInitialGrowClass();
                }
            
                newElement.onclick = addNewChildElement;
                removeInitialGrowClass();
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    });
});

var globalZ = 1000
console.log("Test")
//add new element with #growing class and set margin
//javscript to increase margin until it reaches max
//remove growing class

function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
  }

//Or even create element with 0 margin and class (class has the margin)
//Javacsript to remove class, and then transition delay does the work of changing the margin slowly

async function removeInitialGrowClass() {
    await delay(100)
    const elements = document.querySelectorAll('.initial-grow');
  
    
    elements.forEach(element => {
      element.classList.remove('initial-grow');
    });
  }



function dynamicAdd() {
    var newElement = document.createElement('span');
    newElement.textContent = data.content;
    newElement.classList.add("initial-grow");
    removeInitialGrowClass();

    function addNewChildElement() {
        var anotherElement = document.createElement('div');
        anotherElement.textContent = "I'm a new child!";
        anotherElement.classList.add("initial-grow");
        newElement.appendChild(anotherElement);

        removeInitialGrowClass();
    }

    newElement.onclick = addNewChildElement;

    document.getElementById('testingdiv').appendChild(newElement);
}