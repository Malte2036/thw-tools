'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { Html5Qrcode, type Html5QrcodeCameraScanConfig } from 'html5-qrcode';
import { Button } from '@/components/base';
import { useSettingsStore } from '@/provider/store/settingsStore';
import PermissionDeniedDialog from './PermissionDeniedDialog';
import FloatingActionButton from './FloatingActionButton';
import QRCodeIcon from './QRCodeIcon';

// Constants
const QR_BOX_MIN_EDGE_PERCENTAGE = 0.7;
const QR_BOX_MIN_SIZE = 100;
const SCAN_FPS = 10;
const CAMERA_ZOOM = 2.0;
const CAMERA_ASPECT_RATIO = 1;
const CAMERA_PREFERENCES = ['ultra', 'back', 'rück'] as const;

interface Props {
  onScan: (decodedText: string) => void;
  scanButtonText?: string;
  closeButtonText?: string;
}

interface Camera {
  id: string;
  label: string;
}

interface CameraState {
  cameras: Camera[];
  isLoading: boolean;
  error: string | null;
  lastLoaded: number | null;
}

interface ExtendedHtml5QrcodeCameraScanConfig extends Html5QrcodeCameraScanConfig {
  focusMode?: string;
  advanced?: { zoom: number }[];
  experimentalFeatures?: { useBarCodeDetectorIfSupported: boolean };
}

