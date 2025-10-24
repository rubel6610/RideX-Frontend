"use client";
import { useState, useRef, useEffect } from "react";
import { X } from "lucide-react";
import WebcamCapture from "./WebcamCapture";
import CircularProgress from "./CircularProgress";
import { detectSimpleFace, captureFaceOnlyWithBgRemoval } from "./simpleFaceDetection";
import gsap from "gsap";

export default function FaceVerificationModal({ isOpen, onClose, onCapture }) {
  const [progress, setProgress] = useState(0);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [captureSuccess, setCaptureSuccess] = useState(false);
  const [faceBounds, setFaceBounds] = useState(null);
  const [showMessage, setShowMessage] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const intervalRef = useRef(null);
  const isMountedRef = useRef(true);
  const startTimeRef = useRef(null);
  const captureTimeoutRef = useRef(null);
  const savedFaceBoundsRef = useRef(null);
  
  // Refs for GSAP animations
  const modalRef = useRef(null);
  const messageRef = useRef(null);
  const progressBarRef = useRef(null);
  const successMessageRef = useRef(null);
  const captureIndicatorRef = useRef(null);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (captureTimeoutRef.current) {
        clearTimeout(captureTimeoutRef.current);
        captureTimeoutRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (isOpen && isVideoReady && videoRef.current) {
      console.log("Video ready, showing message");
      setShowMessage(true);
      
      // Animate the modal entrance
      if (modalRef.current) {
        gsap.fromTo(modalRef.current, 
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" }
        );
      }
      
      const timer = setTimeout(() => {
        if (isMountedRef.current) {
          setShowMessage(false);
          startDetection();
        }
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen, isVideoReady]);

  useEffect(() => {
    // Animate progress bar when progress changes
    if (progressBarRef.current) {
      gsap.to(progressBarRef.current, {
        scale: progress > 0 ? 1 : 0.8,
        duration: 0.3,
        ease: "power2.out"
      });
    }
  }, [progress]);

  const startDetection = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    console.log("Starting detection");
    startTimeRef.current = Date.now();
    
    intervalRef.current = setInterval(() => {
      if (!isMountedRef.current || !videoRef.current || !canvasRef.current) {
        console.log("Detection stopped");
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        return;
      }

      const detection = detectSimpleFace(videoRef.current, canvasRef.current);
      
      if (detection) {
        const { hasFullFace, faceBounds: detectedBounds } = detection;

        if (hasFullFace) {
          const elapsed = Date.now() - startTimeRef.current;
          const progressValue = Math.min((elapsed / 3000) * 100, 100);
          
          setProgress(progressValue);
          setFaceBounds(detectedBounds);
          console.log("Full face detected - Progress:", progressValue);
          
          if (progressValue >= 100 && !captureTimeoutRef.current) {
            console.log("100% reached - saving bounds and waiting 2 seconds before capture");
            
            savedFaceBoundsRef.current = detectedBounds;
            
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
              intervalRef.current = null;
            }
            
            captureTimeoutRef.current = setTimeout(() => {
              console.log("2 seconds passed - capturing now");
              if (isMountedRef.current) {
                handleAutoCapture();
              }
            }, 2000);
          }
        } else {
          startTimeRef.current = Date.now();
          setProgress(0);
          setFaceBounds(null);
          console.log("No full face detected - resetting timer");
        }
      } else {
        console.log("No detection result");
        startTimeRef.current = Date.now();
        setProgress(0);
        setFaceBounds(null);
      }
    }, 100);
  };

  const handleAutoCapture = async () => {
    console.log("handleAutoCapture called");
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (!isMountedRef.current || !videoRef.current || !canvasRef.current) {
      console.log("Missing refs - cannot capture");
      return;
    }

    const boundsToUse = savedFaceBoundsRef.current || faceBounds;
    
    if (!boundsToUse) {
      console.log("No face bounds available - cannot capture");
      return;
    }

    console.log("Capturing with bounds:", boundsToUse);
    const screenshot = await captureFaceOnlyWithBgRemoval(videoRef.current, canvasRef.current, boundsToUse);
    
    if (screenshot) {
      console.log("Captured Face Screenshot successfully");
      console.log("Screenshot size:", screenshot.length, "characters");

      setCaptureSuccess(true);

      // Animate success message
      if (successMessageRef.current) {
        gsap.fromTo(successMessageRef.current,
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.6, ease: "back.out(1.7)" }
        );
      }

      if (onCapture) {
        onCapture(screenshot);
      }

      setTimeout(() => {
        if (isMountedRef.current) {
          handleClose();
        }
      }, 500);
    } else {
      console.error("Failed to capture screenshot");
      setTimeout(() => {
        if (isMountedRef.current) {
          setProgress(0);
          setFaceBounds(null);
          savedFaceBoundsRef.current = null;
          captureTimeoutRef.current = null;
          startDetection();
        }
      }, 1000);
    }
  };

  const handleStreamReady = (video) => {
    if (isMountedRef.current) {
      videoRef.current = video;
      setIsVideoReady(true);
    }
  };

  const handleClose = () => {
    // Animate modal exit
    if (modalRef.current) {
      gsap.to(modalRef.current, {
        opacity: 0,
        y: 20,
        duration: 0.2,
        ease: "power2.in",
        onComplete: () => {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          if (captureTimeoutRef.current) {
            clearTimeout(captureTimeoutRef.current);
            captureTimeoutRef.current = null;
          }
          setProgress(0);
          setIsVideoReady(false);
          setCaptureSuccess(false);
          setFaceBounds(null);
          setShowMessage(false);
          startTimeRef.current = null;
          savedFaceBoundsRef.current = null;
          videoRef.current = null;
          onClose();
        }
      });
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (captureTimeoutRef.current) {
        clearTimeout(captureTimeoutRef.current);
        captureTimeoutRef.current = null;
      }
      setProgress(0);
      setIsVideoReady(false);
      setCaptureSuccess(false);
      setFaceBounds(null);
      setShowMessage(false);
      startTimeRef.current = null;
      savedFaceBoundsRef.current = null;
      videoRef.current = null;
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[99999] bg-black/90 flex items-center justify-center p-4">
      <div 
        ref={modalRef}
        className="relative w-full h-full md:w-[90%] lg:w-[70%] md:h-[90vh] lg:h-[85vh] md:rounded-3xl lg:rounded-3xl overflow-hidden bg-black shadow-2xl border-4 border-teal-500/30"
      >
        <button
          onClick={handleClose}
          className="absolute top-6 right-6 text-white bg-destructive p-4 rounded-full hover:bg-destructive/90 hover:scale-110 transition-transform z-[100000] shadow-xl"
        >
          <X size={24} />
        </button>

        <div 
          ref={progressBarRef}
          className="absolute top-6 right-24 z-[100000]"
        >
          <CircularProgress progress={progress} />
        </div>

        {showMessage && (
          <div 
            ref={messageRef}
            className="absolute inset-0 flex items-center justify-center z-[100001] pointer-events-none"
          >
            <div className="bg-blue-600 text-white px-20 py-12 rounded-3xl shadow-2xl animate-pulse">
              <div className="text-5xl font-bold text-center">HOLD FOR CAPTURE</div>
            </div>
          </div>
        )}

        {progress === 100 && !captureSuccess && (
          <div 
            ref={captureIndicatorRef}
            className="absolute inset-0 border-8 border-green-500 z-[99998] pointer-events-none animate-pulse"
          />
        )}

        {captureSuccess && (
          <div 
            ref={successMessageRef}
            className="absolute inset-0 flex items-center justify-center z-[100001] pointer-events-none"
          >
            <div className="bg-green-600 text-white px-16 py-12 rounded-3xl shadow-2xl">
              <div className="text-7xl text-center mb-6">✓</div>
              <div className="text-4xl font-bold text-center">CAPTURED!</div>
            </div>
          </div>
        )}

        <WebcamCapture onStreamReady={handleStreamReady} progress={progress} faceBounds={faceBounds} videoRef={videoRef} />

        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
}