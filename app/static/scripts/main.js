document.addEventListener('DOMContentLoaded', (event) => {
    console.log("Test")
    document.getElementById('addnumtest').addEventListener('click', function() {
        fetch('/get_new')
            .then(response => response.json())
            .then(data => {
                var newElement = document.createElement('span');
                newElement.textContent = data.content;

                document.getElementById('testingdiv').appendChild(newElement);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    });
});
console.log("Test")