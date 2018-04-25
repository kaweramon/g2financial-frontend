"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var cielo_payment_service_1 = require("./cielo-payment.service");
describe('CieloPaymentService', function () {
    beforeEach(function () {
        testing_1.TestBed.configureTestingModule({
            providers: [cielo_payment_service_1.CieloPaymentService]
        });
    });
    it('should ...', testing_1.inject([cielo_payment_service_1.CieloPaymentService], function (service) {
        expect(service).toBeTruthy();
    }));
});
//# sourceMappingURL=cielo-payment.service.spec.js.map