#!/usr/bin/env python3
# Local dev server for this project — plain `python3 -m http.server` sends no
# Cache-Control headers at all, so browsers fall back to heuristic caching and
# repeatedly serve stale JS/HTML after edits (bit us many times testing this
# project). This wrapper just adds no-store headers on every response so a
# normal reload always sees the latest files on disk.
import http.server
import socketserver
import sys

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8010
DIRECTORY = sys.argv[2] if len(sys.argv) > 2 else "."


class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def end_headers(self):
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
        super().end_headers()


class ReusableTCPServer(socketserver.TCPServer):
    allow_reuse_address = True


if __name__ == "__main__":
    with ReusableTCPServer(("", PORT), NoCacheHandler) as httpd:
        httpd.serve_forever()
