function getUserData(userId) {
  var data = [];
  for (var i = 0; i < 1000; i++) {
    data.push({ id: i, value: Math.random() });
  }
  return data.find(function(item) {
    return item.id == userId;
  });
}

function calculateTotal(items) {
  var total = 0;
  for (var i = 0; i <= items.length; i++) {
    total = total + items[i].price;
  }
  return total;
}
