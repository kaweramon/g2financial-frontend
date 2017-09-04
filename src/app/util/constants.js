"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var cielo_payment_1 = require("../financial/bills-to-pay/cielo-payment");
var cielo_payment_cards_1 = require("../financial/bills-to-pay/cielo-payment-cards");
var Constants = (function () {
    function Constants() {
    }
    //  Customer Identity length exceeded
    Constants.getCiloPaymentConverted = function (clientPaymentReturn, cardToken, isForSale) {
        var cieloPayment = new cielo_payment_1.CieloPayment();
        cieloPayment = new cielo_payment_1.CieloPayment();
        cieloPayment.cieloPaymentCards = new cielo_payment_cards_1.CieloPaymentCards();
        cieloPayment.isForSale = isForSale;
        // clientPayment.clientId = this.route.snapshot.params['clientId'];
        cieloPayment.serviceTaxAmount = clientPaymentReturn.Payment.ServiceTaxAmount !== null
            ? clientPaymentReturn.Payment.ServiceTaxAmount : 0.0;
        cieloPayment.installments = clientPaymentReturn.Payment.Installments;
        cieloPayment.interest = clientPaymentReturn.Payment.Interest;
        cieloPayment.capture = clientPaymentReturn.Payment.Capture;
        cieloPayment.recurrent = clientPaymentReturn.Payment.Recurrent;
        cieloPayment.amount = clientPaymentReturn.Payment.Amount;
        cieloPayment.authenticate = clientPaymentReturn.Payment.Authenticate;
        cieloPayment.authorizationCode = clientPaymentReturn.Payment.AuthorizationCode;
        cieloPayment.authenticate = clientPaymentReturn.Payment.Authenticate;
        cieloPayment.recurrent = clientPaymentReturn.Payment.Recurrent;
        //Credit Card
        cieloPayment.cieloPaymentCards.cardToken = cardToken !== undefined ? cardToken : '';
        if (clientPaymentReturn.Payment.CreditCard !== undefined) {
            cieloPayment.cieloPaymentCards.cardNumber = clientPaymentReturn !== null
                ? clientPaymentReturn.Payment.CreditCard.CardNumber : "";
            cieloPayment.cieloPaymentCards.holder = clientPaymentReturn.Payment.CreditCard.Holder;
            cieloPayment.cieloPaymentCards.expirationDate = clientPaymentReturn.Payment.CreditCard.ExpirationDate;
            cieloPayment.cieloPaymentCards.saveCard = clientPaymentReturn.Payment.CreditCard.SaveCard;
            cieloPayment.cieloPaymentCards.brand = clientPaymentReturn.Payment.CreditCard.Brand;
        }
        // Debit Card
        if (clientPaymentReturn.Payment.DebitCard !== undefined) {
            cieloPayment.cieloPaymentCards.cardNumber = clientPaymentReturn !== null
                ? clientPaymentReturn.Payment.DebitCard.CardNumber : "";
            cieloPayment.cieloPaymentCards.holder = clientPaymentReturn.Payment.DebitCard.Holder;
            cieloPayment.cieloPaymentCards.expirationDate = clientPaymentReturn.Payment.DebitCard.ExpirationDate;
            cieloPayment.cieloPaymentCards.saveCard = clientPaymentReturn.Payment.DebitCard.SaveCard;
            cieloPayment.cieloPaymentCards.brand = clientPaymentReturn.Payment.DebitCard.Brand;
        }
        cieloPayment.tid = clientPaymentReturn.Payment.Tid;
        cieloPayment.proofOfSale = clientPaymentReturn.Payment.ProofOfSale;
        cieloPayment.authorizationCode = clientPaymentReturn.Payment.AuthorizationCode;
        cieloPayment.softDescriptor = clientPaymentReturn.Payment.SoftDescriptor;
        cieloPayment.provider = clientPaymentReturn.Payment.Provider;
        cieloPayment.paymentId = clientPaymentReturn.Payment.PaymentId;
        cieloPayment.type = clientPaymentReturn.Payment.Type;
        cieloPayment.amount = clientPaymentReturn.Payment.Amount;
        cieloPayment.currency = clientPaymentReturn.Payment.Currency;
        cieloPayment.country = clientPaymentReturn.Payment.Country;
        cieloPayment.returnCode = clientPaymentReturn.Payment.ReturnCode;
        cieloPayment.returnMessage = clientPaymentReturn.Payment.ReturnMessage;
        cieloPayment.status = clientPaymentReturn.Payment.Status;
        cieloPayment.cieloPaymentCards.type = clientPaymentReturn.Payment.Type;
        return cieloPayment;
    };
    return Constants;
}());
Constants.PAYMENT_SUCCESS = "Pagamento realizado com Sucesso";
Constants.MSG_ERROR_57_CARD_EXPIRED = "Cartão Expirado";
Constants.MSG_ERROR_108_AMOUNT_GREATER_THAN_ZERO = "Valor da transação deve ser maior que “0”";
Constants.MSG_ERROR_117_HOLDER_IS_REQUIRED = "Nome impresso no cartão é obrigatório";
Constants.MSG_ERROR_118_CREDIT_CARD_NUMBER_REQUIRED = "Número do cartão de crédito é obrigatório";
Constants.MSG_ERROR_125_CREDIT_CARD_EXPIRATION_DATE_REQUIRED = "Data de expiração é obrigatória";
Constants.MSG_ERROR_126_CREDIT_CARD_EXPIRATION_DATE_IS_INVALID = "Data de expiração é inválida";
Constants.MSG_ERROR_127_CREDIT_CARD_NUMBER_IS_REQUIRED = "Número do cartão é obrigatório";
Constants.MSG_ERROR_128_CREDIT_CARD_NUMBER_LENGHT_EXCEEDED = "Número do cartão superior a 16 dígitos";
Constants.MSG_ERROR_133_CREDIT_CARD_NUMBER_LENGHT_EXCEEDED = "Fornecedor enviado não existe";
Constants.MSG_ERROR_155_CUSTOMER_NAME_LENGTH_EXCEEDED = "Nome do cliente excede o tamanho máximo";
Constants.MSG_ERROR_156_CUSTOMER_NAME_LENGTH_EXCEEDED = "Identidade do cliente excede o tamanho máximo";
exports.Constants = Constants;
//# sourceMappingURL=constants.js.map