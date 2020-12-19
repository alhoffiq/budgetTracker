let db, tx, store;

const request = window.indexedDB.open("budgetTracker", 1);

request.onupgradeneeded = function (event) {
    const db = event.target.result;

    db.createObjectStore("newTransaction", {
        autoIncrement: true
    });
};

request.onsuccess = function (event) {
    if (navigator.onLine) {
        getDb();
    }
};

request.onerror = function (e) {
    console.log("There was an error");
};

function getDb (event) {
    db = event.target.result;
    tx = db.transaction("newTransaction", "readwrite");
    store = tx.objectStore("newTransaction");

    const getAll = store.getAll();

    getAll.onsuccess = function () {
        if (getAll.result.length > 0) {
            fetch('/api/transaction/bulk', {
                method: 'POST',
                body: JSON.stringify(getAll.result),
            })
                .then((response) => response.json())
                .then(() => {
                    tx = db.transaction("newTransaction", "readwrite");
                    store = tx.objectStore("newTransaction");

                    store.clear();
                });
        }
    };
}

function saveTransaction(data) {
    tx = db.transaction("newTransaction", "readwrite");
    store = tx.objectStore("newTransaction");

    store.add(data);
}

window.addEventListener('online', getDb);