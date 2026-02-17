// Placeholder wallet data
document.getElementById('walletBalance').textContent='0';
document.getElementById('totalEarnings').textContent='0';
const earningHistory = document.getElementById('earningHistory');
earningHistory.innerHTML='<li>Boosted Video 1 - R10</li><li>Boosted Video 2 - R5</li>';

// Deposit proof upload
function submitProof() {
  const amount = document.getElementById('amount').value;
  const proofFile = document.getElementById('proof').files[0];
  if (!amount || !proofFile) {
    alert('Please enter amount and select proof file.');
    return;
  }

  const reader = new FileReader();
  reader.onload = function(e) {
    firebase.firestore().collection('bankTransfers').add({
      userId: firebase.auth().currentUser.uid,
      amount: amount,
      proof: e.target.result,
      timestamp: Date.now(),
      verified: false
    }).then(() => {
      alert('Proof uploaded. Admin will verify.');
      document.getElementById('amount').value = '';
      document.getElementById('proof').value = '';
    });
  };
  reader.readAsDataURL(proofFile);
}

// Withdrawal request
function requestWithdrawal() {
  const bankName = document.getElementById('bankName').value;
  const accountName = document.getElementById('accountName').value;
  const accountNumber = document.getElementById('accountNumber').value;
  const branchCode = document.getElementById('branchCode').value;
  const amount = document.getElementById('withdrawAmount').value;

  if (!bankName || !accountName || !accountNumber || !branchCode || !amount) {
    alert('Fill all fields');
    return;
  }

  firebase.firestore().collection('withdrawRequests').add({
    userId: firebase.auth().currentUser.uid,
    bankName,
    accountName,
    accountNumber,
    branchCode,
    amount,
    status: 'pending',
    createdAt: Date.now()
  }).then(() => alert('Withdrawal request sent.'));
}
