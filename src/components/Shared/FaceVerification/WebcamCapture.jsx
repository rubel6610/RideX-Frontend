"use client";
import { useRef, useEffect, useState } from "react";
import gsap from "gsap";

export default function WebcamCapture({ onStreamReady, progress, faceBounds, videoRef: parentVideoRef }) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const isMountedRef = useRef(true);
  const [isReady, setIsReady] = useState(false);
  const loadingRef = useRef(null);

  useEffect(() => {
    isMountedRef.current = true;
    startWebcam();
    
    return () => {
      isMountedRef.current = false;
      stopWebcam();
    };
  }, []);

  const startWebcam = async () => {
    console.log("Starting webcam...");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: 640, height: 480 },
        audio: false,
      });
      
      console.log("Webcam stream obtained:", stream);
      
      if (!isMountedRef.current) {
        console.log("Component unmounted, stopping stream");
        stream.getTracks().forEach(track => track.stop());
        return;
      }
      
      streamRef.current = stream;
      
      if (videoRef.current) {
        console.log("Attaching stream to video element");
        videoRef.current.srcObject = stream;
        videoRef.current.muted = true;
        videoRef.current.playsInline = true;
        videoRef.current.autoplay = true;
        
        videoRef.current.onloadedmetadata = () => {
          console.log("Video metadata loaded", {
            width: videoRef.current.videoWidth,
            height: videoRef.current.videoHeight,
            readyState: videoRef.current.readyState
          });
          
          if (!isMountedRef.current || !videoRef.current) return;
          
          videoRef.current.play()
            .then(() => {
              console.log("Video playing successfully");
              if (isMountedRef.current) {
                // Animate the loading screen out
                if (loadingRef.current) {
                  gsap.to(loadingRef.current, {
                    opacity: 0,
                    duration: 0.3,
                    onComplete: () => {
                      if (isMountedRef.current) {
                        setIsReady(true);
                        if (onStreamReady) {
                          console.log("Calling onStreamReady callback");
                          onStreamReady(videoRef.current);
                        }
                      }
                    }
                  });
                } else {
                  setIsReady(true);
                  if (onStreamReady) {
                    console.log("Calling onStreamReady callback");
                    onStreamReady(videoRef.current);
                  }
                }
              }
            })
            .catch((err) => {
              if (err.name !== 'AbortError') {
                console.error("Video play error:", err);
              }
            });
        };
      }
    } catch (err) {
      console.error("Camera access error:", err);
      // Animate error message
      if (loadingRef.current) {
        gsap.fromTo(loadingRef.current, 
          { scale: 1 },
          { 
            scale: 1.05, 
            repeat: 3, 
            yoyo: true, 
            duration: 0.1,
            onComplete: () => {
              // Show error message
              if (loadingRef.current) {
                loadingRef.current.innerHTML = "Unable to access camera. Please allow permissions.";
              }
            }
          }
        );
      }
    }
  };

  const stopWebcam = () => {
    if (videoRef.current) {
      videoRef.current.srcObject = null;
      videoRef.current.onloadedmetadata = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  return (
    <div className="absolute inset-0 w-full h-full bg-black overflow-hidden">
      {!isReady && (
        <div 
          ref={loadingRef}
          className="absolute inset-0 flex items-center justify-center bg-gray-900 z-10"
        >
          <div className="text-white text-lg">Loading camera...</div>
        </div>
      )}
      <video
        ref={videoRef}
        playsInline
        muted
        className="absolute inset-0 w-full h-full object-cover"
        style={{ transform: "scaleX(-1)" }}
      />
      
      {/* Face detection overlay */}
      {faceBounds && progress < 100 && (
        <div 
          className="absolute border-2 border-green-500 rounded-lg pointer-events-none"
          style={{
            left: `${(faceBounds.x / videoRef.current?.videoWidth || 0) * 100}%`,
            top: `${(faceBounds.y / videoRef.current?.videoHeight || 0) * 100}%`,
            width: `${(faceBounds.width / videoRef.current?.videoWidth || 0) * 100}%`,
            height: `${(faceBounds.height / videoRef.current?.videoHeight || 0) * 100}%`,
          }}
        />
      )}
      
      {/* Progress indicator overlay */}
      {progress > 0 && progress < 100 && (
        <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
          Positioning: {Math.round(progress)}%
        </div>
      )}
    </div>
  );
}