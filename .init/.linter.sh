#!/bin/bash
cd /tmp/kavia/workspace/code-generation/tic-tac-toe-game-12583-12592/bjkl_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

