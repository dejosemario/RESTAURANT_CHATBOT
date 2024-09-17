const Customer = require('./customer.js');

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


  sendMessage(customer, message) {
    const timestamp = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
    this.io.to(customer.sessionId).emit('message', { message, timestamp });
  }

  generateMenuList() {
    return this.menu
      .map((item, index) => `${index + 21}. ${item.name} - ${item.price}<br/>`)
      .join('');
  }

  handleUserInput(session, input) {
    const customerKey = User.generateKey(session.customer.username, session.id);
    const customer = Customer.getUser(session.customers[customerKey]);

    switch (customer.currentState) {
      case 'initial':
        this.handleInitialInput(customer, input);
        break;
      case 'ordering':
        this.handleOrderingInput(customer, input);
        break;
      default:
        this.sendMessage(customer, 'An error has occured');
        customer.currentState = 'initial';
        break;
    }

    // Sync and update the user and session objects
    customer.saveUser();
    session.customers[customerKey] = customer;
    session.save();
  }

  handleInitialInput(customer, input) {
    switch (input) {
      case '1':
        const menuList = this.generateMenuList();
        this.sendMessage(customer, `<b>Menu</b><br/>${menuList}`);
        customer.currentState = 'ordering';
        break;

      case '99':
        if (customer.checkoutOrder()) {
          this.sendMessage(customer, `Order placed successfully.`);
        } else {
          this.sendMessage(customer, 'No order to place.');
        }
        break;

      case '98':
        this.sendMessage(
          customer,
          `<b>Order history</b><br/>${customer.getOrderHistory()}`
        );
        break;

      case '97':
        this.sendMessage(
          customer,
          `<b>Current order</b><br/>${customer.getCurrentOrder()}`
        );
        break;

      case '0':
        if (customer.cancelOrder()) {
          this.sendMessage(customer, 'Order canceled.');
        } else {
          this.sendMessage(customer, 'No order to cancel.');
        }
        break;

      default:
        this.sendMessage(customer, 'Invalid option selected');
        this.sendMessage(customer, `${this.initialMessage}`);
        break;
    }
  }

  handleOrderingInput(customer, input) {
    const menuIndex = Number(input) - 21;
    if (menuIndex >= 0 && menuIndex < this.menu.length) {
      customer.addOrder(this.menu[menuIndex]);
      this.sendMessage(
        customer,
        `${this.menu[menuIndex].name} added to your order.`
      );
      this.sendMessage(
        customer,
        'Select <br/> 99 to checkout the order <br/>&nbsp;0 to cancel the order <br/> 00 to go to the main menu'
      );
    } else if (input === '99') {
      if (customer.checkoutOrder()) {
        this.sendMessage(customer, `Order placed successfully.`);
      } else {
        this.sendMessage(customer, 'No order to place.');
      }
    } else if (input === '0') {
      if (customer.cancelOrder) {
        this.sendMessage(customer, 'Order canceled.');
      } else {
        this.sendMessage(customer, 'No order to cancel.');
      }
    } else if (input === '00') {
      customer.currentState = 'initial';
      this.sendMessage(customer, `${this.initialMessage}`);
    } else {
      this.sendMessage(
        customer,
        'Invalid option. Kindly select a valid option.<br/>Select 00 to go to the main menu'
      );
    }
  }
}

module.exports = botMessage;