export default function QRScanner({
  onScan,
  scanButtonText = 'Gerät scannen',
  closeButtonText = 'Scanner schließen',
}: Props) {
  const readerRef = useRef<HTMLDivElement>(null);
  const html5Qrcode = useRef<Html5Qrcode | null>(null);

  const [scanning, setScanning] = useState(false);
  const [selectCameraOpen, setSelectCameraOpen] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [cameraState, setCameraState] = useState<CameraState>({
    cameras: [],
    isLoading: false,
    error: null,
    lastLoaded: null,
  });

  const { selectedCamera, setSelectedCamera } = useSettingsStore();

  // Initialize Html5Qrcode
  useEffect(() => {
    if (html5Qrcode.current) return;

    html5Qrcode.current = new Html5Qrcode('reader');

    return () => {
      if (scanning && html5Qrcode.current) {
        html5Qrcode.current.stop().catch(console.error);
      }
    };
  }, [scanning]);

  const scrollReaderIntoView = useCallback(() => {
    if (readerRef.current) {
      readerRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, []);

  const handlePermissionError = useCallback((error: unknown) => {
    const isPermissionError =
      (error instanceof Error && error.name === 'NotAllowedError') ||
      (typeof error === 'string' && error.includes('NotAllowedError'));

    if (isPermissionError) {
      setPermissionDenied(true);
      setCameraState((prev) => ({ ...prev, error: 'Permission denied to access camera' }));
      return true;
    }

    const errorMessage = error instanceof Error ? error.message : 'Unknown camera error';
    setCameraState((prev) => ({ ...prev, error: errorMessage }));
    return false;
  }, []);

  const loadCameras = useCallback(
    async (forceRefresh = false) => {
      const now = Date.now();
      const recentlyLoaded = cameraState.lastLoaded && now - cameraState.lastLoaded < 5000;

      if (cameraState.isLoading || (recentlyLoaded && !forceRefresh)) {
        return cameraState.cameras;
      }

      setCameraState((prev) => ({ ...prev, isLoading: true, error: null }));

      try {
        const devices = await Html5Qrcode.getCameras();
        if (devices.length === 0) {
          setCameraState((prev) => ({
            ...prev,
            cameras: [],
            isLoading: false,
            error: 'No cameras found',
          }));
          return [];
        }

        const cameraList = devices.map((device) => ({
          id: device.id,
          label: device.label,
        }));

        setCameraState((prev) => ({
          ...prev,
          cameras: cameraList,
          isLoading: false,
          error: null,
          lastLoaded: now,
        }));

        return cameraList;
      } catch (error) {
        handlePermissionError(error);
        setCameraState((prev) => ({ ...prev, isLoading: false }));
        return [];
      }
    },
    [handlePermissionError, cameraState.isLoading, cameraState.lastLoaded, cameraState.cameras]
  );

  const getDefaultCamera = useCallback((availableCameras: Camera[]) => {
    for (const preference of CAMERA_PREFERENCES) {
      const preferredCamera = availableCameras.find((camera) =>
        camera.label.toLowerCase().includes(preference)
      );
      if (preferredCamera) return preferredCamera.id;
    }
    return availableCameras[0]?.id;
  }, []);

  const qrboxFunction = useCallback((viewfinderWidth: number, viewfinderHeight: number) => {
    const minEdgeSize = Math.min(viewfinderWidth, viewfinderHeight);
    const qrboxSize = Math.max(
      QR_BOX_MIN_SIZE,
      Math.floor(minEdgeSize * QR_BOX_MIN_EDGE_PERCENTAGE)
    );

    return { width: qrboxSize, height: qrboxSize };
  }, []);

  const startScan = useCallback(async () => {
    if (!html5Qrcode.current) return;

    let cameraId = selectedCamera;
    if (!cameraId) {
      const availableCameras =
        cameraState.cameras.length > 0 ? cameraState.cameras : await loadCameras();
      cameraId = getDefaultCamera(availableCameras);
      if (cameraId) setSelectedCamera(cameraId);
    }

    if (!cameraId) return;

    try {
      const config: ExtendedHtml5QrcodeCameraScanConfig = {
        fps: SCAN_FPS,
        qrbox: qrboxFunction,
        aspectRatio: CAMERA_ASPECT_RATIO,
        focusMode: 'continuous',
        advanced: [{ zoom: CAMERA_ZOOM }],
        experimentalFeatures: { useBarCodeDetectorIfSupported: true },
      };

      setScanning(true);
      await html5Qrcode.current.start({ deviceId: cameraId }, config, onScan, () => {
        // Silently handle scan failures
      });

      scrollReaderIntoView();
    } catch (error) {
      setScanning(false);
      handlePermissionError(error);
    }
  }, [
    selectedCamera,
    qrboxFunction,
    onScan,
    scrollReaderIntoView,
    handlePermissionError,
    getDefaultCamera,
    cameraState.cameras,
    loadCameras,
    setSelectedCamera,
  ]);

  const stopScan = useCallback(async () => {
    if (!html5Qrcode.current) return;

    try {
      await html5Qrcode.current.stop();
    } catch (error) {
      console.error('Error stopping scan:', error);
    } finally {
      setScanning(false);
    }
  }, []);

  const switchCamera = useCallback(
    async (newCameraId: string) => {
      if (scanning) await stopScan();
      setSelectedCamera(newCameraId);
      await startScan();
    },
    [scanning, stopScan, setSelectedCamera, startScan]
  );

  const start = useCallback(async () => {
    setSelectCameraOpen(true);
    const availableCameras = await loadCameras();

    if (availableCameras.length === 0) return;

    const isSelectedCameraValid = availableCameras.find((camera) => camera.id === selectedCamera);

    if (!isSelectedCameraValid) {
      const defaultCamera = getDefaultCamera(availableCameras);
      if (defaultCamera) setSelectedCamera(defaultCamera);
    }

    try {
      await startScan();
    } catch (error) {
      handlePermissionError(error);
    }
  }, [
    loadCameras,
    selectedCamera,
    getDefaultCamera,
    setSelectedCamera,
    startScan,
    handlePermissionError,
  ]);

  const stop = useCallback(async () => {
    setSelectCameraOpen(false);
    await stopScan();
  }, [stopScan]);

  const refreshCameras = useCallback(async () => {
    await loadCameras(true);
  }, [loadCameras]);

  const selectOptions = cameraState.cameras.map((camera) => ({
    value: camera.id,
    label: camera.label,
  }));

  return (
    <div className="flex flex-col gap-4">
      {selectCameraOpen && (
        <>
          <div className="text-center text-gray-500">
            Bitte wähle eine Kamera aus dem Dropdown aus:
          </div>

          {cameraState.isLoading && (
            <div className="text-center text-gray-500">Kameras werden geladen...</div>
          )}

          {cameraState.error && (
            <div className="text-center text-red-500 mb-2">
              {cameraState.error}
              <button onClick={refreshCameras} className="ml-2 text-blue-500 underline">
                Erneut versuchen
              </button>
            </div>
          )}

          {!cameraState.isLoading && selectOptions.length > 0 && (
            <select
              className="p-2 border rounded"
              value={selectedCamera || ''}
              onChange={(e) => switchCamera(e.target.value)}
            >
              <option value="" disabled>
                Kamera auswählen
              </option>
              {selectOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          )}

          {!cameraState.isLoading && selectOptions.length > 1 && (
            <button onClick={refreshCameras} className="text-sm text-blue-500 underline">
              Kameras aktualisieren
            </button>
          )}
        </>
      )}

      <div
        id="reader"
        ref={readerRef}
        className={`bg-gray-500 h-full w-full ${scanning ? '' : 'hidden'}`}
      />

      {scanning ? (
        <Button type="secondary" onClick={stop}>
          {closeButtonText}
        </Button>
      ) : (
        <Button type="primary" onClick={start}>
          {scanButtonText}
        </Button>
      )}

      <FloatingActionButton onClick={start} visible={!scanning}>
        <QRCodeIcon />
      </FloatingActionButton>

      {permissionDenied && <PermissionDeniedDialog onClose={() => setPermissionDenied(false)} />}
    </div>
  );
}
