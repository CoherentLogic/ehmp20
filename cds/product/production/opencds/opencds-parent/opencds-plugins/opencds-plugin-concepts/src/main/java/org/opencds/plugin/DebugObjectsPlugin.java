package org.opencds.plugin;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.TreeSet;

import org.opencds.plugin.PluginContext.PostProcessPluginContext;
import org.opencds.plugin.util.VmrUtil;
import org.opencds.vmr.v1_0.internal.EvalTime;
import org.opencds.vmr.v1_0.internal.EvaluatedPerson;
import org.opencds.vmr.v1_0.internal.FocalPersonId;
import org.opencds.vmr.v1_0.internal.ObservationResult;
import org.opencds.vmr.v1_0.internal.datatypes.IVLDate;

public class DebugObjectsPlugin implements PostProcessPlugin {

    private static final String DEBUG_OBJECT = "debug:";
    private static final String DEBUG_NAMED_OBJECTS = "DEBUGNAMEDOBJECTS";
    private static final String EQUALS = "=";

    private static final String DEBUG_OBJECTS_CD = "debugObjects";
    private static final String DEBUG_OBJECTS_DN = "debugObjects found in global memory";

    @Override
    public void execute(PostProcessPluginContext context) {
        Map<String, Object> namedObjects = context.getNamedObjects();

        Set<String> namedObjectsSet = new TreeSet<>();
        for (Map.Entry<String, Object> entry : namedObjects.entrySet()) {
            if (entry.getKey().startsWith(DEBUG_OBJECT)) {
                String name = entry.getKey().replace(DEBUG_OBJECT, "");
                // process from here... see VMRUtil for example usage of the
                // data generated by this code.
                namedObjectsSet.add(name + EQUALS + entry.getValue().toString());
            }
        }
        StringBuilder obsValue = new StringBuilder();
        int size = namedObjectsSet.size();
        int counter = 0;
        for (String namedObject : namedObjectsSet) {
            counter++;
            obsValue.append(namedObject);
            if (counter < size) {
                obsValue.append("|");
            }
        }

        // add to the vMR as an ObservationResult
        IVLDate obsTime = VmrUtil.createObsTime((EvalTime) context.getAllFactLists().get(EvalTime.class).get(0));

        ObservationResult obsResult = VmrUtil.createObservationResult(
                ((EvaluatedPerson) context.getAllFactLists().get(EvaluatedPerson.class).get(0)).getId(), obsTime,
                ((FocalPersonId) context.getAllFactLists().get(FocalPersonId.class).get(0)).getId(),
                DEBUG_NAMED_OBJECTS, DEBUG_OBJECTS_CD, DEBUG_OBJECTS_DN, obsValue.toString());

        Map<String, List<?>> resultFactLists = context.getResultFactLists();
        List<ObservationResult> obsResults = (List<ObservationResult>) resultFactLists.get(ObservationResult.class
                .getSimpleName());
        if (obsResults == null) {
            obsResults = new ArrayList<>();
            resultFactLists.put(ObservationResult.class.getSimpleName(), obsResults);
        }
        obsResults.add(obsResult);
    }
}
