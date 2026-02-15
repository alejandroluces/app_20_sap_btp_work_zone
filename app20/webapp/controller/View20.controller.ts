import Controller from "sap/ui/core/mvc/Controller";
import JSONModel from "sap/ui/model/json/JSONModel";
import MessageBox from "sap/m/MessageBox";
import MessageToast from "sap/m/MessageToast";
import formatter from "../model/formatter";

/**
 * @namespace sap.btp.app20.controller
 */
export default class View20 extends Controller {

    public formatter = formatter;

    /**
     * Controller initialization
     */
    public onInit(): void {
        // Initialize the survey model with default data
        const oSurveyModel = new JSONModel({
            selectedVendor: "",
            vendors: [
                { vendorId: "V001", vendorName: "Proveedor ABC S.A." },
                { vendorId: "V002", vendorName: "Distribuidora XYZ Ltda." },
                { vendorId: "V003", vendorName: "Suministros Global Corp." },
                { vendorId: "V004", vendorName: "Materiales Express SpA" },
                { vendorId: "V005", vendorName: "Comercial Pacific Inc." }
            ],
            answers: {
                question1: 0,
                question2: 0,
                question3: 0,
                question4: 0,
                question5: 0
            },
            comments: "",
            showResults: false,
            averageScore: 0,
            averagePercentage: 0,
            resultState: "None",
            resultMessage: "",
            evaluationDate: new Date(),
            evaluator: "Comprador Demo" // In real scenario, get from user session
        });

        this.getView()?.setModel(oSurveyModel);
    }

    /**
     * Handle vendor selection change
     */
    public onVendorChange(): void {
        const oModel = this.getView()?.getModel() as JSONModel;
        const sVendor = oModel.getProperty("/selectedVendor");
        
        if (sVendor) {
            MessageToast.show(this._getText("vendorSelected"));
        }
    }

    /**
     * Submit survey and calculate results
     */
    public onSubmitSurvey(): void {
        const oModel = this.getView()?.getModel() as JSONModel;
        const sVendor = oModel.getProperty("/selectedVendor");
        const oAnswers = oModel.getProperty("/answers");

        // Validation: Check vendor selected
        if (!sVendor) {
            MessageBox.warning(this._getText("selectVendorWarning"));
            return;
        }

        // Validation: Check all questions answered
        const aAnswers = Object.values(oAnswers);
        const bAllAnswered = aAnswers.every((value: any) => value > 0);

        if (!bAllAnswered) {
            MessageBox.warning(this._getText("answerAllWarning"));
            return;
        }

        // Calculate average score
        const iTotal = aAnswers.reduce((sum: number, val: any) => sum + val, 0);
        const fAverage = iTotal / aAnswers.length;
        const iPercentage = (fAverage / 5) * 100;

        // Determine result state based on average
        let sState = "None";
        let sMessage = "";

        if (fAverage >= 4.5) {
            sState = "Success";
            sMessage = this._getText("excellentPerformance");
        } else if (fAverage >= 3.5) {
            sState = "Success";
            sMessage = this._getText("goodPerformance");
        } else if (fAverage >= 2.5) {
            sState = "Warning";
            sMessage = this._getText("averagePerformance");
        } else {
            sState = "Error";
            sMessage = this._getText("poorPerformance");
        }

        // Update model with results
        oModel.setProperty("/averageScore", fAverage.toFixed(2));
        oModel.setProperty("/averagePercentage", iPercentage);
        oModel.setProperty("/resultState", sState);
        oModel.setProperty("/resultMessage", sMessage);
        oModel.setProperty("/showResults", true);
        oModel.setProperty("/evaluationDate", new Date());

        // Show success message
        MessageBox.success(this._getText("surveySubmitted"), {
            details: this._buildSurveyDetails(oModel),
            styleClass: "sapUiSizeCompact"
        });

        // In real scenario, send data to backend service
        this._simulateBackendCall(oModel);
    }

    /**
     * Reset survey form
     */
    public onResetSurvey(): void {
        MessageBox.confirm(this._getText("confirmReset"), {
            onClose: (sAction: string) => {
                if (sAction === MessageBox.Action.OK) {
                    const oModel = this.getView()?.getModel() as JSONModel;
                    oModel.setProperty("/selectedVendor", "");
                    oModel.setProperty("/answers", {
                        question1: 0,
                        question2: 0,
                        question3: 0,
                        question4: 0,
                        question5: 0
                    });
                    oModel.setProperty("/comments", "");
                    oModel.setProperty("/showResults", false);
                    MessageToast.show(this._getText("surveyReset"));
                }
            }
        });
    }

    /**
     * Build survey details for display
     */
    private _buildSurveyDetails(oModel: JSONModel): string {
        const oData = oModel.getData();
        const sVendorName = oData.vendors.find((v: any) => v.vendorId === oData.selectedVendor)?.vendorName || "";
        
        return `${this._getText("vendor")}: ${sVendorName}\n` +
               `${this._getText("question1")}: ${oData.answers.question1}/5\n` +
               `${this._getText("question2")}: ${oData.answers.question2}/5\n` +
               `${this._getText("question3")}: ${oData.answers.question3}/5\n` +
               `${this._getText("question4")}: ${oData.answers.question4}/5\n` +
               `${this._getText("question5")}: ${oData.answers.question5}/5\n` +
               `${this._getText("averageLabel")}: ${oData.averageScore}/5`;
    }

    /**
     * Simulate backend call to save survey data
     */
    private _simulateBackendCall(oModel: JSONModel): void {
        const oData = oModel.getData();
        const oPayload = {
            vendorId: oData.selectedVendor,
            evaluator: oData.evaluator,
            evaluationDate: oData.evaluationDate,
            scores: oData.answers,
            comments: oData.comments,
            averageScore: oData.averageScore
        };

        // Log to console (in real app, this would be an OData/REST call)
        console.log("Survey Payload (would be sent to backend):", JSON.stringify(oPayload, null, 2));
        
        // Show toast to indicate data would be saved
        MessageToast.show(this._getText("dataSaved"));
    }

    /**
     * Get i18n text
     */
    private _getText(sKey: string): string {
        const oResourceBundle = (this.getView()?.getModel("i18n") as any)?.getResourceBundle();
        return oResourceBundle?.getText(sKey) || sKey;
    }
}
