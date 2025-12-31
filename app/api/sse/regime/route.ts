// GET /api/sse/regime - Server-Sent Events for real-time regime updates
// Streams regime signature updates to connected clients

import { NextRequest } from "next/server";
import { supabaseAnon } from "@/lib/mce/db/supabase";
import { RegimeSignatureSchema } from "@/lib/mce/schemas";
import { type Symbol, type TF } from "@/lib/mce/types";

export const runtime = "edge";
export const dynamic = "force-dynamic";

interface SSERegimeEvent {
  type: "regime";
  data: any; // RegimeSignature
}

interface SSEHealthEvent {
  type: "health";
  data: {
    status: "healthy" | "degraded" | "error";
    lastUpdate: number;
    message?: string;
  };
}

interface SSEErrorEvent {
  type: "error";
  data: {
    message: string;
    code?: string;
  };
}

type SSEEvent = SSERegimeEvent | SSEHealthEvent | SSEErrorEvent;

export async function GET(request: NextRequest): Promise<Response> {
  const { searchParams } = new URL(request.url);
  
  // Parse query parameters
  const symbol = (searchParams.get("symbol") || "BTCUSDT") as Symbol;
  const tf = (searchParams.get("tf") || "1m") as TF;
  const pollInterval = Math.max(1000, parseInt(searchParams.get("interval") || "3000")); // Min 1s, default 3s
  
  // Validate parameters
  if (!["BTCUSDT"].includes(symbol)) {
    return new Response("Invalid symbol", { status: 400 });
  }
  
  if (!["1m", "5m", "15m", "1h", "4h"].includes(tf)) {
    return new Response("Invalid timeframe", { status: 400 });
  }
  
  // Create readable stream for SSE
  const stream = new ReadableStream({
    start(controller) {
      let lastSignatureHash: string | null = null;
      let pollTimer: NodeJS.Timeout | null = null;
      let isActive = true;
      
      // SSE helper functions
      const sendEvent = (event: SSEEvent) => {
        if (!isActive) return;
        
        const eventData = `event: ${event.type}\ndata: ${JSON.stringify(event.data)}\n\n`;
        controller.enqueue(new TextEncoder().encode(eventData));
      };
      
      const sendHeartbeat = () => {
        if (!isActive) return;
        
        const heartbeat = `: heartbeat ${Date.now()}\n\n`;
        controller.enqueue(new TextEncoder().encode(heartbeat));
      };
      
      // Poll for regime updates
      const pollForUpdates = async () => {
        if (!isActive) return;
        
        try {
          const sb = supabaseAnon();
          
          const { data, error } = await sb
            .from("regime_signatures")
            .select("signature, hash")
            .eq("symbol", symbol)
            .eq("tf", tf)
            .order("as_of", { ascending: false })
            .limit(1);
          
          if (error) {
            console.error("SSE database error:", error);
            sendEvent({
              type: "error",
              data: {
                message: "Database query failed",
                code: "DATABASE_ERROR",
              },
            });
            return;
          }
          
          if (data && data.length > 0) {
            const row = data[0];
            const currentHash = row.hash;
            
            // Check if signature has changed
            if (currentHash !== lastSignatureHash) {
              try {
                // Validate signature
                const validatedSignature = RegimeSignatureSchema.parse(row.signature);
                
                // Send regime update
                sendEvent({
                  type: "regime",
                  data: validatedSignature,
                });
                
                lastSignatureHash = currentHash;
                
                // Send health update
                sendEvent({
                  type: "health",
                  data: {
                    status: "healthy",
                    lastUpdate: Date.now(),
                  },
                });
                
              } catch (validationError) {
                console.error("SSE signature validation error:", validationError);
                sendEvent({
                  type: "error",
                  data: {
                    message: "Invalid signature format",
                    code: "VALIDATION_ERROR",
                  },
                });
              }
            }
          } else {
            // No data found
            if (lastSignatureHash !== null) {
              sendEvent({
                type: "health",
                data: {
                  status: "degraded",
                  lastUpdate: Date.now(),
                  message: "No recent regime data",
                },
              });
            }
          }
          
        } catch (error) {
          console.error("SSE polling error:", error);
          sendEvent({
            type: "error",
            data: {
              message: "Polling failed",
              code: "POLLING_ERROR",
            },
          });
        }
      };
      
      // Send initial connection event
      sendEvent({
        type: "health",
        data: {
          status: "healthy",
          lastUpdate: Date.now(),
          message: `Connected to ${symbol} ${tf} regime stream`,
        },
      });
      
      // Start polling
      pollForUpdates(); // Initial poll
      pollTimer = setInterval(pollForUpdates, pollInterval);
      
      // Heartbeat every 30 seconds
      const heartbeatTimer = setInterval(sendHeartbeat, 30000);
      
      // Cleanup function
      const cleanup = () => {
        isActive = false;
        if (pollTimer) {
          clearInterval(pollTimer);
          pollTimer = null;
        }
        if (heartbeatTimer) {
          clearInterval(heartbeatTimer);
        }
      };
      
      // Handle client disconnect
      request.signal?.addEventListener("abort", cleanup);
      
      // Auto-cleanup after 30 minutes to prevent resource leaks
      setTimeout(() => {
        cleanup();
        controller.close();
      }, 30 * 60 * 1000);
    },
    
    cancel() {
      // Stream was cancelled by client
      console.log("SSE stream cancelled by client");
    },
  });
  
  // Return SSE response
  return new Response(stream, {
    status: 200,
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      "Connection": "keep-alive",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET",
      "Access-Control-Allow-Headers": "Cache-Control",
    },
  });
}

// OPTIONS handler for CORS
export async function OPTIONS(): Promise<Response> {
  return new Response(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Cache-Control",
    },
  });
}