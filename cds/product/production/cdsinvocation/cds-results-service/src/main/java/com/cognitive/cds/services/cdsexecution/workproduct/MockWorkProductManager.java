/*
 * COPYRIGHT STATUS: © 2015.  This work, authored by Cognitive Medical Systems
 * employees, was funded in whole or in part by The Department of Veterans
 * Affairs under U.S. Government contract VA118-11-D-1011 / VA118-1011-0013.
 * The copyright holder agrees to post or allow the Government to post all or
 * part of this work in open-source repositories subject to the Apache License,
 * Version 2.0, dated January 2004. All other rights are reserved by the
 * copyright owner.
 *
 * For use outside the Government, the following notice applies:
 *
 *     Copyright 2015 © Cognitive Medical Systems
 *
 *     Licensed under the Apache License, Version 2.0 (the "License"); you may
 *     not use this file except in compliance with the License. You may obtain
 *     a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 *     Unless required by applicable law or agreed to in writing, software
 *     distributed under the License is distributed on an "AS IS" BASIS,
 *     WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *     See the License for the specific language governing permissions and
 *     limitations under the License.
 *
 */

package com.cognitive.cds.services.cdsexecution.workproduct;

import java.io.IOException;

import com.cognitive.cds.invocation.workproduct.model.WorkProduct;
import com.cognitive.cds.invocation.workproduct.model.WorkProductAssignment;

public class MockWorkProductManager implements WorkProductManagementIFace {
	private static final org.slf4j.Logger logger = org.slf4j.LoggerFactory.getLogger(MockWorkProductManager.class);

	/**
	 * A Simple Id Counter
	 */
	private int lastId = 0;
	
	@Override
	public boolean assignWorkProduct(WorkProductAssignment wpa, boolean override){
		// TODO Log the assignment
		return true;
	}

	@Override
	public String storeWorkProduct(WorkProduct wp) {
		// TODO Log the storage
		lastId++;
		wp.setId("MockId"+lastId);
		try {
			logger.info("Store Workproduct = "+wp.toJsonString());
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return wp.getId();
	}

}
