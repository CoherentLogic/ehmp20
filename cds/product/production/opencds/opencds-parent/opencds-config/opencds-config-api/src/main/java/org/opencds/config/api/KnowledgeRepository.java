package org.opencds.config.api;

import org.opencds.config.api.model.PluginId;
import org.opencds.config.api.service.ConceptDeterminationMethodService;
import org.opencds.config.api.service.ConceptService;
import org.opencds.config.api.service.ExecutionEngineService;
import org.opencds.config.api.service.KnowledgeModuleService;
import org.opencds.config.api.service.KnowledgePackageService;
import org.opencds.config.api.service.PluginPackageService;
import org.opencds.config.api.service.SemanticSignifierService;
import org.opencds.config.api.service.SupportingDataPackageService;
import org.opencds.config.api.service.SupportingDataService;
import org.opencds.plugin.PluginDataCache;

public interface KnowledgeRepository {
    ConceptDeterminationMethodService getConceptDeterminationMethodService();
    
    ConceptService getConceptService();
    
    ExecutionEngineService getExecutionEngineService();
    
    KnowledgeModuleService getKnowledgeModuleService();
    
    KnowledgePackageService getKnowledgePackageService();
    
    SemanticSignifierService getSemanticSignifierService();
    
    SupportingDataService getSupportingDataService();

    SupportingDataPackageService getSupportingDataPackageService();

    PluginPackageService getPluginPackageService();
    
    PluginDataCache getPluginDataCache(PluginId pluginId);

}
