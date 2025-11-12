import React, { useEffect } from "react";
import { Html5Qrcode } from "html5-qrcode";

function BarcodeScanner({ onScanSuccess }) {
  useEffect(() => {
    // Create a new Html5Qrcode instance linked to our container div
    const html5QrCode = new Html5Qrcode("barcode-scanner-container");

    // Fetch all available cameras
    Html5Qrcode.getCameras()
      .then((devices) => {
        if (devices && devices.length) {
          // Try to automatically pick the back (environment) camera
          const backCamera =
            devices.find((d) =>
              /back|rear|environment/i.test(d.label)
            ) || devices[0];

          // Start scanning with the chosen camera
          html5QrCode.start(
            backCamera.id,
            {
              fps: 10, // frames per second
              qrbox: { width: 250, height: 150 }, // scanning box
              formatsToSupport: [0,1,2,3,4,5,6,7,8,9,10,11], // barcode formats
            },
            (decodedText) => {
              // Stop scanning after a successful read
              html5QrCode.stop().then(() => {
                onScanSuccess(decodedText);
              });
            },
            (errorMessage) => {
              // Ignore scan errors (common when scanning continuously)
            }
          );
        } else {
          alert("No cameras found on this device.");
        }
      })
      .catch((err) => {
        console.error("Camera access error:", err);
        alert("Failed to access the camera. Please allow permissions.");
      });

    // Cleanup on component unmount
    return () => {
      html5QrCode
        .stop()
        .then(() => html5QrCode.clear())
        .catch((err) => console.error("Cleanup error:", err));
    };
  }, [onScanSuccess]);

  return (
    <div id="barcode-scanner-container" style={{ width: "100%" }}></div>
  );
}

export default BarcodeScanner;
