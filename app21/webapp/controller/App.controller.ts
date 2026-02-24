import Controller from "sap/ui/core/mvc/Controller";

/**
 * @namespace sap.btp.app21.controller
 */
export default class App extends Controller {
    public onInit(): void {
        // apply content density mode to root view
        this.getView()?.addStyleClass(this.getOwnerComponent()?.getContentDensityClass() as string);
    }
}
