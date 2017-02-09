require 'vistarpc4r'


# options
#------------------------------------
serve_ip = "IP_ADDRESS"
note_amount = 100
patient_id = "100841" # alpha test
#------------------------------------


@broker = VistaRPC4r::RPCBrokerConnection.new(serve_ip, 9210, "pr12345", "pr12345!!", false)
@broker.connect
@broker.setContext('OR CPRS GUI CHART')



note_amount.times do |i|
	# save a note

	vrpc = VistaRPC4r::VistaRPC.new("TIU CREATE RECORD", VistaRPC4r::RPCResponse::SINGLE_VALUE)
	vrpc.params = [
		patient_id, #patient id
		"16", # note type
		"",
		"",
		"",
		[
			["1202","991"], #provider id
			["1301","3150421.1150"], # time
			["1205","195"], #location
			["1701",""]
		],
		"195;3140512.13;A", # time and location
		"1"
	]

	resp = @broker.execute(vrpc)
	note_id = resp.value


	# # save some text to the note


	vrpc = VistaRPC4r::VistaRPC.new("TIU SET DOCUMENT TEXT", VistaRPC4r::RPCResponse::SINGLE_VALUE)
	vrpc.params = [
		"#{note_id}",
		[
			["\"TEXT\",1,0","Note Signed"],
			["\"HDR\"","1^1"]
		],
		"0"
	]

	resp = @broker.execute(vrpc)

	vrpc = VistaRPC4r::VistaRPC.new("ORWPCE SAVE", VistaRPC4r::RPCResponse::SINGLE_VALUE)
	vrpc.params = [
		[
			["1","HDR^0^^32;3150421.1150;A"], # time = 3150416.15135
			["2","VST^DT^3150421.1150"], # visit time
			["3","VST^PT^100841"], # patient icn
			["4","VST^HL^32"], # location, primary care
			["5","VST^VC^A"], # ????
			["6","PRV^991^^^PROVIDER,EIGHT^1"], # provider
			["7","PED+^612055^^HTN EXERCISE^@^^^^^1"], # ed
			["8","COM^1^@"],
			["9","HF+^2^^CURRENT SMOKER^H^^^^^1^"], # health factor
			["10","COM^2^@"],
			["11","HF+^5^^CURRENT SMOKER^H^^^^^1^"], # health factor
			["12","COM^3^@"]
		],
		"#{note_id}",
		"32"
	]

	resp = @broker.execute(vrpc)

	# puts resp

	# # sign me!!!

	vrpc = VistaRPC4r::VistaRPC.new("TIU SIGN RECORD", VistaRPC4r::RPCResponse::SINGLE_VALUE)
	vrpc.params = [
		"#{note_id}",
		"%KpV7x&*p0"
	]

	resp = @broker.execute(vrpc)

	# puts resp

end

@broker.close