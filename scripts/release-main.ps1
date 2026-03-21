[CmdletBinding(PositionalBinding = $false)]
param(
    [Parameter(Mandatory = $false)]
    [string]$Message,

    [Parameter(Mandatory = $false)]
    [switch]$DryRun,

    [Parameter(ValueFromRemainingArguments = $true)]
    [string[]]$Pathspec
)

$ErrorActionPreference = 'Stop'

if ([string]::IsNullOrWhiteSpace($Message)) {
    throw "release-main.ps1: -Message is required."
}

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$repoRoot = Split-Path -Parent $scriptDir
Set-Location $repoRoot

$bashCandidates = @(
    "C:\Program Files\Git\bin\bash.exe",
    "C:\Program Files\Git\usr\bin\bash.exe"
)

$bash = $bashCandidates | Where-Object { Test-Path $_ } | Select-Object -First 1
if (-not $bash) {
    throw "release-main.ps1: Git Bash was not found."
}

$argsList = New-Object System.Collections.Generic.List[string]
$argsList.Add((Join-Path $scriptDir 'release-main.sh'))
$argsList.Add('-m')
$argsList.Add($Message)

if ($DryRun) {
    $argsList.Add('--dry-run')
}

if ($Pathspec -and $Pathspec.Count -gt 0) {
    $argsList.Add('--')
    foreach ($item in $Pathspec) {
        $argsList.Add($item)
    }
}

& $bash @argsList
exit $LASTEXITCODE
