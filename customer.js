const { v4: uuidv4 } = require("uuid");

class Customer {
  constructor(username, sessionId) {
    this.id = uuidv4();
    this.username = username;
    this.sessionId = sessionId;
    this.currentOrder = [];
    this.orderHistory = [];
    this.currentState = "initial";
  }

  addOrder(item) {
    this.currentOrder.push(item);
  }

  checkoutOrder() {
    if (this.currentOrder.length > 0) {
      this.orderHistory.push(...this.currentOrder);
      this.currentOrder = [];
      this.currentState = "initial";
      return true;
    } else {
      return false;
    }
  }

  cancelOrder() {
    if (this.currentOrder.length > 0) {
      this.currentOrder = [];
      this.currentState = "initial";
      return true;
    } else {
      return false;
    }
  }

  getOrderHistory() {
    if (this.orderHistory.length > 0) {
      const history = this.orderHistory
        .map((item) => `${item.name} - ${item.price}`)
        .join("<br/>");
      const totalPrice = this.orderHistory.reduce(
        (total, item) => total + item.price,
        0
      );
      return `${history}<br/><b>Total: ${totalPrice}</b>`;
    } else {
      return "No order history.";
    }
  }

  static getCustomer(sessionData) {
    const customer = new Customer(sessionData.username, sessionData.sessionId);
    customer.id = sessionData.id;
    customer.currentOrder = sessionData.currentOrder;
    customer.orderHistory = sessionData.orderHistory;
    customer.currentState = sessionData.currentState;
    return customer;
  }

  saveCustomer() {
    return {
      id: this.id,
      username: this.username,
      sessionId: this.sessionId,
      currentOrder: this.currentOrder,
      orderHistory: this.orderHistory,
      currentState: this.currentState,
    };
  }

  static generateKey(username, sessionId) {
    return `${username}-${sessionId}`;
  }
}

module.exports = Customer;