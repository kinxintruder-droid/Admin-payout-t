const container = document.getElementById('requests');

firebase.firestore().collection('withdrawRequests')
.onSnapshot(snapshot => {
  container.innerHTML = '';
  snapshot.forEach(doc => {
    const data = doc.data();

    const div = document.createElement('div');
    div.innerHTML = `
      <hr>
      User: ${data.userId}<br>
      Amount: R${data.amount}<br>
      Bank: ${data.bankName}<br>
      Account: ****${data.accountNumber.slice(-4)}<br>
      Status: ${data.status}<br>
      <button onclick="markPaid('${doc.id}')">Mark Paid</button>
    `;

    container.appendChild(div);
  });
});

function markPaid(id) {
  firebase.firestore().collection('withdrawRequests')
    .doc(id).update({ status: 'paid' });
}
