class NotificationContext {
    constructor(strategy) {
      this.strategy = strategy;
    }
  
    setStrategy(strategy) {
      this.strategy = strategy;
    }
  
    async send(email, data) {
      return this.strategy.send(email, data);
    }
  }
  
  module.exports = NotificationContext;
  