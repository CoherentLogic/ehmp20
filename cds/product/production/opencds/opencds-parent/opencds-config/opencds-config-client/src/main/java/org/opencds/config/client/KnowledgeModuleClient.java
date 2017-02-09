package org.opencds.config.client;


public interface KnowledgeModuleClient {
    <T> T getKnowledgeModules(Class<T> clazz);
    
    <T> void putKnowledgeModules(T knowledgeModules);

    <T> void postKnowledgeModule(T knowledgeModule);

    <T> T getKnowledgeModule(String kmId, Class<T> clazz);

    <T> void putKnowledgeModule(String kmId, T knowledgeModule);

    void deleteKnowledgeModule(String kmId);

    <T> T getKnowledgePackage(String kmId, Class<T> clazz);

    <T> void putKnowledgePackage(String kmId, T knowledgePackage);

    void deleteKnowledgePackage(String kmId);

    @Deprecated
    <T> T getSupportingData(String kmId, Class<T> clazz);

    @Deprecated
    <T> void postSupportingData(String kmId, T supportingData);

    @Deprecated
    <T> T getSupportingData(String kmId, String supportingDataId, Class<T> clazz);

    @Deprecated
    <T> void putSupportingData(String kmId, String supportingDataId, T supportingData);

    @Deprecated
    void deleteSupportingData(String kmId, String supportingDataId);

    @Deprecated
    <T> T getSupportingDataPackage(String kmId, String supportingDataId, Class<T> clazz);

    @Deprecated
    <T> void putSupportingDataPackage(String kmId, String supportingDataId, T supportingDataPackage);
    
    @Deprecated
    void deleteSupportingDataPackage(String kmId, String supportingDataId);

}
