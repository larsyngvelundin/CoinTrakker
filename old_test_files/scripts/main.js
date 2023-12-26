document.addEventListener('DOMContentLoaded', (event) => {
    console.log("Ran after DOM was loaded");
    var wallets = document.getElementsByClassName('wallet-div');
    // console.log("This is my wallet elements:", wallets)
    for (var i = 0; i < wallets.length; i++) {
        wallets[i].addEventListener('click', expandTransactions);
    }
});

function expandTransactions(element) {
    walletAddress = element.srcElement.id;
    console.log(walletAddress)
    //get transactions from db
    fetch('/get_transactions_from_address', {
        method: "POST",
        body: JSON.stringify({
            "address": walletAddress
        }),
    })
        .then(response => response.json())
        .then(transactions => {
            for (var i = 0; i < transactions.length; i++) {
                console.log(transactions[i])
                var newElement = document.createElement('div');
                newElement.classList.add("initial-grow")
                newElement.classList.add("wallet-div")

                to_address = transactions[i]['to']
                newElement.id = to_address


                address_short = to_address.substr(1, 4) + "...." + to_address.substr(to_address.length-4, to_address.length-1);
                console.log(address_short)
                newElement.textContent = address_short

                newElement.onclick = expandTransactions;
                document.getElementById('testingdiv').appendChild(newElement);
                removeInitialGrowClass();
            }
        });
};

async function removeInitialGrowClass() {
    await delay(50)
    const elements = document.querySelectorAll('.initial-grow');
    elements.forEach(element => {
        element.classList.remove('initial-grow');
    });
}

function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}