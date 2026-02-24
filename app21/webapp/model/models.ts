import JSONModel from "sap/ui/model/json/JSONModel";
import Device from "sap/ui/Device";

/**
 * @namespace sap.btp.app21.model
 */

/**
 * Create device model
 */
export function createDeviceModel(): JSONModel {
    const oModel = new JSONModel(Device);
    oModel.setDefaultBindingMode("OneWay");
    return oModel;
}
