import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
  // Only allow in production
  if (process.env.NODE_ENV !== 'production') {
    return NextResponse.json(
      { ok: false, reason: 'Only available in production' },
      { status: 403 }
    );
  }

  try {
    const snapshot = await request.json();
    
    // Create logs directory if it doesn't exist
    const logsDir = path.join(process.cwd(), 'logs');
    try {
      await fs.mkdir(logsDir, { recursive: true });
    } catch {
      // Directory already exists
    }

    // Generate filename with timestamp and type
    const timestamp = new Date(snapshot.timestamp).toISOString().replace(/[:.]/g, '-');
    const filename = `hydration-${snapshot.snapshotType}-${timestamp}.json`;
    const filepath = path.join(logsDir, filename);

    // Save full snapshot as JSON
    await fs.writeFile(filepath, JSON.stringify(snapshot, null, 2));

    // Also append to JSONL file for easy parsing
    const jsonlFile = path.join(logsDir, 'hydration-snapshots.jsonl');
    await fs.appendFile(jsonlFile, JSON.stringify(snapshot) + '\n');

    // Create a summary file for quick inspection
    const summary = {
      timestamp: snapshot.timestamp,
      type: snapshot.snapshotType,
      url: snapshot.url,
      theme: snapshot.theme,
      viewport: snapshot.viewport,
      counts: {
        headerElements: snapshot.headerElements.length,
        glassButtons: snapshot.allGlassButtons.length,
        headerIcons: snapshot.allHeaderIcons.length,
        cssFiles: snapshot.cssFiles.length,
      },
      runtimeFlags: snapshot.runtimeFlags,
      performance: snapshot.performanceTiming,
      // Key CSS properties from first glass button
      firstGlassButton: snapshot.allGlassButtons[0] ? {
        selector: snapshot.allGlassButtons[0].selector,
        classes: snapshot.allGlassButtons[0].classes,
        backdropFilter: snapshot.allGlassButtons[0].computedStyles.backdropFilter,
        background: snapshot.allGlassButtons[0].computedStyles.background,
        transform: snapshot.allGlassButtons[0].computedStyles.transform,
        transition: snapshot.allGlassButtons[0].computedStyles.transition,
        animation: snapshot.allGlassButtons[0].computedStyles.animation,
      } : null,
    };

    const summaryFile = path.join(logsDir, 'hydration-summary.jsonl');
    await fs.appendFile(summaryFile, JSON.stringify(summary) + '\n');

    console.log(`✅ Hydration snapshot saved: ${filename}`);

    return NextResponse.json({
      ok: true,
      filename,
      summary,
    });
  } catch (error) {
    console.error('❌ Failed to save hydration snapshot:', error);
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve snapshots
export async function GET(request: NextRequest) {
  if (process.env.NODE_ENV !== 'production') {
    return NextResponse.json(
      { ok: false, reason: 'Only available in production' },
      { status: 403 }
    );
  }

  try {
    const logsDir = path.join(process.cwd(), 'logs');
    
    // Read all snapshot files
    const files = await fs.readdir(logsDir);
    const snapshotFiles = files.filter(f => f.startsWith('hydration-') && f.endsWith('.json'));

    // Get file stats
    const snapshots = await Promise.all(
      snapshotFiles.map(async (filename) => {
        const filepath = path.join(logsDir, filename);
        const stats = await fs.stat(filepath);
        return {
          filename,
          size: stats.size,
          created: stats.birthtime,
          modified: stats.mtime,
        };
      })
    );

    // Sort by creation time (newest first)
    snapshots.sort((a, b) => b.created.getTime() - a.created.getTime());

    return NextResponse.json({
      ok: true,
      count: snapshots.length,
      snapshots: snapshots.slice(0, 50), // Return last 50
    });
  } catch (error) {
    console.error('❌ Failed to list snapshots:', error);
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
