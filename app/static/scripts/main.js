document.addEventListener('DOMContentLoaded', (event) => {
    console.log("Ran after DOM was loaded");
    var wallets = document.getElementsByClassName('wallet-div');
    console.log("This is my wallet elements:", wallets)
    for(var i = 0; i < wallets.length; i++){
        wallets[i].addEventListener('click', expandTransactions);
    }
});

function expandTransactions(element){
    walletAddress = element.srcElement.id;
    console.log(walletAddress)
    //get transactions from db
    fetch('/get_transactions_for_address', {
        method: "POST",
        body: JSON.stringify({
            "data": 1
        }),
    })
}