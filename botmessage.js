class botMessage {
  constructor(io) {
    this.io = io;
    this.menu = [
      { id: "1", name: "Bitterleaf Soup", price: 2500 },
      { id: "2", name: "Egusi Soup", price: 3000 },
      { id: "3", name: "Okro Soup", price: 2000 },
      { id: "4", name: "Jollof Rice", price: 1500 },
      { id: "5", name: "Fried Rice", price: 2000 },
      { id: "6", name: "White Rice", price: 1000 },
      { id: "7", name: "Pounded Yam", price: 500 },
      { id: "8", name: "Amala", price: 500 },
      { id: "9", name: "Ewedu", price: 500 },
      { id: "10", name: "Semo", price: 500 },
      { id: "11", name: "Eba", price: 500 },
      { id: "12", name: "Beans", price: 500 },
      { id: "13", name: "Yam Porridge", price: 500 },
      { id: "14", name: "Plantain", price: 500 },
    ];
    this.initialMessage = [
      "Select 1 to Place an order",
      "Select 99 to checkout order",
      "Select 98 to see order history",
      "Select 97 to see current order",
      "Select 0 to cancel order",
    ];
  }

  sendMessage(user, message) {
    this.io.emit("chat message", message);
    
  }
}
