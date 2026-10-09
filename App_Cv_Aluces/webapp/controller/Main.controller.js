sap.ui.define([
  "sap/ui/core/mvc/Controller", "sap/ui/model/Filter", "sap/ui/model/FilterOperator", "sap/m/MessageToast", "sap/m/library"
], function (Controller, Filter, FilterOperator, MessageToast, mobileLibrary) {
  "use strict";
  return Controller.extend("aluces.cv.controller.Main", {
    onInit: function () {
      this._afterPrint = this._restoreAfterPrint.bind(this);
      window.addEventListener("afterprint", this._afterPrint);
    },
    onExit: function () {
      window.removeEventListener("afterprint", this._afterPrint);
      if (this._printTimer) { window.clearTimeout(this._printTimer); }
    },
    onSearch: function () {
      this._applySearch(this.getOwnerComponent().getModel("state").getProperty("/query"));
    },
    _applySearch: function (query) {
      const binding = this.byId("experienceList").getBinding("items");
      const term = (query || "").trim();
      const fields = ["company", "role", "summary", "details", "area", "period"];
      binding.filter(term ? [new Filter({ filters: fields.map(function (field) {
        return new Filter(field, FilterOperator.Contains, term);
      }), and: false })] : []);
      this.getOwnerComponent().getModel("state").setProperty("/count", binding.getLength());
    },
    onEmail: function () {
      mobileLibrary.URLHelper.triggerEmail(this.getOwnerComponent().getModel("cv").getProperty("/email"), "Contacto profesional · Alejandro Luces");
    },
    onCopyEmail: async function () {
      const email = this.getOwnerComponent().getModel("cv").getProperty("/email");
      try {
        await navigator.clipboard.writeText(email);
        MessageToast.show("Correo copiado");
      } catch (error) {
        MessageToast.show("Puedes seleccionar y copiar el correo que aparece en pantalla.");
      }
    },
    onDownloadCV: function () {
      const link = document.createElement("a");
      link.href = sap.ui.require.toUrl("aluces/cv/documents/CV-Alejandro-Luces.pdf");
      link.download = "CV A.LUCES CL 09.2026.pdf";
      document.body.appendChild(link);
      link.click();
      link.remove();
    },
    onPrint: function () {
      if (this._printSnapshot) { return; }
      // Print the full CV, even when the screen has a search filter or collapsed panels.
      const state = this.getOwnerComponent().getModel("state");
      this._printSnapshot = { query: state.getProperty("/query"), panels: {} };
      this.byId("experienceList").getItems().forEach(function (item) {
        const panel = item.findAggregatedObjects(true, function (control) { return control.isA("sap.m.Panel"); })[0];
        if (panel) { this._printSnapshot.panels[item.getBindingContext("cv").getPath()] = panel.getExpanded(); }
      }, this);
      this._applySearch("");
      this.byId("experienceList").getItems().forEach(function (item) {
        item.findAggregatedObjects(true, function (control) { return control.isA("sap.m.Panel"); }).forEach(function (panel) {
          panel.setExpandAnimation(false);
          panel.setExpanded(true);
        });
      });
      this._printTimer = window.setTimeout(function () { window.print(); }, 250);
    },
    _restoreAfterPrint: function () {
      if (!this._printSnapshot) { return; }
      const snapshot = this._printSnapshot;
      this.byId("experienceList").getItems().forEach(function (item) {
        const expanded = !!snapshot.panels[item.getBindingContext("cv").getPath()];
        item.findAggregatedObjects(true, function (control) { return control.isA("sap.m.Panel"); }).forEach(function (panel) {
          panel.setExpanded(expanded);
          panel.setExpandAnimation(true);
        });
      });
      this._applySearch(snapshot.query);
      this._printSnapshot = null;
    }
  });
});
