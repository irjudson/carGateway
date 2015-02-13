var log = require('winston')
  , utils = require('../utils')
  , nitrogen = require('nitrogen');

var config = {
    host: process.env.HOST_NAME || 'api.nitrogen.io',
    http_port: process.env.PORT || 443,
    protocol: process.env.PROTOCOL || 'https',
    api_key: process.env.API_KEY,
    log_levels: [ "debug", "info", "warn", "error" ]
};

var service = new nitrogen.Service(config);
var sessions = {};
var principals = {};

// 864721259083786

var nameMap = {
  "id" : "Device ID",
  "k10" : "Mass Air Flow Rate",
  "k11" : "Throttle Position(Manifold)",
  "k12" : "Air Status",
  "k14" : "Fuel trim bank 1 sensor 1",
  "k15" : "Fuel trim bank 1 sensor 2",
  "k16" : "Fuel trim bank 1 sensor 3",
  "k17" : "Fuel trim bank 1 sensor 4",
  "k18" : "Fuel trim bank 2 sensor 1",
  "k19" : "Fuel trim bank 2 sensor 2",
  "k1a" : "Fuel trim bank 2 sensor 3",
  "k1b" : "Fuel trim bank 2 sensor 4",
  "k1f" : "Run time since engine start",
  "k21" : "Distance travelled with MIL/CEL lit",
  "k22" : "Fuel Rail Pressure (relative to manifold vacuum)",
  "k23" : "Fuel Rail Pressure",
  "k24" : "O2 Sensor1 Equivalence Ratio",
  "k25" : "O2 Sensor2 Equivalence Ratio",
  "k26" : "O2 Sensor3 Equivalence Ratio",
  "k27" : "O2 Sensor4 Equivalence Ratio",
  "k28" : "O2 Sensor5 Equivalence Ratio",
  "k29" : "O2 Sensor6 Equivalence Ratio",
  "k2a" : "O2 Sensor7 Equivalence Ratio",
  "k2b" : "O2 Sensor8 Equivalence Ratio",
  "k2c" : "EGR Commanded",
  "k2d" : "EGR Error",
  "k2f" : "Fuel Level (From Engine ECU)",
  "k3" : "Fuel Status",
  "k31" : "Distance travelled since codes cleared",
  "k32" : "Evap System Vapour Pressure",
  "k33" : "Barometric pressure (from vehicle)",
  "k34" : "O2 Sensor1 Equivalence Ratio(alternate)",
  "k3c" : "Catalyst Temperature (Bank 1 Sensor 1)",
  "k3d" : "Catalyst Temperature (Bank 2 Sensor 1)",
  "k3e" : "Catalyst Temperature (Bank 1 Sensor 2)",
  "k3f" : "Catalyst Temperature (Bank 2 Sensor 2)",
  "k4" : "Engine Load",
  "k42" : "Voltage (Control Module)",
  "k43" : "Engine Load(Absolute)",
  "k44" : "Commanded Equivalence Ratio(lambda)",
  "k45" : "Relative Throttle Position",
  "k46" : "Ambient air temp",
  "k47" : "Absolute Throttle Position B",
  "k49" : "Accelerator PedalPosition D",
  "k4a" : "Accelerator PedalPosition E",
  "k4b" : "Accelerator PedalPosition F",
  "k5" : "Engine Coolant Temperature",
  "k52" : "Ethanol Fuel %",
  "k5a" : "Relative Accelerator Pedal Position",
  "k5c" : "Engine Oil Temperature",
  "k6" : "Fuel Trim Bank 1 Short Term",
  "k7" : "Fuel Trim Bank 1 Long Term",
  "k78" : "Exhaust Gas Temperature 1",
  "k79" : "Exhaust Gas Temperature 2",
  "k8" : "Fuel Trim Bank 2 Short Term",
  "k9" : "Fuel Trim Bank 2 Long Term",
  "ka" : "Fuel pressure",
  "kb" : "Intake Manifold Pressure",
  "kb4" : "Transmission Temperature(Method 2)",
  "kc" : "Engine RPM",
  "kd" : "Speed (OBD)",
  "ke" : "Timing Advance",
  "kf" : "Intake Air Temperature",
  "kfe1805" : "Transmission Temperature(Method 1)",
  "kff1001" : "Speed (GPS)",
  "kff1005" : "GPS Longitude",
  "kff1006" : "GPS Latitude",
  "kff1007" : "GPS Bearing",
  "kff1010" : "GPS Altitude",
  "kff1201" : "Miles Per Gallon(Instant)",
  "kff1202" : "Turbo Boost & Vacuum Gauge",
  "kff1203" : "Kilometers Per Litre(Instant)",
  "kff1204" : "Trip Distance",
  "kff1205" : "Trip average MPG",
  "kff1206" : "Trip average KPL",
  "kff1207" : "Litres Per 100 Kilometer(Instant)",
  "kff1208" : "Trip average Litres/100 KM",
  "kff120c" : "Trip distance (stored in vehicle profile)",
  "kff1214" : "O2 Volts Bank 1 sensor 1",
  "kff1215" : "O2 Volts Bank 1 sensor 2",
  "kff1216" : "O2 Volts Bank 1 sensor 3",
  "kff1217" : "O2 Volts Bank 1 sensor 4",
  "kff1218" : "O2 Volts Bank 2 sensor 1",
  "kff1219" : "O2 Volts Bank 2 sensor 2",
  "kff121a" : "O2 Volts Bank 2 sensor 3",
  "kff121b" : "O2 Volts Bank 2 sensor 4",
  "kff1220" : "Acceleration Sensor(X axis)",
  "kff1221" : "Acceleration Sensor(Y axis)",
  "kff1222" : "Acceleration Sensor(Z axis)",
  "kff1223" : "Acceleration Sensor(Total)",
  "kff1225" : "Torque",
  "kff1226" : "Horsepower (At the wheels)",
  "kff122d" : "0-60mph Time",
  "kff122e" : "0-100kph Time",
  "kff122f" : "1/4 mile time",
  "kff1230" : "1/8 mile time",
  "kff1237" : "GPS vs OBD Speed difference",
  "kff1238" : "Voltage (OBD Adapter)",
  "kff1239" : "GPS Accuracy",
  "kff123a" : "GPS Satellites",
  "kff123b" : "GPS Bearing",
  "kff1240" : "O2 Sensor1 wide-range Voltage",
  "kff1241" : "O2 Sensor2 wide-range Voltage",
  "kff1242" : "O2 Sensor3 wide-range Voltage",
  "kff1243" : "O2 Sensor4 wide-range Voltage",
  "kff1244" : "O2 Sensor5 wide-range Voltage",
  "kff1245" : "O2 Sensor6 wide-range Voltage",
  "kff1246" : "O2 Sensor7 wide-range Voltage",
  "kff1247" : "O2 Sensor8 wide-range Voltage",
  "kff1249" : "Air Fuel Ratio(Measured)",
  "kff124a" : "Tilt(x)",
  "kff124b" : "Tilt(y)",
  "kff124c" : "Tilt(z)",
  "kff124d" : "Air Fuel Ratio(Commanded)",
  "kff124f" : "0-200kph Time",
  "kff1257" : "CO₂ in g/km (Instantaneous)",
  "kff1258" : "CO₂ in g/km (Average)",
  "kff125a" : "Fuel flow rate/minute",
  "kff125c" : "Fuel cost (trip)",
  "kff125d" : "Fuel flow rate/hour",
  "kff125e" : "60-120mph Time",
  "kff125f" : "60-80mph Time",
  "kff1260" : "40-60mph Time",
  "kff1261" : "80-100mph Time",
  "kff1263" : "Average trip speed(whilst moving only)",
  "kff1264" : "100-0kph Time",
  "kff1265" : "60-0mph Time",
  "kff1266" : "Trip Time(Since journey start)",
  "kff1267" : "Trip time(whilst stationary)",
  "kff1268" : "Trip Time(whilst moving)",
  "kff1269" : "Volumetric Efficiency (Calculated)",
  "kff126a" : "Distance to empty (Estimated)",
  "kff126b" : "Fuel Remaining (Calculated from vehicle profile)",
  "kff126d" : "Cost per mile/km (Instant)",
  "kff126e" : "Cost per mile/km (Trip)",
  "kff1270" : "Barometer (on Android device)",
  "kff1271" : "Fuel used (trip)",
  "kff1272" : "Average trip speed(whilst stopped or moving)",
  "kff1273" : "Engine kW (At the wheels)",
  "kff1275" : "80-120kph Time",
  "kff1276" : "60-130mph Time",
  "kff1277" : "0-30mph Time",
  "kff5201" : "Miles Per Gallon(Long Term Average)",
  "kff5202" : "Kilometers Per Litre(Long Term Average)",
  "kff5203" : "Litres Per 100 Kilometer(Long Term Average)",
  "session" : "Session ID",
  "time" : "Timestamp"
};

