import cluster from 'node:cluster';
import os from 'node:os';
import { startServer } from './index';

// Determine the number of worker instances to fork
// Defaults to CPU core count (capped at 4 for standard VPS/containers) or configurable via WEB_CONCURRENCY
const workerCount = process.env.WEB_CONCURRENCY
  ? parseInt(process.env.WEB_CONCURRENCY, 10)
  : Math.min(os.cpus().length, 4);

if (cluster.isPrimary) {
  console.log('================================================================');
  console.log(`[VJS TECH Cluster Load Balancer] Primary process [PID: ${process.pid}] online.`);
  console.log(`[VJS TECH Cluster Load Balancer] Distributing traffic across ${workerCount} worker processes.`);
  console.log('================================================================');

  // Spawn worker processes
  for (let i = 0; i < workerCount; i++) {
    cluster.fork();
  }

  // Handle worker lifecycle events
  cluster.on('online', (worker) => {
    console.log(`[VJS TECH Load Balancer] Worker ${worker.process.pid} is ready and listening.`);
  });

  cluster.on('exit', (worker, code, signal) => {
    console.warn(
      `[VJS TECH Load Balancer] Worker ${worker.process.pid} terminated (exit code: ${code}, signal: ${signal}). Auto-healing: spawning replacement worker...`
    );
    cluster.fork();
  });

  // Graceful termination of cluster
  const shutdownCluster = (signal: string) => {
    console.log(`[VJS TECH Load Balancer] Received ${signal}. Terminating all worker instances...`);
    for (const id in cluster.workers) {
      cluster.workers[id]?.process.kill();
    }
    process.exit(0);
  };

  process.on('SIGINT', () => shutdownCluster('SIGINT'));
  process.on('SIGTERM', () => shutdownCluster('SIGTERM'));
} else {
  // Each worker runs an isolated Express instance sharing the server TCP socket
  startServer();
}
