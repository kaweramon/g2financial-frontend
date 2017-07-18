"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var client_service_1 = require("./client.service");
describe('ClientService', function () {
    beforeEach(function () {
        testing_1.TestBed.configureTestingModule({
            providers: [client_service_1.ClientService]
        });
    });
    it('should ...', testing_1.inject([client_service_1.ClientService], function (service) {
        expect(service).toBeTruthy();
    }));
});
//# sourceMappingURL=client.service.spec.js.map