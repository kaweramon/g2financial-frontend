"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var bill_to_pay_amounts_paid_service_1 = require("./bill-to-pay-amounts-paid.service");
describe('BillToPayAmountsPaidService', function () {
    beforeEach(function () {
        testing_1.TestBed.configureTestingModule({
            providers: [bill_to_pay_amounts_paid_service_1.BillToPayAmountsPaidService]
        });
    });
    it('should ...', testing_1.inject([bill_to_pay_amounts_paid_service_1.BillToPayAmountsPaidService], function (service) {
        expect(service).toBeTruthy();
    }));
});
//# sourceMappingURL=bill-to-pay-amounts-paid.service.spec.js.map