package com.cognitive.cds.services.cdsresults.model;

import static org.junit.Assert.*;

import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.TimeZone;

import org.junit.Test;

import com.cognitive.cds.invocation.model.InvocationConstants;
import com.google.gson.JsonElement;
import com.google.gson.JsonParser;

public class CDSResultTest {

	@Test
	public void testToJsonString() throws ParseException, IOException{

		String expected = "{\"details\":{\"detail\":\"This is the details for a Simple CDS Result\",\"provenance\":"+
		"\"Generated by unit test\"},\"doneDate\":1443878100000,\"dueDate\":1443964500000,\"generatedBy\":\"UnitTest\",\"id\":"+
		"\"TheArtifactId\",\"pid\":\"The Patient/Subject Id\",\"priority\":50,\"provider\":"+
		"\"AProviderId == The User Id passed on the calling context\",\"title\":"
		+"\"The Title\",\"type\":\"advice\"}";

		CDSResult result = new CDSResult();
		result.getDetails().setDetail("This is the details for a Simple CDS Result");
		result.setId("TheArtifactId");
		result.setPriority(50);
		result.setType(InvocationConstants.ADVICE);
		result.setTitle("The Title");
		result.getDetails().setProvenance("Generated by unit test");
		SimpleDateFormat formatter = new SimpleDateFormat("dd/MM/yyyy/hh:mm:ss");
		formatter.setTimeZone(TimeZone.getTimeZone("GMT"));
		Date doneDate = formatter.parse("3/10/2015/13:15:00");
		result.setDoneDate(doneDate);
		Date dueDate= formatter.parse("4/10/2015/13:15:00");
		result.setDueDate(dueDate);
		result.setGeneratedBy("UnitTest");
		result.setProvider("AProviderId == The User Id passed on the calling context");
		result.setPid("The Patient/Subject Id");
		
		String json  = result.toJsonString();
		JsonParser parser = new JsonParser();
        JsonElement o1 = parser.parse(json);
        JsonElement o2 = parser.parse(expected); 
        assertEquals(o1, o2);
	}

}
