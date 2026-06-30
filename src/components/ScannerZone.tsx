import React, { useState, useRef, useEffect } from "react";
import { Camera, Upload, RefreshCw, AlertCircle, Sparkles, X, FlipHorizontal } from "lucide-react";
import { TrashScreenResult } from "../types";

interface ScannerZoneProps {
  onResult: (result: TrashScreenResult, imageUrl: string) => void;
  isProcessing: boolean;
  setIsProcessing: (loading: boolean) => void;
}

export default function ScannerZone({ onResult, isProcessing, setIsProcessing }: ScannerZoneProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>("image/jpeg");
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusText, setStatusText] = useState("Tap to Upload or Scan");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Array of helper texts during loading to show active AI processing
  const loadingStatusTexts = [
    "Uploading waste item...",
    "Gemini AI analyzing composition...",
    "Scanning container contour...",
    "Matching recyclability criteria...",
    "Generating safe disposal guide...",
  ];
  const [loadingTextIndex, setLoadingTextIndex] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isProcessing) {
      interval = setInterval(() => {
        setLoadingTextIndex((prev) => (prev + 1) % loadingStatusTexts.length);
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isProcessing]);

  // Clean up camera stream on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file (PNG, JPG, etc.).");
      return;
    }
    setError(null);
    setMimeType(file.type);

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setImagePreview(result);
      // Automatically send to AI
      submitToAI(result, file.type);
    };
    reader.onerror = () => {
      setError("Failed to read file.");
    };
    reader.readAsDataURL(file);
  };

  const submitToAI = async (base64Image: string, type: string) => {
    setIsProcessing(true);
    setError(null);
    try {
      const response = await fetch("/api/screen-trash", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image: base64Image,
          mimeType: type,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to screen the waste item.");
      }

      const result: TrashScreenResult = await response.json();
      onResult(result, base64Image);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred during screening.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  // Live Camera Activation
  const startCamera = async () => {
    setError(null);
    setImagePreview(null);
    setIsCameraActive(true);

    try {
      const constraints = {
        video: { facingMode: "environment" }, // Prefer back camera on mobile
        audio: false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err: any) {
      console.error("Camera access failed:", err);
      setIsCameraActive(false);
      setError(
        "Could not access your camera. Please ensure permissions are granted or upload an image file instead."
      );
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      // Use the actual video dimensions for capture resolution
      canvas.width = videoRef.current.videoWidth || 640;
      canvas.height = videoRef.current.videoHeight || 480;

      const ctx = canvas.getContext("2d");
      if (ctx) {
        // Draw the current video frame
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL("image/jpeg");
        setImagePreview(dataUrl);
        setMimeType("image/jpeg");

        // Stop camera and send snapshot to AI
        stopCamera();
        submitToAI(dataUrl, "image/jpeg");
      }
    }
  };

  const resetScanner = () => {
    stopCamera();
    setImagePreview(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      {/* Scanner Container */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative w-full aspect-video min-h-[260px] rounded-3xl border-2 border-dashed flex flex-col items-center justify-center overflow-hidden transition-all duration-300 ${
          isDragOver
            ? "border-[#143d26] bg-[#143d26]/5 shadow-inner scale-[1.01]"
            : isProcessing
            ? "border-[#143d26]/30 bg-gray-50/50 cursor-not-allowed"
            : "border-gray-300 hover:border-[#143d26]/50 bg-white"
        }`}
      >
        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
          disabled={isProcessing}
        />

        {/* 1. Camera View Mode */}
        {isCameraActive && (
          <div className="absolute inset-0 w-full h-full bg-black flex flex-col justify-between">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />

            {/* Camera Overlay Line */}
            <div className="absolute inset-x-0 h-1 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)] opacity-60 animate-scan pointer-events-none" />

            {/* Camera Actions Bar */}
            <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center gap-4 px-4">
              <button
                onClick={stopCamera}
                className="p-3 bg-white/20 hover:bg-white/30 text-white rounded-full transition-all"
                title="Cancel"
              >
                <X size={20} />
              </button>

              <button
                onClick={capturePhoto}
                className="w-16 h-16 rounded-full bg-white border-4 border-emerald-500 hover:bg-emerald-50 active:scale-95 transition-all shadow-lg flex items-center justify-center"
                title="Capture Trash"
              >
                <div className="w-10 h-10 rounded-full bg-emerald-600" />
              </button>
            </div>
          </div>
        )}

        {/* 2. Image Processing Mode (Scanning laser effect) */}
        {isProcessing && imagePreview && (
          <div className="absolute inset-0 w-full h-full">
            <img
              src={imagePreview}
              alt="Scanning item"
              className="w-full h-full object-cover opacity-80 blur-[1px]"
              referrerPolicy="no-referrer"
            />
            {/* Green glowing laser scanner line */}
            <div className="absolute inset-x-0 h-1 bg-emerald-500 shadow-[0_0_12px_#10b981,0_0_20px_#10b981] animate-scan" />

            {/* Loading text overlay */}
            <div className="absolute inset-0 bg-[#143d26]/40 backdrop-blur-[2px] flex flex-col items-center justify-center p-6 text-center">
              <div className="bg-white/90 backdrop-blur-md px-6 py-4 rounded-2xl shadow-xl flex flex-col items-center gap-3 border border-emerald-100 max-w-sm">
                <RefreshCw className="animate-spin text-emerald-600" size={32} />
                <div>
                  <h4 className="font-sans font-bold text-[#143d26] text-sm tracking-wide uppercase">
                    AI Trash Screening
                  </h4>
                  <p className="font-sans text-xs text-gray-600 mt-1 animate-pulse">
                    {loadingStatusTexts[loadingTextIndex]}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. Initial Empty State / Upload & Scan Request */}
        {!isCameraActive && !imagePreview && (
          <div
            onClick={() => !isProcessing && fileInputRef.current?.click()}
            className="w-full h-full flex flex-col items-center justify-center p-6 text-center cursor-pointer select-none group"
          >
            {/* Round Icon */}
            <div className="w-16 h-16 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center mb-4 text-[#143d26] group-hover:scale-110 transition-transform duration-300">
              <Camera size={26} className="stroke-[2]" />
            </div>

            <h3 className="font-sans font-bold text-lg text-gray-800 mb-1 group-hover:text-[#143d26] transition-colors">
              Tap to Upload or Scan
            </h3>
            <p className="font-sans text-xs text-gray-500 max-w-xs leading-relaxed">
              Supports JPG, PNG, and Live Camera
            </p>

            {/* Quick buttons overlay */}
            <div className="flex items-center gap-4 mt-6">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  startCamera();
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#143d26]/10 text-[#143d26] text-xs font-semibold hover:bg-[#143d26]/20 transition-all"
              >
                <Camera size={14} />
                Live Camera
              </button>
              <button
                type="button"
                className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-gray-100 text-gray-700 text-xs font-semibold hover:bg-gray-200 transition-all"
              >
                <Upload size={14} />
                Browse File
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-4 p-4 rounded-2xl bg-rose-50 border border-rose-100 text-rose-800 text-sm flex items-start gap-3 shadow-sm animate-fadeIn">
          <AlertCircle className="shrink-0 mt-0.5 text-rose-600" size={18} />
          <div className="flex-1">
            <span className="font-semibold block mb-0.5">Screening Error</span>
            <p className="text-rose-700 font-sans leading-relaxed">{error}</p>
            <div className="flex gap-4 mt-2">
              <button
                onClick={resetScanner}
                className="text-xs font-semibold underline text-rose-800 hover:text-rose-950"
              >
                Clear Error
              </button>
              {isCameraActive && (
                <button
                  onClick={startCamera}
                  className="text-xs font-semibold underline text-rose-800 hover:text-rose-950"
                >
                  Retry Camera
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
