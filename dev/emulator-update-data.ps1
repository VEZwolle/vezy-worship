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
Write-Host "Login to Google-cloud, project [$projectName]:"
gcloud auth login
gcloud config set project $projectName
Write-Host "Login to firebase, project [$projectName]:"
firebase login
firebase use $projectName
Write-Host "Remove google cloud export firestore data [gs://$googleBucket/$exportFolder]:"
gsutil -m rm -r gs://$googleBucket/$exportFolder
Write-Host "Export production firebase project [$projectName] to emulator bucket [gs://$googleBucket/$exportFolder]"
gcloud firestore export gs://$googleBucket/$exportFolder
Write-Host "Get data from Google-cloud bucket [gs://$googleBucket/$exportFolder] to local [$rootFolder\$exportFolder]:"
gsutil -m cp -r gs://$googleBucket/$exportFolder $rootFolder
Write-Host "logout from google cloud:"
gcloud auth revoke
Write-Host "logout from firebase:"
firebase logout
