/*global QUnit*/
import Controller from "sap/btp/app20/controller/View20.controller";

QUnit.module("View20 Controller");

QUnit.test("I should test the View20 controller", function (assert: Assert) {
	const oAppController = new Controller("View20");
	oAppController.onInit();
	assert.ok(oAppController);
});