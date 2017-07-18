"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var bill_to_pay_service_1 = require("./bill-to-pay.service");
describe('BillToPayService', function () {
    beforeEach(function () {
        testing_1.TestBed.configureTestingModule({
            providers: [bill_to_pay_service_1.BillToPayService]
        });
    });
    it('should ...', testing_1.inject([bill_to_pay_service_1.BillToPayService], function (service) {
        expect(service).toBeTruthy();
    }));
});
//# sourceMappingURL=bill-to-pay.service.spec.js.map