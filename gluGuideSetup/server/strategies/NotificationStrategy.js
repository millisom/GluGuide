class NotificationStrategy {
    async send(email, data){
        throw new Error("send method not implemented in NotificationStrategy");
    }
}
module.exports = NotificationStrategy