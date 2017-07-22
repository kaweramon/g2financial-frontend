"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var credit_card_1 = require("./credit-card-payment/credit-card");
var debit_card_1 = require("./debit-card-payment/debit-card");
var recurrent_payment_1 = require("./recurrent-payment/recurrent-payment");
var Payment = (function () {
    function Payment() {
        this.CreditCard = new credit_card_1.CreditCard();
        this.DebitCard = new debit_card_1.DebitCard();
        this.RecurrentPayment = new recurrent_payment_1.RecurrentPayment();
    }
    return Payment;
}());
exports.Payment = Payment;
//# sourceMappingURL=payment.js.map