# SNOWTEE fruit-tea website update (no Python required).
# Use in the ROOT of the existing snowtee-menu repository, where public/index.html exists.
# Windows PowerShell 5.1 is included in Windows 10/11.
$ErrorActionPreference = 'Stop'
$root = $PSScriptRoot
$public = Join-Path $root 'public'
$poster = Join-Path $public 'assets\snowtee-fruit-tea-final.png'
$imageRef = 'assets/snowtee-fruit-tea-final.png'

if (-not (Test-Path (Join-Path $public 'index.html') -PathType Leaf)) {
  Write-Host 'ERROR: public/index.html was not found.' -ForegroundColor Red
  Write-Host 'Copy all extracted files into the existing snowtee-menu repository ROOT, then run again.'
  exit 1
}
if (-not (Test-Path $poster -PathType Leaf)) {
  Write-Host 'ERROR: Image file is missing: public/assets/snowtee-fruit-tea-final.png' -ForegroundColor Red
  exit 1
}

# Only the fruit-tea heading, questionable freshness claim, and matching image refs are changed.
$words = @(
  @('ซีรีส์ซาผลไม้สด','ซีรีส์ชาผลไม้'),
  @('ซีรีส์ซาผลไม้','ซีรีส์ชาผลไม้'),
  @('ซีรีส์ชาผลไม้สด','ซีรีส์ชาผลไม้'),
  @('ซาผลไม้สด','ชาผลไม้'),
  @('ชาผลไม้สด','ชาผลไม้'),
  @('ผลไม้สดเต็มคำ','')
)
# A URL/filename explicitly naming the fruit-tea poster can be replaced safely.
$quote = '["' + "'" + ']'
$notQuote = '[^"' + "'" + '\r\n]'
$imageFileExt = '(?:png|jpe?g|webp|avif|gif)'
$namedPath = '(?<q>' + $quote + ')(?<p>' + $notQuote + '{1,350}?(?:fruit[-_ ]?tea|fruittea|tea[-_ ]?fruit|ชาผลไม้)' + $notQuote + '*?\.' + $imageFileExt + ')\k<q>'
$namedPathRegex = [regex]::new($namedPath, [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)

# For category cards with generic image names, change ONLY when its name/title/id identifies fruit tea.
$objRegex = [regex]::new('\{[^{}]{0,1800}\}', [System.Text.RegularExpressions.RegexOptions]::Singleline)
$categoryName = '(?i)(?:["' + "'" + ']?(?:title|name|label|id|slug)["' + "'" + ']?)\s*:\s*["' + "'" + '](?:[^"' + "'" + ']{0,90})?(?:ชาผลไม้|fruit[-_ ]?tea|fruittea)'
$genericImageKey = '(?<pre>(?:["' + "'" + ']?(?:image|imageUrl|image_url|photo|poster|cover|src)["' + "'" + ']?)\s*:\s*' + $quote + ')(?<img>' + $notQuote + '{1,350}?\.' + $imageFileExt + ')(?<post>' + $quote + ')'
$imgKeyRegex = [regex]::new($genericImageKey, [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)
$htmlImgRegex = [regex]::new('<img\b[^>]{0,1500}>', [System.Text.RegularExpressions.RegexOptions]::IgnoreCase -bor [System.Text.RegularExpressions.RegexOptions]::Singleline)
$htmlSrc = [regex]::new('(?<pre>\bsrc\s*=\s*' + $quote + ')(?<img>' + $notQuote + '{1,350}?\.' + $imageFileExt + ')(?<post>' + $quote + ')', [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)

$textCount = 0
$imageCount = 0
$modified = New-Object System.Collections.Generic.List[string]
$stamp = Get-Date -Format 'yyyyMMdd-HHmmss'
$repoName = Split-Path $root -Leaf
$backupRoot = Join-Path (Split-Path $root -Parent) ($repoName + '-backup-fruit-tea-' + $stamp)
$utf8 = New-Object System.Text.UTF8Encoding($false)

$files = Get-ChildItem -Path $public -Recurse -File | Where-Object {
  $_.Extension -in @('.html', '.js', '.css', '.json') -and $_.FullName -notmatch '[\\/]node_modules[\\/]'
}
foreach ($file in $files) {
  $before = [System.IO.File]::ReadAllText($file.FullName)
  $after = $before
  foreach ($pair in $words) {
    $n = ([regex]::Matches($after, [regex]::Escape($pair[0]))).Count
    if ($n -gt 0) {
      $textCount += $n
      $after = $after.Replace($pair[0], $pair[1])
    }
  }

  $after = $namedPathRegex.Replace($after, [System.Text.RegularExpressions.MatchEvaluator]{
    param($match)
    $old = $match.Groups['p'].Value
    if ($old.EndsWith('snowtee-fruit-tea-final.png')) { return $match.Value }
    $script:imageCount++
    $newRef = $imageRef
    if ($old.StartsWith('/')) { $newRef = '/' + $newRef }
    return $match.Groups['q'].Value + $newRef + $match.Groups['q'].Value
  })

  # JS / JSON category object with an image key. Avoid product records whose category is fruit tea.
  $after = $objRegex.Replace($after, [System.Text.RegularExpressions.MatchEvaluator]{
    param($obj)
    $piece = $obj.Value
    if (-not [regex]::IsMatch($piece, $categoryName)) { return $piece }
    return $imgKeyRegex.Replace($piece, [System.Text.RegularExpressions.MatchEvaluator]{
      param($m)
      if ($m.Groups['img'].Value.EndsWith('snowtee-fruit-tea-final.png')) { return $m.Value }
      $script:imageCount++
      $newRef = $imageRef
      if ($m.Groups['img'].Value.StartsWith('/')) { $newRef = '/' + $newRef }
      return $m.Groups['pre'].Value + $newRef + $m.Groups['post'].Value
    }, 1)
  })

  # HTML img with an explicit fruit tea hint in its alt/class/id field.
  $after = $htmlImgRegex.Replace($after, [System.Text.RegularExpressions.MatchEvaluator]{
    param($tagMatch)
    $tag = $tagMatch.Value
    if ($tag -notmatch '(?:ชาผลไม้|fruit[-_ ]?tea|fruittea)') { return $tag }
    return $htmlSrc.Replace($tag, [System.Text.RegularExpressions.MatchEvaluator]{
      param($m)
      if ($m.Groups['img'].Value.EndsWith('snowtee-fruit-tea-final.png')) { return $m.Value }
      $script:imageCount++
      $newRef = $imageRef
      if ($m.Groups['img'].Value.StartsWith('/')) { $newRef = '/' + $newRef }
      return $m.Groups['pre'].Value + $newRef + $m.Groups['post'].Value
    }, 1)
  })

  if ($after -cne $before) {
    $relative = $file.FullName.Substring($root.Length).TrimStart('\','/')
    $backupTarget = Join-Path $backupRoot $relative
    $backupFolder = Split-Path $backupTarget -Parent
    New-Item -ItemType Directory -Path $backupFolder -Force | Out-Null
    Copy-Item -LiteralPath $file.FullName -Destination $backupTarget -Force
    [System.IO.File]::WriteAllText($file.FullName, $after, $utf8)
    $modified.Add($relative)
  }
}

Write-Host ''
Write-Host 'SNOWTEE fruit-tea update finished' -ForegroundColor Cyan
Write-Host ('Website files changed: ' + $modified.Count)
foreach ($name in $modified) { Write-Host ('  ' + $name) }
Write-Host ('Text occurrences corrected: ' + $textCount)
Write-Host ('Image references corrected: ' + $imageCount)
Write-Host ('New poster: public/assets/snowtee-fruit-tea-final.png')
if ($modified.Count -gt 0) { Write-Host ('Backup (outside repo): ' + $backupRoot) }
if ($imageCount -eq 0) {
  Write-Host ''
  Write-Host 'IMPORTANT: Image references corrected = 0' -ForegroundColor Yellow
  Write-Host 'The new poster is copied but may NOT show on the site yet.'
  Write-Host 'DO NOT PUSH until the image reference is matched. Send public/index.html and public/menu-data.js for precise editing.'
} else {
  Write-Host 'Check the fruit-tea image and all other menus locally. Then Commit and Push in GitHub Desktop.' -ForegroundColor Green
}
