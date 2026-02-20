const db = firebase.firestore();

// Approve Deposit
function approveDeposit(depositId, userId, amount) {
  // Update deposit status
  db.collection("bankTransfers").doc(depositId).update({
    status: "approved"
  })
  .then(() => {
    // Increase user balance
    db.collection("users").doc(userId).update({
      balance: firebase.firestore.FieldValue.increment(Number(amount))
    });
    alert("Deposit approved & wallet updated");
  })
  .catch(err => {
    alert("Error approving deposit: " + err.message);
  });
}

// Mark Withdrawal Paid
function markWithdrawalPaid(withdrawId, userId, amount) {
  // Update withdrawal status
  db.collection("withdrawRequests").doc(withdrawId).update({
    status: "paid"
  })
  .then(() => {
    // Decrease user balance
    db.collection("users").doc(userId).update({
      balance: firebase.firestore.FieldValue.increment(-Number(amount))
    });
    alert("Withdrawal paid & balance deducted");
  })
  .catch(err => {
    alert("Error marking withdrawal: " + err.message);
  });
}

// Load all deposits (optional for admin panel)
db.collection("bankTransfers").onSnapshot(snapshot => {
  const depositList = document.getElementById("depositList");
  depositList.innerHTML = "";
  snapshot.forEach(doc => {
    const data = doc.data();
    depositList.innerHTML += `
      <li>
        ${data.userId} - R${data.amount} - ${data.status} 
        <button onclick="approveDeposit('${doc.id}', '${data.userId}', ${data.amount})">
          Approve
        </button>
      </li>
    `;
  });
});

// Load all withdrawals
db.collection("withdrawRequests").onSnapshot(snapshot => {
  const withdrawalList = document.getElementById("withdrawList");
  withdrawalList.innerHTML = "";
  snapshot.forEach(doc => {
    const data = doc.data();
    withdrawalList.innerHTML += `
      <li>
        ${data.userId} - R${data.amount} - ${data.status} 
        <button onclick="markWithdrawalPaid('${doc.id}', '${data.userId}', ${data.amount})">
          Mark Paid
        </button>
      </li>
    `;
  });
});