exports.handleData = function(req, res) {
  var inMsg = {
    type: '_telemetry',
    body: {}
  };
  for (var key in req.query) {
    if (key in nameMap) {
      inMsg.body[nameMap[key]] = req.query[key];
    } else {
      inMsg.body[key] = req.query[key];
    }
  }
 
  var userId = inMsg.body['eml'].toString();
  var credentialArray = userId.split("@");
  var deviceId = credentialArray[0];
  inMsg.body['Nitrogen Device ID'] = deviceId;
  inMsg.to = deviceId;
  inMsg.type = '_telemetry';
  delete inMsg.body['eml'];

  if (!(deviceId in sessions)) {
    var principal = new nitrogen.Device({
        accessToken: {
            token: credentialArray[1]
        },
        id: deviceId,
        nickname: deviceId
    });
 
    service.resume(principal, function(err, session, principal) {
        if (err || !session) {
            console.log("Error resuming: " + JSON.stringify(err));
        }
        sessions[deviceId] = session;
	principals[deviceId] = principal;
    });
  }

  var msg = new nitrogen.Message(inMsg);

  if (deviceId in sessions) {
    msg.send(sessions[deviceId], function(err, message) {
      if (err) console.log("Error sending message: " + JSON.stringify(err));
    });            
  }

  res.send("Ok!");
}
