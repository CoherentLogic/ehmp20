path = File.expand_path '..', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)
require 'DefaultLogin.rb'

class BuildQuery
  def initialize
    @path = ''
    @number_parameters = 0
  end

  def add_parameter(param, value)
    if @number_parameters == 0
      @path.concat("?")
    else
      @path.concat("&")
    end
    @number_parameters += 1
    @path.concat(param)
    @path.concat("=")
    @path.concat(value)
  end

  def replace_path_var(var, value)
    @path.gsub!(var, value)
  end

  def add_acknowledge(ack)
    add_parameter("_ack", ack)
  end

  def path
    #p URI.encode(@path)
    return URI.encode(@path)
  end
end

class PaginationQuery < BuildQuery
  def initialize
    super()
  end

  def add_start(start)
    add_parameter("start", start)
  end

  def add_limit(limit)
    add_parameter("limit", limit)
  end
end

class RDKQuery < BuildQuery
  def initialize(title)
    super()
    domain_path = RDClass.resourcedirectory_fetch.get_url(title)
    @path.concat(domain_path)
  end
end

class RDKQueryPagination < PaginationQuery
  def initialize(title)
    super()
    domain_path = RDClass.resourcedirectory_fetch.get_url(title)
    @path.concat(domain_path)
  end
end

class RDKQueryPicklist < BuildQuery
  def initialize(title)
    super()
    domain_path = RDClass.resourcedirectory_picklist.get_url(title)
    @path.concat(domain_path)
  end
end

class QueryRDKSync < BuildQuery
  def initialize(command, pid = nil)
    super()

    title = "synchronization-#{command}"
    domain_path = RDClass.resourcedirectory_fetch.get_url(title)
    @path.concat(domain_path)
    add_parameter("pid", pid) unless pid.nil?
  end
end

class RDClass
  @@resourcedirectory_fetch = nil
  @@resourcedirectory_writeback = nil
  @@resourcedirectory_picklist = nil

  def self.resourcedirectory_fetch
    if @@resourcedirectory_fetch.nil?
      p "FIRST TIME: DISCOVER PATHS"
      base_url = DefaultLogin.rdk_fetch_url
      path = "#{base_url}/resource/resourcedirectory"
      p base_url
      @response = HTTParty.get(path)
      @@resourcedirectory_fetch= FetchResourceDirectory.new(JSON.parse(@response.body), base_url)
    end # if
    return @@resourcedirectory_fetch
  end #def self.resourcedirectory_fetch

  def self.resourcedirectory_writeback
    if @@resourcedirectory_writeback.nil?
      p "FIRST TIME: DISCOVER PATHS"
      base_url = DefaultLogin.rdk_writeback_url
      path = "#{base_url}/resource/write-health-data/resourcedirectory"
      p base_url
      @response = HTTParty.get(path)
      @@resourcedirectory_writeback= FetchResourceDirectory.new(JSON.parse(@response.body), base_url)
    end # if
    return @@resourcedirectory_writeback
  end #def self.resourcedirectory_writeback

  def self.resourcedirectory_picklist
    if @@resourcedirectory_picklist.nil?
      p "FIRST TIME: DISCOVER PATHS"
      base_url = DefaultLogin.rdk_picklist_url
      path = "#{base_url}/resource/write-pick-list/resourcedirectory"
      p base_url
      @response = HTTParty.get(path)
      @@resourcedirectory_picklist= FetchResourceDirectory.new(JSON.parse(@response.body), base_url)
    end # if
    return @@resourcedirectory_picklist
  end #def self.resourcedirectory_picklist
end

class QueryRDKDomain < BuildQuery
  # http://127.0.0.1:8888/patientrecord/domain/allergy?pid=1
  def initialize(datatype, pid = nil)
    super()
    title = "patient-record-#{datatype}"
    domain_path = RDClass.resourcedirectory_fetch.get_url(title)

    @path.concat(domain_path)
    @number_parameters = 0
    add_parameter("pid", pid) unless pid.nil?
  end
