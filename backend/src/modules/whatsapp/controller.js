const service = require("./service");

async function connect(req, res) {
  try {
    const data = await service.connect(req.params.deviceId, req.user.id);
    res.json({ success: true, data });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
}

async function status(req, res) {
  try {
    const data = await service.getStatus(req.params.deviceId, req.user.id);
    res.json({ success: true, data });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
}

async function pairing(req, res) {
  try {
    const data = await service.requestPairing(
      req.params.deviceId,
      req.body.phone
    );

    res.json({
      success: true,
      data,
    });
  } catch (e) {
    res.status(400).json({
      success: false,
      message: e.message,
    });
  }
}

async function qr(req, res) {
  try {
    const qr = await service.getQrImage(req.params.deviceId);

    const base64 = qr.replace(/^data:image\/png;base64,/, "");
    const img = Buffer.from(base64, "base64");

    res.writeHead(200, {
      "Content-Type": "image/png",
      "Content-Length": img.length,
    });

    res.end(img);
  } catch (err) {
    res.status(404).send(err.message);
  }
}

async function disconnect(req, res) {
  try {
    const data = await service.disconnect(req.params.deviceId, req.user.id);
    res.json({ success: true, data });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
}

module.exports = {
  connect,
  status,
  pairing,
  qr,
  disconnect,
};