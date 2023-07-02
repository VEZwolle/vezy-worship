$rootFolder = '.\dev'
$exportFolder = 'export-firestore'
$googleBucket = 'export-import-vezy-worship'
$projectName = 'vezy-worship'
Write-Host "Test to see if local export folder [$rootFolder\$exportFolder] exists"
if (Test-Path -Path $rootFolder\$exportFolder) {
  Write-Host "local firestore export [$rootFolder\$exportFolder] Exists -> Remove old data"
  Remove-Item $rootFolder\$exportFolder -Recurse -Force
} else {
  Write-Host "local firestore export [$rootFolder\$exportFolder] Don't Exists"
}
Write-Host "Get data from Google-cloud; Login:"
gcloud auth login
gcloud config set project $projectName
Write-Host "Get data from Google-cloud bucket [gs://$googleBucket/$exportFolder]:"
gsutil -m cp -r gs://$googleBucket/$exportFolder $rootFolder
Write-Host "logout:"
gcloud auth revoke
