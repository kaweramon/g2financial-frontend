"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var bank_service_1 = require("./bank.service");
describe('BankService', function () {
    beforeEach(function () {
        testing_1.TestBed.configureTestingModule({
            providers: [bank_service_1.BankService]
        });
    });
    it('should ...', testing_1.inject([bank_service_1.BankService], function (service) {
        expect(service).toBeTruthy();
    }));
});
//# sourceMappingURL=bank.service.spec.js.map