end

class QueryRDKVisitAPI < BuildQuery
  def initialize(command, pid = nil, fcode = nil)
    super()
    domain_path = RDClass.resourcedirectory_fetch.get_url("visits-#{command}")
    @path.concat(domain_path)
    @number_parameters = 0
    add_parameter("pid", pid) unless pid.nil?
    add_parameter("facility.code", fcode) unless fcode.nil?
  end
end # class

class QueryGenericRDK < BuildQuery
  # http://IP_ADDRESS:PORT/visits/providers
  def initialize(command, pid = nil, action = nil)
    super()
    @number_parameters = 0
    @path = String.new(DefaultLogin.rdk_fetch_url)
    @path.concat("/#{command}")

    unless pid.nil?
      @path.concat("/#{pid}")
    end
    unless action.nil?
      @path.concat("/#{action}")
    end
  end

  def add_parameter(param, value)
    if @number_parameters == 0
      @path.concat("?")
    else
      @path.concat("&")
    end
    @number_parameters += 1
    @path.concat(param)
    @path.concat("=")
    @path.concat(value)
  end

  def add_acknowledge(ack)
    add_parameter("_ack", ack)
  end

  def path
    return @path
  end
end # class

#http://IP_ADDRESS:PORT/patientrecord/search/text?query=document&pid=9E7A;100022
class QueryRDK < BuildQuery
  p "inside class QueryRDK"
  def initialize(pid, type)
    super()
    domain_path = RDClass.resourcedirectory_fetch.get_url("patient-record-search-text")
    @path.concat(domain_path)
    add_parameter("query", type)
    add_parameter("pid", pid)
    #add_parameter("query", text)
  end
end

#http://IP_ADDRESS:PORT/fhir/patient/urn:va:patient:9E7A:100716:100716
class QueryRDKDemographics < BuildQuery
  def initialize(type, uid)
    super()
    @path = String.new(DefaultLogin.rdk_fetch_url)
    @path.concat("/resource/fhir/" + type + "/" + uid)
  end

  def add_acknowledge(ack)
    add_parameter("_ack", ack)
  end
end

#http://IP_ADDRESS:PORT/resource/fhir/patient/9E7A;253/observation
class QueryRDKFhir < BuildQuery
  def initialize(uid, domain)
    super()
    @path = String.new(DefaultLogin.rdk_fetch_url)
    @path.concat("/resource/fhir/patient" + "/" + uid + "/" + domain)
  end

  def add_acknowledge(ack)
    add_parameter("_ack", ack)
  end
end

#http://IP_ADDRESS:PORT/resource/fhir/metadata
class QueryRDKFhirMetadata < BuildQuery
  def initialize
    super()
    @path = String.new(DefaultLogin.rdk_fetch_url)
    @path.concat("/resource/fhir/metadata")
  end
end

#http://IPADDRESS:POR/resource/vler/9E7A;8/toc?encounterUid=urn:va:visit:9E7A:8:1218
class QueryRDKVler < BuildQuery
  def initialize(type)
    super()
    @path = String.new(DefaultLogin.rdk_fetch_url)
    @path.concat("/resource/vler/" + type + "/toc")
  end

  def add_encount(encount)
    add_parameter("encounterUid", encount)
  end

  def add_acknowledge(ack)
    add_parameter("_ack", ack)
  end
end

if __FILE__ == $PROGRAM_NAME
  q= QueryRDKSync.new("one", "two")
  p q.path
  p QueryRDKAPI.new("uid", "3", "false").path
end

#http://IP_ADDRESS:PORT/patientrecord/domain/document?pid=10108V420871&filter=eq(kind,"Progress Note")
class QueryRDKFilterBySummary < BuildQuery
  p "inside class QueryRDKFilterBySummary"
  def initialize(pid = nil, filter = nil)
    super()
    @path = String.new(DefaultLogin.rdk_fetch_url)
    @path.concat("/resource/patient-record/domain/document")
    unless pid.nil?
      add_parameter("pid", pid)
    end
    unless filter.nil?
      add_parameter("filter", filter)
    end
  end
