"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var ModalLateBilletComponent = (function () {
    function ModalLateBilletComponent() {
        this.notify = new core_1.EventEmitter();
    }
    ModalLateBilletComponent.prototype.printBillet = function () {
        this.notify.emit({ message: "printBillet" });
    };
    ModalLateBilletComponent.prototype.printBillet80mm = function () {
        this.notify.emit({ message: "printBillet80mm" });
    };
    return ModalLateBilletComponent;
}());
__decorate([
    core_1.Input()
], ModalLateBilletComponent.prototype, "billetShipping", void 0);
__decorate([
    core_1.Input()
], ModalLateBilletComponent.prototype, "modalLateBill", void 0);
__decorate([
    core_1.Input()
], ModalLateBilletComponent.prototype, "codeBar", void 0);
__decorate([
    core_1.Input()
], ModalLateBilletComponent.prototype, "bank", void 0);
__decorate([
    core_1.Output()
], ModalLateBilletComponent.prototype, "notify", void 0);
__decorate([
    core_1.Input()
], ModalLateBilletComponent.prototype, "codeBarFirstGroup", void 0);
__decorate([
    core_1.Input()
], ModalLateBilletComponent.prototype, "codeBarSecondGroup", void 0);
__decorate([
    core_1.Input()
], ModalLateBilletComponent.prototype, "codeBarThirdGroup", void 0);
__decorate([
    core_1.Input()
], ModalLateBilletComponent.prototype, "verifyDigit", void 0);
__decorate([
    core_1.Input()
], ModalLateBilletComponent.prototype, "codeBarFourGroup", void 0);
ModalLateBilletComponent = __decorate([
    core_1.Component({
        selector: 'app-modal-late-billet',
        templateUrl: './modal-late-billet.component.html',
        styleUrls: ['./modal-late-billet.component.css']
    })
], ModalLateBilletComponent);
exports.ModalLateBilletComponent = ModalLateBilletComponent;
//# sourceMappingURL=modal-late-billet.component.js.map