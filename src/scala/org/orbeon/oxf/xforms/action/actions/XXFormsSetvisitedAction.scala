/**
* Copyright (C) 2012 Orbeon, Inc.
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
package org.orbeon.oxf.xforms.action.actions

import org.orbeon.oxf.xforms.action.{DynamicActionContext, XFormsAction}
import org.orbeon.oxf.xforms.control.{Controls, XFormsControl}
import org.orbeon.oxf.xforms.control.Controls.XFormsControlVisitorListener

class XXFormsSetvisitedAction extends XFormsAction {

    override def execute(context: DynamicActionContext) {

        // "This XForms Action begins by invoking the deferred update behavior."
        synchronizeAndRefreshIfNeeded(context)

        // Parameters
        val visited = resolveBooleanAVT(context, "visited", default = true)
        val recurse = resolveBooleanAVT(context, "recurse", default = false)

        // Resolve and update control
        resolveControl(context, "control") foreach (setVisited(_, recurse, visited))
    }

    private def setVisited(control: XFormsControl, recurse: Boolean, visited: Boolean) =
        Controls.visitControls(control, listener = new XFormsControlVisitorListener {
            def startVisitControl(control: XFormsControl) = {
                if (control.isRelevant)
                    control.visited = visited
                true
            }

            def endVisitControl(control: XFormsControl) = ()
        }, includeCurrent = true, recurse = recurse)
}
