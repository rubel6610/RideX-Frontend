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
    
    startTimeRef.current = Date.now();
    
    intervalRef.current = setInterval(() => {
      if (!isMountedRef.current || !videoRef.current || !canvasRef.current) {
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
          
          if (progressValue >= 100 && !captureTimeoutRef.current) {
            savedFaceBoundsRef.current = detectedBounds;
            
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
              intervalRef.current = null;
            }
            
            captureTimeoutRef.current = setTimeout(() => {
              if (isMountedRef.current) {
                handleAutoCapture();
              }
            }, 2000);
          }
        } else {
          startTimeRef.current = Date.now();
          setProgress(0);
          setFaceBounds(null);
        }
      } else {
        startTimeRef.current = Date.now();
        setProgress(0);
        setFaceBounds(null);
      }
    }, 100);
  };

  const handleAutoCapture = async () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (!isMountedRef.current || !videoRef.current || !canvasRef.current) {
      return;
    }

    const boundsToUse = savedFaceBoundsRef.current || faceBounds;
    
    if (!boundsToUse) {
      return;
    }

    const screenshot = await captureFaceOnlyWithBgRemoval(videoRef.current, canvasRef.current, boundsToUse);
    
    if (screenshot) {
      setCaptureSuccess(true);

      // Animate success message
      if (successMessageRef.current) {
        gsap.fromTo(successMessageRef.current,
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.6, ease: "back.out(1.7)" }
        );
      }

      // Upload to ImgBB and get hosted URL
      try {
        console.log("Uploading face capture to ImgBB...");
        const formData = new FormData();
        formData.append('image', screenshot.split(',')[1]); 
        
        const response = await fetch(`https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_KEY}`, {
          method: 'POST',
          body: formData,
        });
        
        const result = await response.json();
        
        if (result.success && result.data?.url) {
          // Pass the hosted URL instead of base64 data
          if (onCapture) {
            onCapture(result.data.url);
          }
        } else {
          if (onCapture) {
            onCapture(screenshot);
          }
        }
      } catch (error) {
        console.error('ImgBB upload error:', error);
        console.log("Using base64 fallback for face capture due to error");
        // Fallback to base64 if ImgBB upload fails
        if (onCapture) {
          onCapture(screenshot);
        }
      }

      setTimeout(() => {
        if (isMountedRef.current) {
          handleClose();
        }
      }, 500);
    } else {
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
      {/* Position to the left on extra small screens, center on larger screens */}
      <div className="relative flex flex-col items-start">
        <div 
          ref={modalRef}
          className="w-[80vw] h-[80vw] max-w-[300px] max-h-[300px] rounded-full overflow-hidden bg-black shadow-2xl border-4 border-white"
        >

          {showMessage && (
            <div 
              ref={messageRef}
              className="absolute inset-0 flex items-center justify-center z-[100001] pointer-events-none"
            >
              <div className="bg-black/70 text-white px-6 py-4 rounded-full">
                <div className="text-xl font-bold text-center">HOLD</div>
              </div>
            </div>
          )}

          {progress === 100 && !captureSuccess && (
            <div 
              ref={captureIndicatorRef}
              className="absolute inset-0 border-4 border-yellow-400 rounded-full z-[99998] pointer-events-none animate-ping"
            />
          )}

          {captureSuccess && (
            <div 
              ref={successMessageRef}
              className="absolute inset-0 flex items-center justify-center z-[100001] pointer-events-none"
            >
              <div className="bg-black/70 text-white px-6 py-4 rounded-full">
                <div className="text-3xl text-center mb-1">✓</div>
                <div className="text-lg font-bold text-center">DONE</div>
              </div>
            </div>
          )}

          <WebcamCapture onStreamReady={handleStreamReady} progress={progress} faceBounds={faceBounds} videoRef={videoRef} />

          <canvas ref={canvasRef} className="hidden" />
        </div>
        
        {/* Only the circular progress bar below the circle */}
        <div className="mx-auto mt-6">
          <div 
            ref={progressBarRef}
          >
            <CircularProgress progress={progress} />
          </div>
        </div>
      </div>
    </div>
  );
}
