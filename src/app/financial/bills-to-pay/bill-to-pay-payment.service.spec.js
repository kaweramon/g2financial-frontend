"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var bill_to_pay_payment_service_1 = require("./bill-to-pay-payment.service");
describe('BillToPayPaymentService', function () {
    beforeEach(function () {
        testing_1.TestBed.configureTestingModule({
            providers: [bill_to_pay_payment_service_1.BillToPayPaymentService]
        });
    });
    it('should ...', testing_1.inject([bill_to_pay_payment_service_1.BillToPayPaymentService], function (service) {
        expect(service).toBeTruthy();
    }));
});
//# sourceMappingURL=bill-to-pay-payment.service.spec.js.map