end

#http://IP_ADDRESS:PORT/resource/tasks?accessCode=pu1234&verifyCode=pu1234!!&site=9E7A
#{"context": "patient","patientICN":"10108V420871","status":"Ready"}
class RDKProcessList< BuildQuery
  def initialize
    super()
    @path = String.new(DefaultLogin.rdk_fetch_url)
    @path.concat("/resource/tasks")
  end
end

#http://IP_ADDRESS:PORT/resource/tasks/startprocess?accessCode=pu1234&verifyCode=pu1234!!&site=9E7A
#{"deploymentId":"VistaCore:FITLabProject:0.0.0","processDefId":"FITLabProject.FITLabActivity","parameter":{"icn":"10108V420871","facility":"9E7A"}}
class RDKStartProcess< BuildQuery
  def initialize
    super()
    @path = String.new(DefaultLogin.rdk_fetch_url)
    @path.concat("/resource/tasks/startprocess")
  end
end

class QueryGenericVISTA < BuildQuery
  # http://IP_ADDRESS:PORT/visits/providers
  def initialize(command, pid = nil, action = nil)
    super()
    @number_parameters = 0
    @path = String.new(DefaultLogin.vista_url)
    @path.concat("/#{command}")
    # @path.concat(pid)
    unless pid.nil?
      @path.concat("/#{pid}")
    end
    unless action.nil?
      @path.concat("/#{action}")
    end
  end
end

#http://IP_ADDRESS:PORT/resource/patient/record/domain/vital?filter=and(DATEFILTER)&pid=10107V395912
class QueryRDKCCB < BuildQuery
  def initialize(type)
    super()
    @path = String.new(DefaultLogin.rdk_fetch_url)
    @path.concat("/resource/patient/record/domain/vital?filter=and(ne(r350407%22%2C%2220150420235959%22))%2C%20ne(result%2CPass)&pid=" + type)
  end
end

class QueryCDSInvocation < BuildQuery
  def initialize
    super()
    @path = String.new(DefaultLogin.cds_url)
  end
end

class QueryRDKCDS < BuildQuery
  def initialize
    super()
    @path = String.new(DefaultLogin.rdk_fetch_url)
    @path.concat("/resource/cds")
  end
end

class QueryRDKCDSMetrics < BuildQuery
  def initialize
    super()
    @path = String.new(DefaultLogin.rdk_fetch_url)
    @path.concat("/resource/cds/metrics")
  end
end

class QueryRDKCDSfhir < BuildQuery
  def initialize
    super()
    @path = String.new(DefaultLogin.rdk_fetch_url)
    @path.concat("/resource/fhir")
  end
end

#query RDK Patient Record Domain
class QueryRDKPRD < BuildQuery
  def initialize
    super()
    @path = String.new(DefaultLogin.rdk_fetch_url)
    @path.concat("/resource/patient/record/domain/patient?pid=")
  end
end

#query RDK orderables search
class QueryRDKOrderables < BuildQuery
  def initialize
    super()
    @path = String.new(DefaultLogin.rdk_fetch_url)
    @path.concat("/resource/orderables?searchString=")
  end
end

#query RDK enterprise orderables search
class QueryRDKEnterpriseOrderable < BuildQuery
  def initialize
    super()
    @path = String.new(DefaultLogin.rdk_fetch_url)
    @path.concat("/resource/enterprise-orderable?")
  end
end

#Extened FHIR API query
class QueryRDKExtendFhirAPI < BuildQuery
  def initialize
    super()
    @path = String.new(DefaultLogin.rdk_fetch_url)
    @path.concat("/resource/fhir/patient/")
  end
end
