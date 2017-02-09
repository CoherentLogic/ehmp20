require 'httparty'

class DefaultLogin
  @@default_wait_time = 50

  # TODO: Once RDK_FETCH_HOST is defined and RDK_IP is removed, clean up code below.  Ref. US7931
  if ENV.keys.include?('RDK_FETCH_HOST')
    @@rdk_fetch_url = ENV.keys.include?('RDK_FETCH_HOST') ? 'http://' + ENV['RDK_FETCH_HOST'] + ":" + ENV['RDK_FETCH_PORT']  : "http://IP_ADDRESS:PORT"
  else
    @@rdk_fetch_url = ENV.keys.include?('RDK_IP') ? 'http://' + ENV['RDK_IP'] + ":" + ENV["RDK_PORT"]  : "http://IP_ADDRESS:PORT"
  end

  @@rdk_writeback_url = ENV.keys.include?('RDK_WRITEBACK_HOST') ? 'http://' + ENV['RDK_WRITEBACK_HOST'] + ":" + ENV["RDK_WRITEBACK_PORT"] : "http://IP_ADDRESS:PORT"
  @@rdk_picklist_url = ENV.keys.include?('RDK_PICKLIST_HOST') ? 'http://' + ENV['RDK_PICKLIST_HOST'] + ":" + ENV["RDK_PICKLIST_PORT"] : "http://IP_ADDRESS:PORT"

  # TODO: Once JDS_HOST is defined and JDS_IP is removed, clean up code below.  Ref. US7931
  if ENV.keys.include?('JDS_HOST')
    @@jds_url = ENV.keys.include?('JDS_HOST') ? 'http://' + ENV['JDS_HOST'] + ":" + ENV['JDS_PORT']  : 'http://IP_ADDRESS:PORT'
  else
    @@jds_url = ENV.keys.include?('JDS_IP') ? 'http://' + ENV['JDS_IP'] + ":9080" : "http://IP_ADDRESS:PORT"
  end

  # TODO: Once VISTA_PANORAMA_HOST is defined and VISTA_IP is removed, clean up code below.  Ref. US7931
  if ENV.keys.include?('VISTA_PANORAMA_HOST')
    @@vista_url = ENV.keys.include?('VISTA_PANORAMA_HOST') ? 'http://' + ENV['VISTA_PANORAMA_HOST'] + ":" + ENV['VISTA_PANORAMA_PORT']  : 'http://IP_ADDRESS'
  else
    @@vista_url = ENV.keys.include?('VISTA_IP') ? 'http://' + ENV['VISTA_IP'] + ":" : "http://IP_ADDRESS"
  end

  def self.rdk_writeback_url
    return @@rdk_writeback_url
  end

  def self.rdk_picklist_url
    return @@rdk_picklist_url
  end

  def self.rdk_fetch_url
    return @@rdk_fetch_url
  end

  def self.wait_time
    return @@default_wait_time
  end

  def self.jds_url
    return @@jds_url
  end

  def self.vista_url
    return @@vista_url
  end
end
