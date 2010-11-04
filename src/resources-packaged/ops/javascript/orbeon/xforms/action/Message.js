/**
 * Copyright (C) 2010 Orbeon, Inc.
 *
 * This program is free software; you can redistribute it and/or modify it under the terms of the
 * GNU Lesser General Public License as published by the Free Software Foundation; either version
 * 2.1 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU Lesser General Public License for more details.
 *
 * The full text of the license is available at http://www.gnu.org/copyleft/lesser.html
 */

(function() {

    var OD = ORBEON.util.Dom;
    var YD = YAHOO.util.Dom;
    var Event = YAHOO.util.Event;

    ORBEON.xforms.action.Message = {

        _messageQueue: [],
        _messageDialog: null,

        clinit: function() {
            YAHOO.util.Event.onDOMReady(function() {
                // Prevent SimpleDialog from registering itself on the form
                YAHOO.widget.SimpleDialog.prototype.registerForm = function() {};
                // Create one single instance of the YUI dialog used for xforms:message
                this._messageDialog = new YAHOO.widget.SimpleDialog("xforms-message-dialog", {
                    width: "30em",
                    fixedcenter: true,
                    modal: true,
                    close: false,
                    visible: false,
                    draggable: false,
                    buttons: [{
                        text: "Close",
                        handler: {
                            fn: function() {
                                this._messageDialog.hide();
                                this._messageQueue.shift();
                                if (this._messageQueue.length > 0) this._showMessage();
                            },
                            scope: this
                        },
                        isDefault: false
                    }]
                });
                this._messageDialog.setHeader("Message");
                this._messageDialog.render(document.body);

                // Add ARIA attributes
                var dialogDiv = OD.get("xforms-message-dialog");
                var bodyDiv = YD.getElementsByClassName("bd", null, dialogDiv)[0];
                bodyDiv.setAttribute("aria-live", "polite");
                bodyDiv.setAttribute("role", "alert");
            }, this, true);
        },

        _showMessage: function() {
            this._messageDialog.setBody(this._messageQueue[0]);
            this._messageDialog.show();
        },

        /**
         * Gives an number of messages to show, which will be shown as soon as possible. This is typically called
         * when the page is first loaded to show messages for xforms:message actions that ran before the HTML
         * was sent to the client.
         *
         * @param {Array.<string>} messages
         */
        showMessages: function(messages) {
            _.each(messages, function(message) { this._messageQueue.push(message); }, this);
            Event.onAvailable("xforms-message-dialog", this._showMessage, this, true);
        },

        execute: function(element) {
            if (OD.getAttribute(element, "level") == "modal") {
                var message = OD.getStringValue(element);
                this._messageQueue.push(message);
                if (this._messageQueue.length == 1) this._showMessage();
            }
        }
    };

    ORBEON.xforms.action.Message.clinit();
})();