#!/bin/bash

compile_for_target() {
    local target=$1
    local output_name=$2
    
    echo "Compiling for $target..."
    
    deno compile \
        --target $target \
        --allow-read \
        --allow-write \
        --allow-net \
        --output $output_name \
        src/server.ts
}

mkdir -p build

case "$(uname -s)" in
    Linux*)     CURRENT_OS=linux;;
    Darwin*)    CURRENT_OS=macos;;
    MINGW*)     CURRENT_OS=windows;;
    *)          CURRENT_OS="UNKNOWN";;
esac

if [ -z "$1" ]; then
    case $CURRENT_OS in
        linux)
            compile_for_target "x86_64-unknown-linux-gnu" "build/family-movie-roulette-linux"
            ;;
        macos)
            compile_for_target "x86_64-apple-darwin" "build/family-movie-roulette-macos"
            ;;
        windows)
            compile_for_target "x86_64-pc-windows-msvc" "build/family-movie-roulette-windows.exe"
            ;;
        *)
            echo "Unsupported platform"
            exit 1
            ;;
    esac
else
    case $1 in
        linux)
            compile_for_target "x86_64-unknown-linux-gnu" "build/family-movie-roulette-linux"
            ;;
        macos)
            compile_for_target "x86_64-apple-darwin" "build/family-movie-roulette-macos"
            ;;
        windows)
            compile_for_target "x86_64-pc-windows-msvc" "build/family-movie-roulette-windows.exe"
            ;;
        all)
            compile_for_target "x86_64-unknown-linux-gnu" "build/family-movie-roulette-linux"
            compile_for_target "x86_64-apple-darwin" "build/family-movie-roulette-macos"
            compile_for_target "x86_64-pc-windows-msvc" "build/family-movie-roulette-windows.exe"
            ;;
        *)
            echo "Invalid target. Use: linux, macos, windows, or all"
            exit 1
            ;;
    esac
fi

echo "Compilation complete! Binaries are in the 'build' directory."