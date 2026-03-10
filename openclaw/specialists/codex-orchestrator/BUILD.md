# BUILD.md

Status: done — orchestrator-layer cleanup/finish pass completed. All four Unity/C# starter repos are now scaffolded, committed, pushed to `main`, and clean locally.

## Completed work
- [x] `unity-csharp-lab` — landed a truthful Unity-ready lab scaffold with docs, package manifest, project version, and prototype workflow materials
- [x] `csharp-systems-playground` — replaced the stub with a real pure-C# systems playground, classic `.sln`, runnable sample, and console test runner
- [x] `blender-assets-lab` — landed the strong Blender asset workflow scaffold and pushed it cleanly
- [x] `first-unity-game` — landed the Courier Run starter scaffold, docs, Unity folder layout, and truthful first-open notes

## Acceptance checks / validation commands
- `dotnet build CSharpSystemsPlayground.sln -v minimal`
- `dotnet run --project tests/CSharpSystemsPlayground.Tests/CSharpSystemsPlayground.Tests.csproj`
- `dotnet run --project samples/CSharpSystemsPlayground.Showcase/CSharpSystemsPlayground.Showcase.csproj`
- `git diff --check` on Unity/Blender repos before landing
- `rg -n '/Users/sawyer|assistant|AI' <repo>` hygiene scan
- `/Applications/Unity/Hub/Editor/6000.3.10f1/Unity.app/Contents/MacOS/Unity -version`
- `/Applications/Blender.app/Contents/MacOS/Blender --version | head -n1`
- `git -C ~/github/<repo> status --short --branch`

## Verification snapshot
- `unity-csharp-lab` pushed commit `cf1b163` — `Scaffold Unity C# lab repo`
- `csharp-systems-playground` pushed commit `99da76b` — `Scaffold C# systems playground`
- `blender-assets-lab` pushed commit `32166be` — `Scaffold Blender asset workflow repo`
- `first-unity-game` pushed commit `ec09504` — `Scaffold Courier Run Unity starter repo`
- All four repos are clean on `main`
- Unity-facing repos remain truthful scaffolds; they still require a real editor open to generate `.meta` files, lockfiles, and first scenes/project assets

## Remaining follow-up
- Open `unity-csharp-lab` and `first-unity-game` in Unity to generate editor-managed files and first scenes
- Decide whether `Courier Run` graduates from scaffold into an actual gameplay implementation pass
- Expand `csharp-systems-playground` with more systems examples only after using the current primitives

## Blockers / pending decisions
- None for the scaffold/push pass
